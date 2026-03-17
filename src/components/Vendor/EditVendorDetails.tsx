'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AiOutlineFileText, AiOutlineHome, AiOutlineShop } from 'react-icons/ai'
import { LuStore } from 'react-icons/lu'
import { ClipLoader } from 'react-spinners'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const EditVendorDetails = () => {
    const [shopName, setShopName] = useState("")
    const [shopAddress, setShopAddress] = useState("")
    const [gstNumber, setGstNumber] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // FIX 1: Corrected logic to check if ANY field is empty
        if (!shopName || !shopAddress || !gstNumber) {
            toast.error(`Please Enter All the fields Correctly!`, {
                duration: 4000,
                position: 'top-center',
                style: {
                    borderRadius: '16px',
                    background: '#1c1c1e',
                    color: '#ef4444',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    padding: '16px 24px',
                    fontSize: '15px',
                    fontWeight: 500,
                },
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                },
            });
            // FIX 2: Must return early so the API doesn't fire
            return;
        }

        setLoading(true)
        try {
            const result = await axios.post("/api/vendor/editDetails", { shopName, shopAddress, gstNumber })
            console.log(result.data)

            // FIX 3: Changed colors to Emerald Green for success
            toast.success(`Vendor Shop Details Added Successfully!`, {
                duration: 3000,
                position: 'top-center',
                style: {
                    borderRadius: '16px',
                    background: '#1c1c1e',
                    color: '#10b981', // Emerald Green
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                    padding: '16px 24px',
                    fontSize: '15px',
                    fontWeight: 500,
                },
                iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                },
            });

            // Optional: Give the user a brief second to see the toast before routing
            setTimeout(() => {
                setLoading(false)
                router.push("/")
                router.refresh()
            }, 1000)

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const msg =
                    error.response?.data?.message || "Something went wrong";

                console.log("API ERROR:", error.response?.data);
                toast.error(msg);
            } else {
                console.log("Unknown error:", error);
                toast.error("Unexpected error occurred");
            }

            setLoading(false);
        }
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring" as const,
                stiffness: 300,
                damping: 24,
            },
        },
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-[#030305] text-white p-4 sm:p-6 relative overflow-hidden font-sans'>
            {/* Background Glowing Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none" />

            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className='w-full max-w-lg bg-white/2 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8 sm:p-10 border border-white/5 relative z-10'
                >
                    {/* Top Icon Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                            <LuStore size={32} />
                        </div>
                    </div>

                    <h3 className='text-3xl font-bold text-center mb-3 bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400'>
                        Vendor Profile
                    </h3>
                    <p className='text-center text-gray-400 mb-8 text-sm max-w-xs mx-auto leading-relaxed'>
                        Enter your business information to activate and configure your vendor dashboard.
                    </p>

                    <motion.form
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        onSubmit={handleSubmit}
                        className='flex flex-col gap-5'
                    >
                        {/* Shop Name Input */}
                        <motion.div variants={itemVariants} className='relative group'>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-violet-400 transition-colors">
                                <AiOutlineShop size={22} />
                            </div>
                            <input
                                type="text"
                                placeholder='Shop Name'
                                required
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                className='w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/3 transition-all shadow-inner'
                            />
                        </motion.div>

                        {/* Shop Address Input */}
                        <motion.div variants={itemVariants} className='relative group'>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-violet-400 transition-colors">
                                <AiOutlineHome size={22} />
                            </div>
                            <input
                                type="text"
                                placeholder='Complete Business Address'
                                required
                                value={shopAddress}
                                onChange={(e) => setShopAddress(e.target.value)}
                                className='w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/3 transition-all shadow-inner'
                            />
                        </motion.div>

                        {/* GST Number Input */}
                        <motion.div variants={itemVariants} className='relative group'>
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-violet-400 transition-colors">
                                <AiOutlineFileText size={22} />
                            </div>
                            <input
                                type="text"
                                placeholder='GST Identification Number'
                                required
                                value={gstNumber}
                                onChange={(e) => setGstNumber(e.target.value)}
                                className='w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:bg-white/3 transition-all shadow-inner uppercase'
                            />
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            variants={itemVariants}
                            type='submit'
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='mt-4 px-8 py-4 flex items-center justify-center gap-2 bg-linear-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-2xl font-semibold text-white w-full transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-70 disabled:cursor-not-allowed'
                        >
                            {loading ? <ClipLoader size={22} color="white" /> : "Activate Account"}
                        </motion.button>
                    </motion.form>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default EditVendorDetails