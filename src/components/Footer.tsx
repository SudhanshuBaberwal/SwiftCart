'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { LuMail, LuPhone, LuMapPin, LuArrowRight } from 'react-icons/lu'
import { FaTwitter, FaGithub, FaDiscord } from 'react-icons/fa'

// Assuming IUser interface is imported from your models
interface IUser {
    role?: "user" | "admin" | "vendor" | string;
}

const Footer = ({ user }: { user?: IUser | null }) => {
    const router = useRouter()
    
    // Safely fallback if user is null/undefined
    const role = user?.role || "user"
    const isUser = role === "user"
    const isAdminorVendor = role === "admin" || role === "vendor"

    return (
        <footer className='relative w-full bg-[#030305] border-t border-white/5 pt-16 pb-8 overflow-hidden z-40 text-gray-400 font-sans'>
            
            {/* Background Glow Effect */}
            <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[50%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className={`relative z-10 max-w-7xl mx-auto px-6 grid gap-12 md:gap-8 lg:gap-12
                ${isUser ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5" : "grid-cols-1 md:grid-cols-3 lg:grid-cols-4"}
            `}>
                
                {/* --- Brand Section --- */}
                <div className={`${isUser ? "lg:col-span-2" : "lg:col-span-1"} space-y-5`}>
                    <div onClick={() => router.push("/")} className='flex items-center gap-3 cursor-pointer group w-fit'>
                        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all duration-300">
                            S
                        </div>
                        <h2 className='text-2xl font-bold tracking-wide bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400'>
                            SwiftCart
                        </h2>
                    </div>
                    <p className='text-sm leading-relaxed text-gray-500 max-w-sm'>
                        A smart, secure, and scalable multi-vendor eCommerce platform designed for seamless shopping and explosive business growth.
                    </p>
                    
                    {isAdminorVendor && (
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border
                            ${role === "admin" 
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]" 
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                            }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${role === "admin" ? "bg-blue-400" : "bg-emerald-400"} animate-pulse`} />
                            {role === "admin" ? "Admin Privileges Active" : "Vendor Portal Active"}
                        </div>
                    )}
                </div>

                {/* --- User Quick Links 1 --- */}
                {isUser && (
                    <div>
                        <h3 className='text-white text-sm font-semibold mb-6 uppercase tracking-wider'>Explore</h3>
                        <ul className='space-y-3'>
                            {[
                                { name: "Home", path: "/" },
                                { name: "Categories", path: "/categories" },
                                { name: "Shop", path: "/shop" },
                                { name: "Special Offers", path: "/offers" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <button onClick={() => router.push(link.path)} className='text-sm hover:text-violet-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group'>
                                        <LuArrowRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" size={14} />
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* --- User Quick Links 2 --- */}
                {isUser && (
                    <div>
                        <h3 className='text-white text-sm font-semibold mb-6 uppercase tracking-wider'>Support</h3>
                        <ul className='space-y-3'>
                            {[
                                { name: "Help Center", path: "/support" },
                                { name: "Track Orders", path: "/orders" },
                                { name: "Returns & Refunds", path: "/returns" },
                                { name: "Contact Us", path: "/contact" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <button onClick={() => router.push(link.path)} className='text-sm hover:text-violet-400 hover:translate-x-1 transition-all duration-300 flex items-center gap-2 group'>
                                        <LuArrowRight className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" size={14} />
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* --- Admin / Vendor Bento Card --- */}
                {isAdminorVendor && (
                    <div className='lg:col-span-2 bg-linear-to-br from-white/4 to-transparent border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors'>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/2 rounded-full blur-2xl group-hover:bg-white/4 transition-colors" />
                        
                        <h3 className='text-white text-base font-semibold mb-4 flex items-center gap-2'>
                            {role === "admin" ? "System Access Modules" : "Vendor Capabilities"}
                        </h3>
                        <ul className='grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm'>
                            {role === "admin" ? (
                                <>
                                    <li className="flex items-center gap-2"><span className="text-blue-500">✦</span> Platform Management</li>
                                    <li className="flex items-center gap-2"><span className="text-blue-500">✦</span> Vendor Control</li>
                                    <li className="flex items-center gap-2"><span className="text-blue-500">✦</span> Orders & Revenue</li>
                                    <li className="flex items-center gap-2"><span className="text-blue-500">✦</span> System Security</li>
                                </>
                            ) : (
                                <>
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✦</span> Product Upload & Edit</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✦</span> Order Tracking</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✦</span> Sales Analytics</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✦</span> Wallet Settlement</li>
                                </>
                            )}
                        </ul>
                    </div>
                )}

                {/* --- Contact Info --- */}
                <div>
                    <h3 className='text-white text-sm font-semibold mb-6 uppercase tracking-wider'>Contact Us</h3>
                    <ul className='space-y-4'>
                        <li className='flex items-start gap-3 text-sm group'>
                            <div className="p-2 rounded-lg bg-white/3 text-gray-400 group-hover:bg-violet-500/20 group-hover:text-violet-400 transition-colors">
                                <LuMail size={16} />
                            </div>
                            <span className="mt-1">support@swiftcart.com</span>
                        </li>
                        <li className='flex items-start gap-3 text-sm group'>
                            <div className="p-2 rounded-lg bg-white/3 text-gray-400 group-hover:bg-violet-500/20 group-hover:text-violet-400 transition-colors">
                                <LuPhone size={16} />
                            </div>
                            <span className="mt-1">+91 98765 43210</span>
                        </li>
                        <li className='flex items-start gap-3 text-sm group'>
                            <div className="p-2 rounded-lg bg-white/3 text-gray-400 group-hover:bg-violet-500/20 group-hover:text-violet-400 transition-colors">
                                <LuMapPin size={16} />
                            </div>
                            <span className="mt-1">Tech Park, Bengaluru<br/>Karnataka, India</span>
                        </li>
                    </ul>
                </div>

            </div>

            {/* --- Bottom Bar --- */}
            <div className='max-w-7xl mx-auto px-6 mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4'>
                <p className='text-xs text-gray-500'>
                    &copy; {new Date().getFullYear()} SwiftCart. Powered by a Secure Commerce Engine.
                </p>
                
                {/* Social Links */}
                <div className="flex items-center gap-4">
                    <button className="text-gray-500 hover:text-white transition-colors"><FaTwitter size={18} /></button>
                    <button className="text-gray-500 hover:text-white transition-colors"><FaGithub size={18} /></button>
                    <button className="text-gray-500 hover:text-white transition-colors"><FaDiscord size={18} /></button>
                </div>
            </div>
        </footer>
    )
}

export default Footer