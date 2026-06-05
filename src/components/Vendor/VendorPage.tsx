'use client'

import { IUser } from '@/model/user.model'
import React, { useState, useEffect } from 'react'
import {
    LuLock, LuLockOpen, LuTriangle,
    LuStore, LuMapPin, LuFileText, LuX
} from 'react-icons/lu'
import { motion, AnimatePresence } from 'motion/react'
import VendorDashboard from './VendorDashboard'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'

const VendorPage = ({ user }: { user: IUser }) => {
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        shopName: user?.shopName || '',
        shopAddress: user?.shopAddress || '',
        gstNumber: user?.gstNumber || ''
    });

    useEffect(() => {
        if (user?.verificationStatus === "approved") {
            setIsUnlocking(true);
            const timer = setTimeout(() => setIsUnlocking(false), 2500);
            return () => clearTimeout(timer);
        }
    }, [user?.verificationStatus]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleReSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.post('/api/vendor/verifyAgain', {
                vendorId: user._id,
                shopName: formData.shopName,
                shopAddress: formData.shopAddress,
                gstNumber: formData.gstNumber
            });

            toast.success("Details updated! Your application is under review again.", {
                style: { background: '#09090b', color: '#10b981', borderRadius: '12px', border: '1px solid #27272a' }
            });
            setIsEditModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update details. Please try again.", {
                style: { background: '#09090b', color: '#ef4444', borderRadius: '12px', border: '1px solid #27272a' }
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return (
            <div className='w-full min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-100'>
                <div className="flex flex-col items-center gap-3">
                    <ClipLoader size={28} color='#3b82f6' />
                    <p className="text-zinc-500 text-xs font-semibold uppercase tracking-wider animate-pulse">Loading Workspace Terminal...</p>
                </div>
            </div>
        )
    }

    // ==========================================
    // 1. APPROVED FLOW (ACCESS GRANTED ANIMATION)
    // ==========================================
    if (user.verificationStatus === "approved") {
        if (isUnlocking) {
            return (
                <div className='relative w-full h-screen overflow-hidden bg-[#09090b]'>
                    <motion.div
                        initial={{ filter: "blur(16px)", opacity: 0.2, scale: 1.02 }}
                        animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
                        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
                        className="w-full h-full pointer-events-none select-none"
                    >
                        <VendorDashboard />
                    </motion.div>

                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none bg-black/20 backdrop-blur-xs">
                        <motion.div
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 1.3, opacity: 0, filter: "blur(8px)" }}
                            transition={{ duration: 0.8, ease: "easeIn", delay: 1.2 }}
                            className="relative flex flex-col items-center"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1.8 }}
                                transition={{ duration: 0.6 }}
                                className="absolute inset-0 bg-emerald-500/[0.08] blur-3xl rounded-full"
                            />
                            <motion.div
                                initial={{ rotateY: 0 }}
                                animate={{ rotateY: 180 }}
                                transition={{ duration: 0.6, type: "spring", damping: 15 }}
                            >
                                <LuLockOpen size={64} className="text-emerald-400 relative z-10 drop-shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="text-lg font-black text-emerald-400 mt-5 tracking-widest uppercase"
                            >
                                Terminal Unlocked
                            </motion.h2>
                        </motion.div>
                    </div>
                </div>
            );
        }

        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='w-full min-h-screen bg-[#09090b]'
            >
                <VendorDashboard />
            </motion.div>
        );
    }

    // ==========================================
    // 2. REJECTED / SUSPENDED STATE FLOW
    // ==========================================
    if (user.verificationStatus === "rejected") {
        const reason = (user as any).rejectedReason || (user as any).rejectedreason;

        return (
            <div className='relative w-full h-screen overflow-hidden bg-[#09090b]'>
                <div className="w-full h-full pointer-events-none select-none filter blur-lg opacity-10 scale-102 grayscale">
                    <VendorDashboard />
                </div>

                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#09090b]/80 backdrop-blur-lg p-6 text-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-red-500/[0.02] blur-[130px] rounded-full pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 flex flex-col items-center max-w-xl"
                    >
                        <div className="relative mb-5">
                            <div className="absolute inset-0 bg-red-500/10 blur-2xl rounded-full" />
                            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 relative z-10">
                                <LuTriangle size={32} />
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-black text-white mb-3 tracking-tight">
                            Verification Declined
                        </h1>

                        <p className="text-sm text-zinc-400 leading-relaxed mb-6 max-w-md">
                            Your merchant credentials could not be authorized automatically. Please modify your profile telemetry nodes to request immediate manual re-review.
                        </p>

                        {reason && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="w-full max-w-md bg-red-950/20 border border-red-500/20 rounded-xl p-4 mb-6 text-left"
                            >
                                <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                                    <span>System Rejection Reason</span>
                                </div>
                                <p className="text-zinc-300 text-xs leading-relaxed font-medium">
                                    {reason}
                                </p>
                            </motion.div>
                        )}

                        <div className="flex items-center gap-2 text-red-400 bg-red-500/5 px-4 py-2 rounded-xl border border-red-500/10 text-xs font-semibold uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-40 anonymity-ping animate-ping"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            Suspended Action Matrix
                        </div>

                        <div className="mt-8 flex items-center gap-4">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-5 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 rounded-xl text-xs font-bold transition-all transform active:scale-95 shadow-sm"
                            >
                                Update Credentials
                            </button>
                            <button
                                onClick={() => window.location.href = '/support'}
                                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-medium"
                            >
                                Contact Support Pipeline
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* --- UPDATE DETAILS DIALOG MODAL --- */}
                <AnimatePresence>
                    {isEditModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                                className="bg-[#09090b] border border-zinc-800 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden relative"
                            >
                                <div className="p-6 sm:p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-white tracking-tight">Modify Identity Parameters</h3>
                                            <p className="text-[11px] text-zinc-500 mt-0.5">Correct your commercial routing vectors below.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="text-zinc-500 hover:text-zinc-300 p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/40 transition-colors"
                                        >
                                            <LuX size={14} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleReSubmit} className="space-y-4 text-xs font-medium">
                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Shop Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600">
                                                    <LuStore size={15} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="shopName"
                                                    required
                                                    value={formData.shopName}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-zinc-900/20 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-zinc-200 placeholder-zinc-600 focus:outline-hidden focus:border-zinc-700 focus:bg-zinc-900/60 transition-all text-xs"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">GST Registry Code</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-600">
                                                    <LuFileText size={15} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="gstNumber"
                                                    required
                                                    value={formData.gstNumber}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-zinc-900/20 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-zinc-200 placeholder-zinc-600 focus:outline-hidden focus:border-zinc-700 focus:bg-zinc-900/60 transition-all uppercase text-xs font-mono"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 block">Physical Outpost Address</label>
                                            <div className="relative">
                                                <div className="absolute top-3 left-0 pl-3 pointer-events-none text-zinc-600">
                                                    <LuMapPin size={15} />
                                                </div>
                                                <textarea
                                                    name="shopAddress"
                                                    required
                                                    value={formData.shopAddress}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-zinc-900/20 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-4 text-zinc-200 placeholder-zinc-600 focus:outline-hidden focus:border-zinc-700 focus:bg-zinc-900/60 transition-all resize-none min-h-[80px] text-xs"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-2 shadow-md shadow-blue-900/20"
                                        >
                                            {isSubmitting ? <ClipLoader size={14} color='#fff' /> : 'Request Account Auditing'}
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    // ==========================================
    // 3. PENDING REVIEW STATE FLOW
    // ==========================================
    return (
        <div className='relative w-full h-screen overflow-hidden bg-[#09090b]'>
            <div className="w-full h-full pointer-events-none select-none filter blur-lg opacity-10 scale-102">
                <VendorDashboard />
            </div>

            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#09090b]/80 backdrop-blur-lg p-6 text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/[0.02] blur-[130px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="relative z-10 flex flex-col items-center max-w-xl"
                >
                    <div className="relative mb-5">
                        <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full" />
                        <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center text-zinc-300 relative z-10 shadow-xl">
                            <LuLock size={26} />
                        </div>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black text-white mb-3 tracking-tight">
                        Terminal Locked
                    </h1>

                    <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-xs sm:max-w-md">
                        Your enterprise merchant profile is currently processing within our vetting queue. Upon credential alignment, this wall will tear down automatically.
                    </p>

                    <div className="flex items-center gap-2 text-amber-400 bg-amber-500/5 px-4 py-2 rounded-xl border border-amber-500/10 text-xs font-semibold uppercase tracking-wider">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-40"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                        </span>
                        Pending Gate Authorization
                    </div>

                    <button
                        onClick={() => window.location.href = '/support'}
                        className="mt-10 text-xs text-zinc-500 hover:text-zinc-300 transition-all font-medium"
                    >
                        Encountering blockades? Contact Support
                    </button>
                </motion.div>
            </div>
        </div>
    )
}

export default VendorPage