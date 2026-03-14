'use client'
import React, { useEffect, useState } from 'react'
import { motion } from "motion/react"
import { FiArrowRight, FiLoader } from 'react-icons/fi'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'


const LoginFinal = () => {
    // Form & UI State
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const router = useRouter()


    // Handle traditional form submission
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const result = await signIn("credentials", { email, password, redirect: false })
            if (result?.error) {
                toast.error("Invalid email or password")
                setIsLoading(false)
                return
            }
            console.log(result)
            setIsLoading(false)
            toast.success("Welcome back!", {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    borderRadius: '12px', background: '#1a1a1a', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                },
                iconTheme: { primary: '#3b82f6', secondary: '#fff' },
            });
            router.push("/")
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }

    }

    // Handle Google Authentication
    const handleGoogleAuth = async () => {
        setIsGoogleLoading(true)
        // Simulate Google OAuth popup delay
        signIn("google", { callbackUrl: "/" })
        setIsGoogleLoading(false)

        toast.success(`Authenticated with Google!`, {
            duration: 4000,
            position: 'bottom-right',
            style: {
                borderRadius: '12px', background: '#1a1a1a', color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            },
            iconTheme: { primary: '#10b981', secondary: '#fff' },
        });
    }

    const fadeUpVariants = {
        hidden: {
            opacity: 0,
            y: 50
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.6, -0.05, 0.01, 0.99] as const
            }
        },
        exit: {
            opacity: 0,
            y: 50,
            transition: {
                duration: 0.4
            }
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#050505] text-white font-sans overflow-hidden">
            <Toaster />

            {/* --- LEFT SIDE: Rich Imagery & Branding --- */}
            <div className="hidden lg:flex relative w-1/2 p-12 flex-col justify-between overflow-hidden border-r border-white/10">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                        alt="Abstract fluid background"
                        className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-transparent to-[#050505]" />
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        M
                    </div>
                    <span className="text-xl font-semibold tracking-wide text-white">MultiCart</span>
                </div>

                <div className="relative z-10 max-w-lg mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
                    >
                        Welcome back to <span className="text-transparent bg-clip-text bg-linear-to-t from-gray-200 to-gray-500">MultiCart.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg text-gray-400 leading-relaxed font-light"
                    >
                        Sign in to access your unified dashboard, track your orders, or manage your storefront.
                    </motion.p>
                </div>

                <div className="relative z-10">
                    <p className="text-sm text-gray-600 font-medium tracking-wide">© 2026 MultiCart Inc.</p>
                </div>
            </div>

            {/* --- RIGHT SIDE: Interactive Form Area --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-[#050505] relative z-10">

                {/* Mobile Header */}
                <div className="absolute top-8 left-8 flex lg:hidden items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold">M</div>
                    <span className="font-semibold text-white">MultiCart</span>
                </div>

                <div className="w-full max-w-105 mt-20 lg:mt-0">
                    <motion.div variants={fadeUpVariants} initial="hidden" animate="visible" className="w-full">

                        <h2 className="text-3xl font-semibold mb-2 tracking-tight">Sign in to your account</h2>
                        <p className="text-gray-400 mb-8 text-sm">Enter your details below to continue.</p>

                        {/* --- Google Auth Button --- */}
                        <button
                            type="button"
                            onClick={handleGoogleAuth}
                            disabled={isGoogleLoading || isLoading}
                            className="w-full py-3.5 bg-white/3 hover:bg-white/8 border border-white/10 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGoogleLoading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                    <FiLoader size={18} className="text-gray-400" />
                                </motion.div>
                            ) : (
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            )}
                            Continue with Google
                        </button>

                        {/* --- Divider --- */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-white/10"></div>
                            <span className="text-xs text-gray-500 font-medium tracking-wider">OR</span>
                            <div className="flex-1 h-px bg-white/10"></div>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="emailAddress" className="text-xs font-medium text-gray-400 ml-1">Email Address</label>
                                <input
                                    id="emailAddress" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/3 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 focus:bg-white/5 transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="space-y-2 relative">
                                <div className="flex items-center justify-between px-1">
                                    <label htmlFor="password" className="text-xs font-medium text-gray-400">Password</label>
                                    <a href="#" className="text-xs font-medium text-gray-400 hover:text-white transition-colors">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/3 border border-white/10 rounded-xl p-4 pr-12 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 focus:bg-white/5 transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                type="submit" disabled={isLoading || isGoogleLoading} whileTap={!(isLoading || isGoogleLoading) ? { scale: 0.98 } : {}}
                                className="w-full py-4 mt-2 bg-white text-black hover:bg-gray-200 rounded-xl text-sm font-semibold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                            >
                                {isLoading ? (
                                    <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><FiLoader size={18} /></motion.div> Signing in...</>
                                ) : "Sign In"}
                            </motion.button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-8">
                            Don't have an account?{" "}
                            <Link
                                href="/register"
                                className="text-white hover:underline transition-all font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default LoginFinal