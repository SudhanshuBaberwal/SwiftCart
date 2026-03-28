'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { signOut } from 'next-auth/react'
import {
    AiOutlineSearch,
    AiOutlineUser,
    AiOutlineShoppingCart,
    AiOutlineMenu,
    AiOutlineClose,
    AiOutlineHome,
    AiOutlineAppstore,
    AiOutlinePhone,
    AiOutlineShop,
    AiOutlineLogin,
    AiOutlineLogout,
} from 'react-icons/ai'
import { GoListUnordered } from 'react-icons/go'

interface IUser { role: string; image?: string; name?: string; email?: string }
import logo from "@/assets/logo.png"

// --- Helper Types ---
interface NavProps { user?: IUser | null }
interface NavItemProps { label: string; path: string; router: any; isActive: boolean }
interface IconBtnProps { Icon: React.ElementType; onClick: () => void; badgeCount?: number; highlight?: boolean; className?: string }

const Navbar = ({ user }: NavProps) => {
    const [openMenu, setOpenMenu] = useState<boolean>(false)
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
    const [scrolled, setScrolled] = useState(false)
    
    const router = useRouter()
    const pathname = usePathname()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Handle scroll effect for the floating navbar
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const isConsumerView = !user || user.role === 'user'

    return (
        // Wrapper creates the floating effect
        <div className='fixed top-0 left-0 w-full z-50 px-3 sm:px-6 pt-4 transition-all duration-300 pointer-events-none'>
            
            <motion.div 
                animate={{
                    y: scrolled ? 0 : 5,
                    boxShadow: scrolled ? "0 20px 40px -15px rgba(0,0,0,0.5)" : "none"
                }}
                className={`max-w-7xl mx-auto rounded-full pointer-events-auto transition-colors duration-500
                    ${scrolled ? "bg-[#0a0a0c]/80 border border-white/5 backdrop-blur-2xl" : "bg-transparent border border-transparent"}`}
            >
                <div className='px-4 sm:px-6 py-3 flex justify-between items-center relative'>
                    
                    {/* --- Logo --- */}
                    <div onClick={() => router.push("/")} className='flex shrink-0 items-center gap-3 cursor-pointer group z-10'>
                        <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all duration-300">
                            <span className="font-bold text-base sm:text-lg text-white">S</span>
                        </div>
                        <span className='text-lg sm:text-xl font-bold tracking-wide hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400'>
                            SwiftCart
                        </span>
                    </div>

                    {/* --- Desktop Center Links (Hidden on mobile/tablet to prevent overlap) --- */}
                    {isConsumerView && (
                        <div className='hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 bg-white/[0.02] border border-white/[0.03] rounded-full p-1.5 backdrop-blur-md'>
                            <NavItem label="Home" path="/" router={router} isActive={pathname === "/"} />
                            <NavItem label="Categories" path="/categories" router={router} isActive={pathname === "/categories"} />
                            <NavItem label="Shop" path="/shop" router={router} isActive={pathname === "/shop"} />
                            <NavItem label="Orders" path="/orders" router={router} isActive={pathname === "/orders"} />
                        </div>
                    )}

                    {/* --- Right Actions Area --- */}
                    <div className='flex items-center gap-1 sm:gap-2 z-10'>
                        {/* Hide Search and Phone on very small mobile screens to save space */}
                        {isConsumerView && <IconBtn className="hidden sm:flex" Icon={AiOutlineSearch} onClick={() => router.push("/categories")} />}
                        <IconBtn className="hidden md:flex" Icon={AiOutlinePhone} onClick={() => router.push("/support")} />
                        
                        {/* Cart always visible if consumer */}
                        {isConsumerView && <IconBtn Icon={AiOutlineShoppingCart} badgeCount={2} onClick={() => router.push("/cart")} highlight />}

                        {/* Divider - hidden on mobile */}
                        <div className="hidden sm:block w-px h-6 bg-white/10 mx-1 sm:mx-2" /> 

                        {/* Profile Dropdown - Hidden on very small mobile, accessible via hamburger menu */}
                        <div className='relative hidden sm:block' ref={dropdownRef}>
                            <button 
                                onClick={() => setOpenMenu(!openMenu)}
                                className="flex items-center gap-2 sm:gap-3 pl-2 pr-2 sm:pr-4 py-1.5 rounded-full hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/[0.05]"
                            >
                                {user?.image ? (
                                    <img src={user.image} alt='user' className='w-8 h-8 rounded-full object-cover border border-white/10' />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                                        <AiOutlineUser size={16} />
                                    </div>
                                )}
                                {user && <span className="text-sm font-medium text-gray-300 hidden md:block max-w-[100px] truncate">{user.name || "User"}</span>}
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                                {openMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" }}
                                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className='absolute right-0 mt-4 w-56 sm:w-60 bg-[#0a0a0c]/95 backdrop-blur-xl border border-white/[0.05] rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden p-2 z-50'
                                    >
                                        <div className="px-4 py-3 border-b border-white/[0.05] mb-2">
                                            <p className="text-sm font-semibold text-white truncate">{user?.name || "Guest Account"}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email || "Sign in to manage orders"}</p>
                                        </div>

                                        <button onClick={() => { router.push("/profile"); setOpenMenu(false) }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors">
                                            <AiOutlineUser size={18} className="text-gray-500" /> Profile
                                        </button>

                                        {user ? (
                                            <button onClick={() => { signOut({ callbackUrl: "/login" }); setOpenMenu(false) }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors mt-1">
                                            <AiOutlineLogout size={18} className="text-red-500/70" /> Sign Out
                                            </button>
                                        ) : (
                                            <button onClick={() => { router.push("/login"); setOpenMenu(false) }} className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-violet-400 hover:bg-violet-500/10 rounded-xl transition-colors mt-1">
                                                <AiOutlineLogin size={18} className="text-violet-500/70" /> Sign In
                                            </button>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Hamburger Menu - Visible on tablet/mobile when center links hide */}
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 sm:p-2 ml-1 text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-full transition-colors">
                            <AiOutlineMenu size={24} />
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* --- Mobile Sidebar Overlay & Drawer --- */}
            <AnimatePresence>
                {sidebarOpen && (
                    <div className="fixed inset-0 z-[100] pointer-events-auto">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSidebarOpen(false)} />

                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                            className='absolute top-0 right-0 h-screen w-[85%] sm:w-80 bg-[#08080a] border-l border-white/5 p-6 flex flex-col shadow-2xl'
                        >
                            <div className='flex justify-between items-center mb-8'>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-sm">S</div>
                                    <h1 className='text-lg font-bold'>Menu</h1>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className='p-2 bg-white/[0.02] border border-white/[0.05] rounded-full hover:bg-white/[0.05] transition-colors'>
                                    <AiOutlineClose size={18} />
                                </button>
                            </div>

                            <div className='flex flex-col gap-2 grow overflow-y-auto custom-scrollbar pr-2'>
                                {isConsumerView && (
                                    <>
                                        <MobileNavBtn label="Home" Icon={AiOutlineHome} isActive={pathname === "/"} onClick={() => { router.push("/"); setSidebarOpen(false) }} />
                                        <MobileNavBtn label="Categories" Icon={AiOutlineAppstore} isActive={pathname === "/categories"} onClick={() => { router.push("/categories"); setSidebarOpen(false) }} />
                                        <MobileNavBtn label="Shops" Icon={AiOutlineShop} isActive={pathname === "/shops"} onClick={() => { router.push("/shops"); setSidebarOpen(false) }} />
                                        <MobileNavBtn label="Orders" Icon={GoListUnordered} isActive={pathname === "/orders"} onClick={() => { router.push("/orders"); setSidebarOpen(false) }} />
                                    </>
                                )}
                                
                                <div className="h-px w-full bg-white/[0.05] my-4" /> 
                                
                                <MobileNavBtn label="Profile" Icon={AiOutlineUser} isActive={pathname === "/profile"} onClick={() => { router.push("/profile"); setSidebarOpen(false) }} />

                                <div className="mt-auto pt-6 pb-4">
                                    {user ? (
                                        <button onClick={() => { signOut(); setSidebarOpen(false) }} className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-red-500/10 text-red-400 font-medium hover:bg-red-500/20 transition-colors border border-red-500/20">
                                            <AiOutlineLogout size={20} /> Sign Out
                                        </button>
                                    ) : (
                                        <button onClick={() => { router.push("/login"); setSidebarOpen(false) }} className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                            <AiOutlineLogin size={20} /> Sign In
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

// --- Subcomponents ---

const NavItem = ({ label, path, router, isActive }: NavItemProps) => (
    <button
        onClick={() => router.push(path)}
        className='relative px-5 py-2 text-sm font-medium transition-colors duration-300 rounded-full group'
    >
        {isActive && (
            <motion.div
                layoutId="desktop-nav-pill"
                className="absolute inset-0 bg-white/[0.06] border border-white/[0.05] rounded-full"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
        )}
        <span className={`relative z-10 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
            {label}
        </span>
    </button>
)

const IconBtn = ({ Icon, onClick, badgeCount, highlight, className = '' }: IconBtnProps) => (
    <button
        onClick={onClick}
        className={`relative p-2 sm:p-2.5 rounded-full transition-all duration-300 ${highlight ? 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20' : 'text-gray-400 hover:text-white hover:bg-white/[0.05]'} ${className}`}
    >
        <Icon size={20} />
        {badgeCount !== undefined && badgeCount > 0 && (
            <span className='absolute top-0 right-0 bg-fuchsia-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-[0_0_10px_rgba(217,70,239,0.8)] border border-black/20'>
                {badgeCount}
            </span>
        )}
    </button>
)

const MobileNavBtn = ({ label, Icon, onClick, isActive }: { label: string, Icon: any, onClick: () => void, isActive: boolean }) => (
    <button
        className={`relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-medium overflow-hidden group w-full text-left`}
        onClick={onClick}
    >
        {isActive && (
            <motion.div layoutId="mobile-nav-bg" className="absolute inset-0 bg-white/[0.05] border border-white/[0.05] rounded-2xl" />
        )}
        <Icon size={22} className={`relative z-10 transition-colors ${isActive ? "text-violet-400" : "text-gray-500 group-hover:text-gray-300"}`} />
        <span className={`relative z-10 transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>{label}</span>
    </button>
)

export default Navbar