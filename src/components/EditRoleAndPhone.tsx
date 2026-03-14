'use client'
import React, { useState } from 'react'
import { motion, AnimatePresence, Variants, Transition } from 'motion/react'
import { LuWrench, LuStore, LuUser, LuPhone, LuLock } from 'react-icons/lu'
import toast, { Toaster } from 'react-hot-toast'
import { FiCheckCircle } from "react-icons/fi"

const EditRoleAndPhone = () => {
    const [mobileNumber, setMobileNumber] = useState("")
    const [selectedRole, setSelectedRole] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const roles = [
        {
            id: 'admin',
            label: 'Admin',
            icon: LuWrench,
            disabled: true,
            errorMsg: 'Admin already\nexists'
        },
        {
            id: 'vendor',
            label: 'Vendor',
            icon: LuStore,
            disabled: false
        },
        {
            id: 'user',
            label: 'User',
            icon: LuUser,
            disabled: false
        },
    ]

    const handleContinue = async () => {
        setIsSubmitting(true)

        // Simulate API delay (e.g., verifying phone & updating role)
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSuccess(true)

        // Trigger Premium Toast Confirmation
        const roleName = roles.find(r => r.id === selectedRole)?.label;
        toast.success(`Successfully registered as ${roleName}!`, {
            duration: 4000,
            position: 'top-center',
            style: {
                borderRadius: '16px',
                background: '#1c1c1e',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                padding: '16px 24px',
                fontSize: '15px',
                fontWeight: 500
            },
            iconTheme: {
                primary: '#3b82f6', // Matches our blue button
                secondary: '#fff',
            },
        });

        // Reset success state after 3 seconds (or redirect user here)
        setTimeout(() => setIsSuccess(false), 3000)
    }

    const springConfig: Transition = {
        type: "spring",
        stiffness: 300,
        damping: 20,
    }

    const containerVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 30,
            scale: 0.98,
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants: Variants = {
        hidden: {
            opacity: 0,
            y: 15,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#030305] p-4 relative overflow-hidden font-sans">

            {/* The Toaster Component to render our notifications */}
            <Toaster />

            {/* Ambient Background Glows */}
            <div className="absolute top-[-15%] left-[-10%] w-125 h-125 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-15%] right-[-10%] w-125 h-125 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Premium Card */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-125 rounded-[2.5rem] p-8 sm:p-10 bg-[#0c0c0e]/80 backdrop-blur-xl border border-white/6 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)]"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="text-center mb-10">
                    <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight">
                        Choose Your Role
                    </h2>
                    <p className="text-[#8a8a93] text-sm font-medium">
                        Select your role and enter your mobile number to continue.
                    </p>
                </motion.div>

                {/* Mobile Input with Icon */}
                <motion.div variants={itemVariants} className="mb-8 relative group">
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-[#52525b] group-focus-within:text-blue-500 transition-colors">
                        <LuPhone size={20} />
                    </div>
                    <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="Enter Mobile Number"
                        className="w-full bg-white/3 hover:bg-white/5 border border-white/5 focus:border-blue-500/50 focus:bg-white/6 rounded-2xl pl-12 pr-5 py-4 text-white placeholder-[#52525b] focus:outline-none transition-all text-[15px] shadow-inner"
                    />
                </motion.div>

                {/* Role Selection Cards */}
                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
                    {roles.map((role) => {
                        const isSelected = selectedRole === role.id;
                        const Icon = role.icon;

                        return (
                            <motion.button
                                key={role.id}
                                onClick={() => !role.disabled && setSelectedRole(role.id)}
                                disabled={role.disabled || isSubmitting || isSuccess}
                                whileHover={!role.disabled && !isSelected ? { y: -4, scale: 1.02 } : {}}
                                whileTap={!role.disabled ? { scale: 0.96 } : {}}
                                className={`relative flex flex-col items-center justify-center p-4 rounded-2xl h-37.5 transition-all duration-300 overflow-hidden ${role.disabled
                                        ? 'bg-white/1 border border-white/2 cursor-not-allowed'
                                        : isSelected
                                            ? 'bg-blue-500/10 border border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                                            : 'bg-white/3 border border-white/5 hover:bg-white/6 hover:border-white/10 cursor-pointer'
                                    }`}
                            >
                                {/* Active State Background Glow */}
                                {isSelected && (
                                    <motion.div
                                        layoutId="activeGlow"
                                        className="absolute inset-0 bg-linear-to-b from-blue-500/20 to-transparent opacity-50"
                                        transition={springConfig}
                                    />
                                )}

                                <div className={`relative z-10 mb-4 transition-colors duration-300 ${role.disabled ? 'text-[#3f3f46]' : isSelected ? 'text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.5)]' : 'text-[#a1a1aa]'
                                    }`}>
                                    <Icon size={34} strokeWidth={isSelected ? 2 : 1.5} />
                                    {role.disabled && (
                                        <div className="absolute -bottom-1 -right-1 bg-[#0c0c0e] rounded-full p-0.5 text-[#f43f5e]">
                                            <LuLock size={12} strokeWidth={3} />
                                        </div>
                                    )}
                                </div>

                                <span className={`relative z-10 text-[15px] font-medium transition-colors ${role.disabled ? 'text-[#52525b]' : isSelected ? 'text-white' : 'text-[#e4e4e7]'
                                    }`}>
                                    {role.label}
                                </span>

                                {/* Disabled Error Message */}
                                {role.errorMsg && (
                                    <span className="relative z-10 text-[#f43f5e] text-[11px] text-center mt-2 leading-[1.3] font-medium tracking-wide">
                                        {role.errorMsg.split('\n').map((line, i) => (
                                            <React.Fragment key={i}>
                                                {line}
                                                <br />
                                            </React.Fragment>
                                        ))}
                                    </span>
                                )}

                                {/* Premium Checkmark for Selection */}
                                <AnimatePresence>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={springConfig}
                                            className="absolute top-3 right-3 text-blue-500"
                                        >
                                            <FiCheckCircle size={16} strokeWidth={2.5} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        )
                    })}
                </motion.div>

                {/* Continue / Success Button */}
                <motion.div variants={itemVariants}>
                    <button
                        onClick={handleContinue}
                        disabled={!mobileNumber || !selectedRole || isSubmitting || isSuccess}
                        className={`relative w-full overflow-hidden rounded-2xl py-4 font-semibold text-[16px] text-white transition-all duration-300 disabled:cursor-not-allowed group ${isSuccess ? 'bg-emerald-500 disabled:opacity-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'disabled:opacity-50'
                            }`}
                    >
                        {/* Gradient Background & Hover Animation (Hidden on Success) */}
                        {!isSuccess && (
                            <div className="absolute inset-0 bg-linear-to-r from-[#2563eb] to-[#3b82f6] transition-transform duration-300 group-hover:scale-105" />
                        )}

                        <div className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                                <>
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                    <span>Verifying...</span>
                                </>
                            ) : isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 text-white"
                                >
                                    <FiCheckCircle size={20} strokeWidth={2.5} />
                                    <span>Verified & Saved!</span>
                                </motion.div>
                            ) : (
                                "Continue"
                            )}
                        </div>
                    </button>
                </motion.div>

            </motion.div>
        </div>
    )
}

export default EditRoleAndPhone