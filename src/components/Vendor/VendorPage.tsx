'use client'
import { IUser } from '@/model/user.model'
import React, { useState, useEffect } from 'react'
import { LuLock, LuLockOpen, LuCircle } from 'react-icons/lu'
import { motion, AnimatePresence } from 'motion/react'
import VendorDashboard from './VendorDashboard'

const VendorPage = ({ user }: { user: IUser }) => {
    // State to control the one-time "Unlock" animation on mount
    const [isUnlocking, setIsUnlocking] = useState(false);

    useEffect(() => {
        // If the user is approved, trigger the unlock animation
        if (user?.verificationStatus === "approved") {
            setIsUnlocking(true);
            // After 2.5 seconds, remove the animation layer completely
            const timer = setTimeout(() => setIsUnlocking(false), 2500);
            return () => clearTimeout(timer);
        }
    }, [user?.verificationStatus]);

    // 1. Loading State
    if (!user) {
        return (
            <div className='w-full min-h-screen flex items-center justify-center bg-[#030305] text-white'>
                <div className="flex flex-col items-center gap-4">
                    <span className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></span>
                    <p className="text-gray-400 font-medium tracking-wide animate-pulse">Loading Workspace...</p>
                </div>
            </div>
        )
    }

    // 2. Approved State (With Unlock Animation)
    if (user.verificationStatus === "approved") {
        if (isUnlocking) {
            return (
                <div className='relative w-full h-screen overflow-hidden bg-[#030305]'>
                    {/* BACKGROUND: Fading from blur to clear */}
                    <motion.div 
                        initial={{ filter: "blur(12px)", opacity: 0.3, scale: 1.05 }}
                        animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                        className="absolute inset-0 pointer-events-none select-none"
                    >
                        <VendorDashboard />
                    </motion.div>

                    {/* FOREGROUND: Lock Breaking Animation */}
                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 1.5, opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 0.8, ease: "easeIn", delay: 1 }}
                            className="relative flex flex-col items-center"
                        >
                            {/* Green glow explosion */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 2 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 bg-emerald-500/40 blur-3xl rounded-full" 
                            />
                            
                            <motion.div
                                initial={{ rotateY: 0 }}
                                animate={{ rotateY: 180 }}
                                transition={{ duration: 0.5, type: "spring" }}
                            >
                                <LuLockOpen size={80} className="text-emerald-400 relative z-10 drop-shadow-[0_0_30px_rgba(16,185,129,0.6)]" />
                            </motion.div>

                            <motion.h2 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-2xl font-bold text-emerald-400 mt-6 tracking-widest uppercase drop-shadow-lg"
                            >
                                Access Granted
                            </motion.h2>
                        </motion.div>
                    </div>
                </div>
            );
        }

        // Normal Dashboard once the animation finishes
        return (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className='w-full min-h-screen bg-[#030305]'
            >
                <VendorDashboard />
            </motion.div>
        );
    }

    // 3. Cancelled / Rejected State
    if (user.verificationStatus === "rejected") {
        return (
            <div className='relative w-full h-screen overflow-hidden bg-[#030305]'>
                <div className="absolute inset-0 pointer-events-none select-none filter blur-[12px] opacity-20 scale-105 grayscale">
                    <VendorDashboard />
                </div>
                
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-red-950/40 backdrop-blur-md p-6 text-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 flex flex-col items-center max-w-2xl"
                    >
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-red-500/40 blur-3xl rounded-full animate-pulse" />
                            <LuCircle size={72} className="text-red-500 relative z-10 drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]" />
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
                            Access Denied
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 drop-shadow-md max-w-lg">
                            Your vendor application could not be verified. Please review our guidelines and update your business details to reapply.
                        </p>

                        <div className="flex items-center gap-3 text-red-400 bg-black/50 px-6 py-3 rounded-full border border-red-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                            <span className="relative flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-50 animate-ping"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="font-semibold tracking-wide uppercase text-sm">Verification Failed</span>
                        </div>

                        <div className="mt-12 flex items-center gap-6">
                            <button 
                                onClick={() => window.location.href = '/vendor/editDetails'}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-white/10"
                            >
                                Update Details
                            </button>
                            <button 
                                onClick={() => window.location.href = '/support'}
                                className="text-sm text-gray-400 hover:text-white transition-colors hover:underline underline-offset-4"
                            >
                                Contact Support
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        )
    }

    // 4. Pending State (Default fallback if not approved or rejected)
    return (
        <div className='relative w-full h-screen overflow-hidden bg-[#030305]'>
            <div className="absolute inset-0 pointer-events-none select-none filter blur-[12px] opacity-30 scale-105 transition-all duration-1000">
                <VendorDashboard />
            </div>

            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-md p-6 text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />

                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative z-10 flex flex-col items-center max-w-2xl"
                >
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-violet-500/40 blur-3xl rounded-full animate-pulse" />
                        <LuLock size={72} className="text-white relative z-10 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
                    </div>

                    <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
                        Workspace Locked
                    </h1>
                    
                    <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 drop-shadow-md max-w-lg">
                        Your vendor application is currently under review. Once our team verifies your details, this dashboard will automatically unlock.
                    </p>

                    <div className="flex items-center gap-3 text-orange-400 bg-black/40 px-6 py-3 rounded-full border border-orange-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                        </span>
                        <span className="font-semibold tracking-wide uppercase text-sm">Pending Verification</span>
                    </div>

                    <button 
                        onClick={() => window.location.href = '/support'}
                        className="mt-12 text-sm text-gray-400 hover:text-white transition-colors hover:underline underline-offset-4"
                    >
                        Need help? Contact Support
                    </button>
                </motion.div>
            </div>
        </div>
    )
}

export default VendorPage