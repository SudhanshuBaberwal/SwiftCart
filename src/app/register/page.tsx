'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion, Variants, Transition } from "framer-motion"
import { FiUser, FiBriefcase, FiShield, FiArrowRight, FiArrowLeft, FiCheckCircle, FiLoader } from 'react-icons/fi'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { signIn } from 'next-auth/react'

const RegisterFinal = () => {
    const [step, setStep] = useState<1 | 2>(1)

    // Form & UI State
    const [accountType, setAccountType] = useState<string | null>(null)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)
    const router = useRouter()

    // Handle traditional form submission with Axios
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const result = await axios.post("/api/auth/register", { name, email, password })
            console.log(result.data)

            toast.success("Account created successfully!", {
                duration: 4000,
                position: 'bottom-right',
                style: {
                    borderRadius: '12px', background: '#1a1a1a', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                },
                iconTheme: { primary: '#3b82f6', secondary: '#fff' },
            });

            // Clear form and redirect
            setName("")
            setPassword("")
            setEmail("")
            router.push("/login")

        } catch (error) {
            console.error("Registration error:", error)
            toast.error("Failed to create account. Please try again.", {
                style: { borderRadius: '12px', background: '#1a1a1a', color: '#fff' }
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Handle Google Authentication
    const handleGoogleAuth = async () => {
        try {
            setIsGoogleLoading(true)

            await signIn("google", {
                callbackUrl: "/"
            })

        } catch (error) {
            toast.error("Google authentication failed")
            setIsGoogleLoading(false)
        }
    }

    const getPasswordStrength = () => {
        if (password.length === 0) return 0
        if (password.length < 6) return 1
        if (password.length < 10) return 2
        return 3
    }
    const passStrength = getPasswordStrength()

    // --- Premium Animation Variants ---
    const softSpring: Transition = {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.5,
        delay: 0.1
    }

    const rigidSpring: Transition = {
        type: "spring",
        stiffness: 300,
        damping: 25,
        mass: 0.5,
        delay: 0.1
    }

    const staggerParent: Variants = {
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

    const cardStaggerParent = {
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
    };

    const childElement: Variants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: 50,
            transition: { duration: 0.4 }
        }
    }

    const cardElement: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        exit: {
            opacity: 0,
            y: 40,
            transition: { duration: 0.4 }
        }
    }

    const stepSwitchVariants: Variants = {
        hidden: {
            x: 30,
            y: 10,
            opacity: 0,
            filter: "blur(5px)",
            scale: 0.98
        },
        visible: {
            x: 0,
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            transition: rigidSpring
        },
        exit: {
            x: -30,
            y: -10,
            opacity: 0,
            filter: "blur(5px)",
            scale: 1.02,
            transition: {
                duration: 0.4,
                ease: "easeInOut"
            }
        }
    }

    const roles = [
        { id: 'user', title: 'Personal Account', desc: 'Shop across thousands of stores with a single unified cart.', icon: <FiUser size={22} /> },
        { id: 'vendor', title: 'Vendor Account', desc: 'Set up your storefront and start selling to millions globally.', icon: <FiBriefcase size={22} /> },
        { id: 'admin', title: 'Admin / Staff', desc: 'Access the dashboard to manage platform operations.', icon: <FiShield size={22} /> },
    ]

    return (
        <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#050505] text-white font-sans overflow-hidden">
            <Toaster />

            {/* --- LEFT SIDE: Branding --- */}
            <div className="hidden lg:flex relative w-1/2 p-12 flex-col justify-between overflow-hidden border-r border-white/10">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
                        alt="Abstract fluid background"
                        className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-r from-[#050505] via-transparent to-[#050505]" />
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, ...softSpring }} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-bold text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                        M
                    </motion.div>
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl font-semibold tracking-wide text-white">MultiCart</motion.span>
                </div>

                <div className="relative z-10 max-w-lg mb-20">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
                    >
                        Commerce without <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-200 to-gray-500">boundaries.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-lg text-gray-400 leading-relaxed font-light"
                    >
                        Join the next-generation e-commerce ecosystem. Whether you are shopping for the future or building it, everything you need is right here.
                    </motion.p>
                </div>

                <div className="relative z-10">
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-sm text-gray-600 font-medium tracking-wide">© 2026 MultiCart Inc.</motion.p>
                </div>
            </div>

            {/* --- RIGHT SIDE: Form Area --- */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 bg-[#050505] relative z-10">

                <div className="absolute top-8 left-8 flex lg:hidden items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold">M</div>
                    <span className="font-semibold text-white">MultiCart</span>
                </div>

                <div className="w-full max-w-105 mt-20 lg:mt-0">
                    <AnimatePresence mode='wait' custom={step}>

                        {/* --- STEP 1: Role Selection --- */}
                        {step === 1 && (
                            <motion.div key="step1" custom={step} variants={stepSwitchVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                                <motion.div variants={staggerParent}>
                                    <motion.h2 variants={childElement} className="text-3xl font-semibold mb-2 tracking-tight">Welcome to the platform</motion.h2>
                                    <motion.p variants={childElement} className="text-gray-400 mb-8 text-sm">Select your account type to get started.</motion.p>

                                    <motion.div variants={cardStaggerParent} className="space-y-3 mb-8">
                                        {roles.map((role) => (
                                            <motion.div
                                                key={role.id} variants={cardElement} onClick={() => setAccountType(role.id)} whileHover={{ y: -3, transition: { ...softSpring } }} whileTap={{ scale: 0.99 }}
                                                className={`relative overflow-hidden cursor-pointer rounded-2xl p-5 border transition-all duration-300 flex items-start gap-4 ${accountType === role.id ? 'bg-white/8 border-white/30' : 'bg-white/2 border-white/5 hover:bg-white/4'}`}
                                            >
                                                <div className={`mt-0.5 p-2.5 rounded-xl transition-colors ${accountType === role.id ? 'bg-white text-black shadow-lg shadow-white/20' : 'bg-white/5 text-gray-400'}`}>
                                                    {role.icon}
                                                </div>
                                                <div className="flex-1 pr-6">
                                                    <h3 className={`text-base font-medium mb-1 transition-colors ${accountType === role.id ? 'text-white' : 'text-gray-300'}`}>{role.title}</h3>
                                                    <p className="text-sm text-gray-500 leading-relaxed">{role.desc}</p>
                                                </div>
                                                {accountType === role.id && <motion.div initial={{ scale: 0, y: -10 }} animate={{ scale: 1, y: 0 }} transition={{ ...softSpring }} className="absolute top-5 right-5 text-white"><FiCheckCircle size={20} /></motion.div>}
                                            </motion.div>
                                        ))}
                                    </motion.div>

                                    <motion.button
                                        variants={childElement} onClick={() => setStep(2)} disabled={!accountType} whileTap={accountType ? { scale: 0.98 } : {}}
                                        className={`w-full py-4 flex items-center justify-center gap-3 rounded-xl text-sm font-semibold transition-all duration-300 ${accountType ? 'bg-white text-black hover:bg-gray-200 cursor-pointer shadow-xl' : 'bg-white/5 text-gray-700 cursor-not-allowed'}`}
                                    >
                                        Continue Setup <FiArrowRight size={18} />
                                    </motion.button>
                                </motion.div>

                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center text-sm text-gray-500 mt-8">
                                    Already have an account? <span onClick={() => router.push("/login")} className="text-white hover:underline transition-all cursor-pointer">Log in</span>
                                </motion.p>
                            </motion.div>
                        )}

                        {/* --- STEP 2: Account Details --- */}
                        {step === 2 && (
                            <motion.div key="step2" custom={step} variants={stepSwitchVariants} initial="hidden" animate="visible" exit="exit" className="w-full">
                                <button onClick={() => setStep(1)} className="mb-8 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group cursor-pointer w-fit">
                                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back
                                </button>

                                <motion.div variants={staggerParent}>
                                    <motion.h2 variants={childElement} className="text-3xl font-semibold mb-2 tracking-tight">Create your account</motion.h2>
                                    <motion.p variants={childElement} className="text-gray-400 mb-8 text-sm">Fill in your details for your <span className="text-white capitalize font-medium">{accountType}</span> profile.</motion.p>

                                    <motion.div variants={cardStaggerParent} className="space-y-5">

                                        <motion.button
                                            variants={cardElement} type="button" onClick={handleGoogleAuth} disabled={isGoogleLoading || isLoading}
                                            className="w-full py-3.5 bg-white/3 hover:bg-white/8 border border-white/10 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isGoogleLoading ? (
                                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><FiLoader size={18} className="text-gray-400" /></motion.div>
                                            ) : (
                                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                </svg>
                                            )}
                                            Sign up with Google
                                        </motion.button>

                                        <motion.div variants={cardElement} className="flex items-center gap-4 my-6">
                                            <div className="flex-1 h-px bg-white/10"></div>
                                            <span className="text-xs text-gray-500 font-medium tracking-wider">OR</span>
                                            <div className="flex-1 h-px bg-white/10"></div>
                                        </motion.div>

                                        <form onSubmit={handleRegister} className="space-y-5">
                                            <motion.div variants={cardElement} className="space-y-2">
                                                <label htmlFor="fullName" className="text-xs font-medium text-gray-400 ml-1">Full Name</label>
                                                <input
                                                    id="fullName" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                                                    className="w-full bg-white/3 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 focus:bg-white/5 transition-all"
                                                    placeholder="Jane Doe"
                                                />
                                            </motion.div>

                                            <motion.div variants={cardElement} className="space-y-2">
                                                <label htmlFor="emailAddress" className="text-xs font-medium text-gray-400 ml-1">Email Address</label>
                                                <input
                                                    id="emailAddress" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-white/3 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/40 focus:bg-white/5 transition-all"
                                                    placeholder="jane@example.com"
                                                />
                                            </motion.div>

                                            <motion.div variants={cardElement} className="space-y-2 relative">
                                                <label htmlFor="password" className="text-xs font-medium text-gray-400 ml-1">Password</label>
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

                                                <div className="flex gap-1 mt-2 px-1">
                                                    <div className={`h-1 w-full rounded-full transition-colors duration-300 ${passStrength >= 1 ? (passStrength === 1 ? 'bg-red-500' : passStrength === 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-white/10'}`} />
                                                    <div className={`h-1 w-full rounded-full transition-colors duration-300 ${passStrength >= 2 ? (passStrength === 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-white/10'}`} />
                                                    <div className={`h-1 w-full rounded-full transition-colors duration-300 ${passStrength >= 3 ? 'bg-green-500' : 'bg-white/10'}`} />
                                                </div>
                                            </motion.div>

                                            <motion.button
                                                variants={cardElement} type="submit" disabled={isLoading || isGoogleLoading} whileTap={!(isLoading || isGoogleLoading) ? { scale: 0.98 } : {}}
                                                className="w-full py-4 mt-2 bg-white text-black hover:bg-gray-200 rounded-xl text-sm font-semibold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-wait"
                                            >
                                                {isLoading ? (
                                                    <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><FiLoader size={18} /></motion.div> Creating Account...</>
                                                ) : "Complete Registration"}
                                            </motion.button>
                                        </form>
                                    </motion.div>
                                </motion.div>

                                <p className="text-center text-xs text-gray-500 mt-8">
                                    By registering, you agree to our <a href="#" className="underline hover:text-white transition-colors">Terms of Service</a> and <a href="#" className="underline hover:text-white transition-colors">Privacy Policy</a>.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

export default RegisterFinal