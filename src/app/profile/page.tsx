"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";
import {
    LuUser, LuStore, LuPackage, LuCamera,
    LuMail, LuPhone, LuMapPin, LuFileText, LuShieldCheck,
    LuClock
} from "react-icons/lu";
import UseGetCurrentUser from "@/hooks/UseGetCurrentUser";
import { AppDispatch, RootState } from "@/redux/store";
import { setUserData } from "@/redux/userSlice";

// Form Types
type ProfileFormData = {
    name: string;
    phone: string;
    image: File;
};

type ShopFormData = {
    shopName: string;
    shopAddress: string;
    gstNumber: string;
};

const ProfilePage = () => {
    UseGetCurrentUser();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.user.userData);
    
    const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'shop'>('overview');
    const [previewImage, setPreviewImage] = useState(user?.image || "");
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
    const [isSubmittingShop, setIsSubmittingShop] = useState(false);

    // React Hook Form for Profile
    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile
    } = useForm<ProfileFormData>();

    // React Hook Form for Shop Details
    const {
        register: registerShop,
        handleSubmit: handleSubmitShop,
        reset: resetShop
    } = useForm<ShopFormData>();

    // Update forms when user data loads
    useEffect(() => {
        if (user) {
            resetProfile({ name: user.name, phone: user.phone });
            resetShop({ shopName: user.shopName, shopAddress: user.shopAddress, gstNumber: user.gstNumber });
            if (user.image) setPreviewImage(user.image);
        }
    }, [user, resetProfile, resetShop]);

    // Handlers
    const handlePreviewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setProfileImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const onUpdateProfile = async (data: ProfileFormData) => {
        setIsSubmittingProfile(true);
        const formData = new FormData();

        formData.append("name", data.name);
        formData.append("phone", data.phone);

        if (profileImage) {
            formData.append("image", profileImage);
        }
        
        try {
            const result = await axios.post('/api/user/update-profile', formData);
            // Assuming your API returns the updated user object directly in result.data
            dispatch(setUserData(result.data)); 
            toast.success("Profile updated successfully!", { style: toastStyle });
            setActiveTab('overview');
            setProfileImage(null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile.", { style: toastErrorStyle });
        } finally {
            setIsSubmittingProfile(false);
        }
    };

    const onUpdateShop = async (data: ShopFormData) => {
        setIsSubmittingShop(true);
        try {
            const result = await axios.post('/api/vendor/verifyAgain', {
                vendorId: user?._id,
                shopName: data.shopName,
                shopAddress: data.shopAddress,
                gstNumber: data.gstNumber
            });
            
            // ✅ Update Redux directly instead of window.location.reload()
            // Make sure your backend returns the updated user object with verificationStatus: 'pending'
            if (result.data) {
                dispatch(setUserData(result.data));
            }

            toast.success("Details updated! Your application is under review.", { style: toastStyle });
            // Keep them on the shop tab so they see the new "Pending" UI state immediately
        } catch (error) {
            console.error(error);
            toast.error("Failed to update shop details.", { style: toastErrorStyle });
        } finally {
            setIsSubmittingShop(false);
        }
    };

    // Shared Styles
    const toastStyle = { background: '#1c1c1e', color: '#10b981', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' };
    const toastErrorStyle = { background: '#1c1c1e', color: '#ef4444', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' };
    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all";
    const labelClass = "text-xs font-medium text-gray-400 mb-1.5 ml-1 block";

    if (!user) {
        return (
            <div className='w-full min-h-screen flex items-center justify-center bg-[#030305] text-white'>
                <span className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></span>
            </div>
        );
    }

    const isPending = user?.verificationStatus === 'pending';

    return (
        <div className="relative min-h-screen bg-[#030305] text-white px-4 py-24 overflow-hidden flex justify-center">

            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[30%] h-[40%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-2xl bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                {/* Header Banner */}
                <div className="h-32 w-full bg-linear-to-r from-violet-600/20 to-blue-600/20 relative" />

                <div className="px-6 sm:px-10 pb-10 -mt-16">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                            <motion.div
                                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#0a0a0c] bg-white/5 shadow-xl relative z-10"
                                whileHover={{ scale: 1.05 }}
                            >
                                {previewImage ? (
                                    <Image src={previewImage} width={128} height={128} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-violet-500 to-blue-500 text-4xl font-bold">
                                        {user.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                )}

                                {/* Image Upload Overlay (Visible only in Edit Profile mode) */}
                                {activeTab === 'profile' && (
                                    <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <LuCamera size={24} className="text-white mb-1" />
                                        <span className="text-xs font-semibold">Change</span>
                                        <input type="file" hidden accept="image/*" onChange={handlePreviewImage} />
                                    </label>
                                )}
                            </motion.div>

                            {/* Role & Status Badge */}
                            <div className="absolute -bottom-2 -right-2 flex gap-1 z-20">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-[#0a0a0c] ${user.role === 'vendor' ? 'border-emerald-500/30 text-emerald-400' : 'border-blue-500/30 text-blue-400'}`}>
                                    {user.role}
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold mt-4 tracking-tight flex items-center gap-2">
                            {user?.name} 
                        </h2>
                        <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-1">
                            <LuMail size={14} /> {user?.email}
                        </p>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8 border border-white/5">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${activeTab === 'overview' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${activeTab === 'profile' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                        >
                            Edit Profile
                        </button>
                        {user.role === 'vendor' && (
                            <button
                                onClick={() => setActiveTab('shop')}
                                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all relative ${activeTab === 'shop' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                Shop Details
                                {isPending && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                )}
                            </button>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="relative min-h-62.5">
                        <AnimatePresence mode="wait">

                            {/* --- OVERVIEW TAB --- */}
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                                    className="space-y-4"
                                >
                                    <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4">
                                        <div className="p-3 bg-white/5 rounded-xl text-violet-400"><LuPhone size={20} /></div>
                                        <div>
                                            <p className="text-xs text-gray-500">Phone Number</p>
                                            <p className="font-medium text-gray-200">{user.phone || "Not provided"}</p>
                                        </div>
                                    </div>

                                    {user.role === 'vendor' && (
                                        <div className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                                                    <LuStore size={18} /> Business Info
                                                </div>
                                                {isPending ? (
                                                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border border-orange-500/30 bg-orange-500/10 text-orange-400 flex items-center gap-1">
                                                        <LuClock size={10} /> Pending Approval
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                                                        <LuShieldCheck size={10} /> Verified
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-xs text-gray-500">Shop Name</p>
                                                    <p className="font-medium text-gray-200">{user.shopName || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">GSTIN</p>
                                                    <p className="font-medium text-gray-200 uppercase">{user.gstNumber || "N/A"}</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-xs text-gray-500">Address</p>
                                                    <p className="font-medium text-gray-200">{user.shopAddress || "N/A"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {user.role === 'user' && (
                                        <motion.button
                                            onClick={() => router.push("/orders")}
                                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            className="w-full mt-4 bg-violet-600/20 border border-violet-500/30 hover:bg-violet-600/30 text-violet-300 py-3.5 rounded-xl font-semibold transition-all flex justify-center items-center gap-2"
                                        >
                                            <LuPackage size={18} /> View My Orders
                                        </motion.button>
                                    )}
                                </motion.div>
                            )}

                            {/* --- EDIT PROFILE TAB --- */}
                            {activeTab === 'profile' && (
                                <motion.form
                                    key="profile" onSubmit={handleSubmitProfile(onUpdateProfile)}
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                                    className="space-y-5"
                                >
                                    <div>
                                        <label className={labelClass}>Full Name</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><LuUser size={18} /></div>
                                            <input {...registerProfile('name')} type="text" className={`${inputClass} pl-11`} placeholder="Your full name" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Phone Number</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><LuPhone size={18} /></div>
                                            <input {...registerProfile('phone')} type="tel" className={`${inputClass} pl-11`} placeholder="e.g. +1 234 567 890" />
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit" disabled={isSubmittingProfile} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white py-3.5 rounded-xl text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(139,92,246,0.3)] flex justify-center items-center gap-2 mt-6"
                                    >
                                        {isSubmittingProfile ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : 'Save Profile Changes'}
                                    </motion.button>
                                </motion.form>
                            )}

                            {/* --- EDIT SHOP TAB --- */}
                            {activeTab === 'shop' && user.role === 'vendor' && (
                                <motion.div
                                    key="shop" 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
                                >
                                    {isPending ? (
                                        // 🔒 PENDING STATE UI 
                                        <div className="flex flex-col items-center justify-center text-center p-8 bg-orange-500/5 border border-orange-500/20 rounded-2xl h-full">
                                            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-400 mb-4 border border-orange-500/20">
                                                <LuClock size={32} />
                                            </div>
                                            <h3 className="text-xl font-bold text-white mb-2">Review in Progress</h3>
                                            <p className="text-sm text-gray-400 max-w-sm">
                                                Your shop details have been submitted and are currently being reviewed by our administrators. You will be notified once approved.
                                            </p>
                                        </div>
                                    ) : (
                                        // 📝 EDIT FORM UI
                                        <form onSubmit={handleSubmitShop(onUpdateShop)} className="space-y-5">
                                            <div>
                                                <label className={labelClass}>Shop Name</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><LuStore size={18} /></div>
                                                    <input {...registerShop('shopName')} type="text" className={`${inputClass} pl-11`} placeholder="Your Business Name" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={labelClass}>GST Number</label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500"><LuFileText size={18} /></div>
                                                    <input {...registerShop('gstNumber')} type="text" className={`${inputClass} pl-11 uppercase`} placeholder="e.g. 22AAAAA0000A1Z5" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={labelClass}>Shop Address</label>
                                                <div className="relative">
                                                    <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none text-gray-500"><LuMapPin size={18} /></div>
                                                    <textarea {...registerShop('shopAddress')} className={`${inputClass} pl-11 resize-none min-h-25`} placeholder="Full business address" />
                                                </div>
                                            </div>

                                            <motion.button
                                                type="submit" disabled={isSubmittingShop} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3.5 rounded-xl text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] flex justify-center items-center gap-2 mt-6"
                                            >
                                                {isSubmittingShop ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span> : <><LuShieldCheck size={18} /> Submit for Reverification</>}
                                            </motion.button>
                                        </form>
                                    )}
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ProfilePage;