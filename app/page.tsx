import { FaEnvelope, FaCode, FaTerminal, FaCheckCircle } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-blue-500/30">
      <main className="max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="mb-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-400 mb-6 ring-1 ring-blue-500/20">
            <FaEnvelope className="text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent mb-4">
            Email Microservice API
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            A simple, secure, and reliable API for sending emails. Integrated with Nodemailer and Prisma logging.
          </p>
        </header>

        {/* Endpoint Section */}
        <section className="space-y-12">

          {/* Send Email Endpoint */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 overflow-hidden backdrop-blur-sm">
            <div className="border-b border-zinc-800 px-6 py-4 flex items-center gap-3 bg-zinc-900/80">
              <span className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-bold tracking-wide border border-green-500/20">
                POST
              </span>
              <code className="text-sm font-mono text-zinc-300">/api/send-email</code>
            </div>

            <div className="p-6 md:p-8 space-y-8">

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <FaCheckCircle className="text-zinc-500" /> Description
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Sends an email to the specified recipient. The request is authenticated using an API token and the action is logged in the database.
                </p>
              </div>

              {/* Headers */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FaCode className="text-zinc-500" /> Headers
                </h3>
                <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-500">
                        <th className="pb-2 font-medium">Key</th>
                        <th className="pb-2 font-medium">Value</th>
                        <th className="pb-2 font-medium">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-zinc-300">
                      <tr className="group">
                        <td className="pt-3 font-mono text-blue-400">x-api-token</td>
                        <td className="pt-3 font-mono text-zinc-500">&lt;YOUR_TOKEN&gt;</td>
                        <td className="pt-3 text-zinc-400">Your unique API authentication token.</td>
                      </tr>
                      <tr>
                        <td className="pt-2 font-mono text-blue-400">Content-Type</td>
                        <td className="pt-2 font-mono text-zinc-500">application/json</td>
                        <td className="pt-2 text-zinc-400">Required for JSON body.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Body */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FaCode className="text-zinc-500" /> Request Body
                </h3>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-30 transition duration-500 blur"></div>
                  <pre className="relative bg-zinc-950 rounded-xl border border-zinc-800 p-5 overflow-x-auto text-sm font-mono text-zinc-300">
                    {`{
  "recipient": "user@example.com",
  "subject": "Welcome to our service",
  "body": "<h1>Hello!</h1><p>This is a test email.</p>"
}`}
                  </pre>
                </div>
              </div>

              {/* Example Request */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FaTerminal className="text-zinc-500" /> Example Usage
                </h3>
                <div className="bg-black rounded-xl border border-zinc-800 p-5 overflow-x-auto">
                  <code className="text-sm font-mono text-green-400">
                    curl -X POST http://localhost:3000/api/send-email \<br />
                    &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                    &nbsp;&nbsp;-H "x-api-token: YOUR_TOKEN" \<br />
                    &nbsp;&nbsp;-d '&#123;"recipient": "test@example.com", "subject": "Hi", "body": "Testing"&#125;'
                  </code>
                </div>
              </div>

            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
