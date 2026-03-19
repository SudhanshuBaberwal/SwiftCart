'use client'
import { IUser } from '@/model/user.model'
import React, { useState, useEffect } from 'react'
import {
    LuLock, LuLockOpen, LuCircle, LuTriangle,
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
                style: { background: '#1c1c1e', color: '#10b981', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }
            });
            setIsEditModalOpen(false);
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update details. Please try again.", {
                style: { background: '#1c1c1e', color: '#ef4444', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }
            });
        } finally {
            setIsSubmitting(false);
        }
    };
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

    // --- Approved State ---
    if (user.verificationStatus === "approved") {
        if (isUnlocking) {
            return (
                <div className='relative w-full h-screen overflow-hidden bg-[#030305]'>
                    <motion.div
                        initial={{ filter: "blur(12px)", opacity: 0.3, scale: 1.05 }}
                        animate={{ filter: "blur(0px)", opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                        className="absolute inset-0 pointer-events-none select-none"
                    >
                        <VendorDashboard />
                    </motion.div>

                    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 1.5, opacity: 0, filter: "blur(10px)" }}
                            transition={{ duration: 0.8, ease: "easeIn", delay: 1 }}
                            className="relative flex flex-col items-center"
                        >
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

    // --- Cancelled / Rejected State ---
    if (user.verificationStatus === "rejected") {
        const reason = (user as any).rejectedReason || (user as any).rejectedreason;

        return (
            <div className='relative w-full h-screen overflow-hidden bg-[#030305]'>
                <div className="absolute inset-0 pointer-events-none select-none filter blur-md opacity-20 scale-105 grayscale">
                    <VendorDashboard />
                </div>

                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-red-950/40 backdrop-blur-md p-6 text-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-red-600/10 blur-[150px] rounded-full pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 flex flex-col items-center max-w-2xl"
                    >
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-red-500/40 blur-3xl rounded-full animate-pulse" />
                            <LuCircle size={72} className="text-red-500 relative z-10 drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]" />
                        </div>

                        <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-2xl">
                            Access Denied
                        </h1>

                        <p className="text-lg text-gray-300 leading-relaxed mb-6 drop-shadow-md max-w-lg">
                            Your vendor application could not be verified. Please review our guidelines and update your business details to reapply.
                        </p>

                        {reason && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-full max-w-lg bg-red-500/10 border border-red-500/20 rounded-2xl p-5 mb-8 text-left backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-2 text-red-400 font-semibold mb-2 uppercase tracking-wide text-xs">
                                    <LuTriangle size={16} />
                                    <span>Reason for Rejection</span>
                                </div>
                                <p className="text-gray-200 text-sm leading-relaxed">
                                    {reason}
                                </p>
                            </motion.div>
                        )}

                        <div className="flex items-center gap-3 text-red-400 bg-black/50 px-6 py-3 rounded-full border border-red-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.15)]">
                            <span className="relative flex h-3 w-3">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-50 animate-ping"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                            <span className="font-semibold tracking-wide uppercase text-sm">Verification Failed</span>
                        </div>

                        <div className="mt-10 flex items-center gap-6">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-xl font-bold transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
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

                {/* --- UPDATE DETAILS MODAL --- */}
                <AnimatePresence>
                    {isEditModalOpen && (
                        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="bg-[#0a0a0c] border border-white/10 shadow-2xl rounded-[2.5rem] w-full max-w-md overflow-hidden relative"
                            >
                                {/* Modal Header Background Glow */}
                                <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-violet-600/20 to-transparent pointer-events-none" />

                                <div className="p-8 relative z-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-2xl font-bold text-white">Update Details</h3>
                                        <button
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                                        >
                                            <LuX size={20} />
                                        </button>
                                    </div>

                                    <form onSubmit={handleReSubmit} className="space-y-4 text-sm">

                                        {/* Shop Name Input */}
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1.5 ml-1 block">Shop Name</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                                                    <LuStore size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="shopName"
                                                    required
                                                    value={formData.shopName}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
                                                />
                                            </div>
                                        </div>

                                        {/* GST Number Input */}
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1.5 ml-1 block">GST Number</label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                                                    <LuFileText size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="gstNumber"
                                                    required
                                                    value={formData.gstNumber}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all uppercase"
                                                />
                                            </div>
                                        </div>

                                        {/* Address Textarea */}
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1.5 ml-1 block">Business Address</label>
                                            <div className="relative">
                                                <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none text-gray-500">
                                                    <LuMapPin size={18} />
                                                </div>
                                                <textarea
                                                    name="shopAddress"
                                                    required
                                                    value={formData.shopAddress}
                                                    onChange={handleInputChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none min-h-25"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full mt-6 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)] flex justify-center items-center gap-2"
                                        >
                                            {isSubmitting ? <ClipLoader size={18} color='#fff' /> : 'Submit for Verification'}
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

    // --- Pending State ---
    return (
        <div className='relative w-full h-screen overflow-hidden bg-[#030305]'>
            <div className="absolute inset-0 pointer-events-none select-none filter blur-md opacity-30 scale-105 transition-all duration-1000">
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