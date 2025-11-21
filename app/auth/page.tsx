'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaExclamationCircle } from 'react-icons/fa'

function Page() {
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const router = useRouter()

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await fetch(`/api/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
            const data = await res.json()

            if (data.success) {
                localStorage.setItem("token", data.token)
                router.push("/dashboard")
            } else {
                setError(data.message || "Authentication failed")
            }
        } catch (err) {
            setError("An unexpected error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-200 font-sans p-4'>
            <div className='w-full max-w-md bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-xl backdrop-blur-sm'>

                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-white mb-2'>Welcome Back</h1>
                    <p className='text-zinc-400'>Sign in to manage your email microservice</p>
                </div>

                {error && (
                    <div className='mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2'>
                        <FaExclamationCircle className='text-lg shrink-0' />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSignIn} className='space-y-6'>
                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-zinc-300 ml-1'>Email Address</label>
                        <div className='relative group'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <FaEnvelope className='text-zinc-500 group-focus-within:text-blue-500 transition-colors' />
                            </div>
                            <input
                                type="email"
                                required
                                className='w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-600'
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className='space-y-2'>
                        <label className='text-sm font-medium text-zinc-300 ml-1'>Password</label>
                        <div className='relative group'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <FaLock className='text-zinc-500 group-focus-within:text-blue-500 transition-colors' />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className='w-full bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-xl py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-600'
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors'
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className='w-full bg-white text-black font-semibold rounded-xl py-3 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className='mt-6 text-center'>
                    <p className='text-sm text-zinc-500'>
                        Forgot your password? <span className='text-blue-400 hover:text-blue-300 cursor-pointer transition-colors'>Contact Admin</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page
