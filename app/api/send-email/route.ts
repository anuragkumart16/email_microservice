import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import prisma from "@/lib/dbInstance";
import { withAppAuth } from "@/lib/authMiddleware";

async function handler(req: Request) {
  try {
    const { recipient, subject, body } = await req.json();

    if (!recipient || !subject || !body) {
      return NextResponse.json(
        { message: "Missing required fields: recipient, subject, body", success: false },
        { status: 400 }
      );
    }

    // Get the app from the request headers (set by middleware logic conceptually, 
    // but here we re-fetch or rely on the token hash again if needed, 
    // however, the middleware already validated the token. 
    // To link the log to the app, we need the app ID.
    // Since the middleware didn't attach the app to the request object explicitly in the provided code,
    // we will re-fetch the app using the token.
    
    const token = req.headers.get("x-api-token");
    // We know token exists because middleware passed
    const crypto = require("crypto");
    const hashid = crypto.createHash("sha256").update(token!).digest("hex");
    
    const app = await prisma.app.findFirst({
      where: { hashid },
    });

    if (!app) {
        // Should not happen if middleware works, but safety check
        return NextResponse.json({ message: "App not found", success: false }, { status: 401 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipient,
      subject: subject,
      html: body,
    };

    try {
      await transporter.sendMail(mailOptions);
      
      await prisma.emailLog.create({
        data: {
          recipient,
          subject,
          body,
          status: "SENT",
          appId: app.id,
        },
      });

      return NextResponse.json({ message: "Email sent successfully", success: true });
    } catch (emailError: any) {
      console.error("Email sending error:", emailError);
      
      await prisma.emailLog.create({
        data: {
          recipient,
          subject,
          body,
          status: "FAILED",
          error: emailError.message || "Unknown error",
          appId: app.id,
        },
      });

      return NextResponse.json(
        { message: "Failed to send email", success: false, error: emailError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Route Handler Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}

export const POST = withAppAuth(handler);
