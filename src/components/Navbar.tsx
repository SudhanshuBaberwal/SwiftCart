'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
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
import { LuLayoutDashboard, LuPackage, LuShieldAlert, LuUsers, LuSquare } from 'react-icons/lu'
import { IUser } from '@/model/user.model'

interface NavProps { user?: IUser | null }
interface NavItemProps { label: string; id: string; currentActive: boolean; onClick: () => void }
interface IconBtnProps { Icon: React.ElementType; onClick: () => void; badgeCount?: number; className?: string }

const Navbar = ({ user }: NavProps) => {
    const [openMenu, setOpenMenu] = useState<boolean>(false)
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
    const [scrolled, setScrolled] = useState(false)

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const dropdownRef = useRef<HTMLDivElement>(null)

    const currentTab = searchParams.get("tab") || "dashboard"

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

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
    const isAdminView = user?.role === 'admin'
    const isVendorView = user?.role === 'vendor'

    return (
        <div className='fixed top-0 left-0 w-full z-50 px-3 sm:px-6 pt-4 transition-all duration-300 pointer-events-none'>
            <motion.div
                animate={{
                    y: scrolled ? 0 : 5,
                    boxShadow: scrolled ? "0 20px 40px -15px rgba(0,0,0,0.7)" : "none"
                }}
                className={`max-w-7xl mx-auto rounded-full pointer-events-auto transition-colors duration-500
                    ${scrolled ? "bg-[#0a0a0c]/85 border border-white/10 backdrop-blur-2xl" : "bg-transparent border border-transparent"}`}
            >
                <div className='px-4 sm:px-6 py-2.5 flex justify-between items-center relative gap-4'>

                    {/* --- Brand Layout --- */}
                    <div onClick={() => router.push("/")} className='flex shrink-0 items-center gap-2.5 cursor-pointer group z-10'>
                        <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all duration-300">
                            <span className="font-bold text-base text-white">S</span>
                        </div>
                        <span className='text-base sm:text-lg font-bold tracking-wide bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400 hidden sm:inline-block'>
                            SwiftCart
                        </span>
                        {!isConsumerView && (
                            <span className={`text-[9px] border px-1.5 py-0.5 rounded-md font-bold uppercase tracking-widest hidden md:inline-block
                                ${isAdminView ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-blue-400 bg-blue-500/10 border-blue-500/20"}`}>
                                {user?.role}
                            </span>
                        )}
                    </div>

                    {/* --- Center Navigation Links (Consumer View) --- */}
                    {isConsumerView && (
                        <div className='hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 bg-white/5 border border-white/5 rounded-full p-1 backdrop-blur-md gap-0.5'>
                            <GlobalNavItem label="Home" id="home" currentActive={pathname === "/"} onClick={() => router.push("/")} />
                            <GlobalNavItem label="Categories" id="categories" currentActive={pathname === "/categories"} onClick={() => router.push("/categories")} />
                            <GlobalNavItem label="Shop" id="shop" currentActive={pathname === "/shop"} onClick={() => router.push("/shop")} />
                            <GlobalNavItem label="Orders" id="orders" currentActive={pathname === "/orders"} onClick={() => router.push("/orders")} />
                        </div>
                    )}

                    {/* --- Center Navigation Links (Vendor View) --- */}
                    {isVendorView && (
                        <div className='hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 bg-white/5 border border-white/5 rounded-full p-1 backdrop-blur-md gap-0.5'>
                            <GlobalNavItem label="Overview" id="dashboard" currentActive={currentTab === "dashboard"} onClick={() => router.push("/?tab=dashboard")} />
                            <GlobalNavItem label="Products" id="products" currentActive={currentTab === "products"} onClick={() => router.push("/?tab=products")} />
                            <GlobalNavItem label="Orders" id="orders" currentActive={currentTab === "orders"} onClick={() => router.push("/?tab=orders")} />
                        </div>
                    )}

                    {/* --- Center Navigation Links (Admin View - Responsive Safe Horizontal bar) --- */}
                    {isAdminView && (
                        <div className='hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 bg-white/5 border border-white/5 rounded-full p-1 backdrop-blur-md gap-0.5 max-w-[50%] overflow-x-auto no-scrollbar'>
                            <GlobalNavItem label="Overview" id="dashboard" currentActive={currentTab === "dashboard"} onClick={() => router.push("/?tab=dashboard")} />
                            <GlobalNavItem label="Vendor Details" id="vendordetails" currentActive={currentTab === "vendordetails"} onClick={() => router.push("/?tab=vendordetails")} />
                            <GlobalNavItem label="User Orders" id="userorders" currentActive={currentTab === "userorders"} onClick={() => router.push("/?tab=userorders")} />
                            <GlobalNavItem label="Approvals" id="approvals" currentActive={currentTab === "approvals"} onClick={() => router.push("/?tab=approvals")} />
                            <GlobalNavItem label="Product Approvals" id="productapprovals" currentActive={currentTab === "productapprovals"} onClick={() => router.push("/?tab=productapprovals")} />
                        </div>
                    )}

                    {/* --- Right Actions Area --- */}
                    <div className='flex items-center gap-1 sm:gap-1.5 z-10 shrink-0'>
                        {isConsumerView && <IconBtn className="hidden sm:flex" Icon={AiOutlineSearch} onClick={() => router.push("/categories")} />}
                        <IconBtn className="hidden md:flex" Icon={AiOutlinePhone} onClick={() => router.push("/support")} />
                        {isConsumerView && <IconBtn Icon={AiOutlineShoppingCart} badgeCount={2} onClick={() => router.push("/cart")} />}

                        <div className="hidden sm:block w-px h-6 bg-white/10 mx-1.5" />

                        {/* Profile Dropdown Trigger */}
                        <div className='relative hidden sm:block' ref={dropdownRef}>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setOpenMenu(!openMenu)}
                                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
                            >
                                {user?.image ? (
                                    <img src={user.image} alt='user' className='w-7 h-7 rounded-full object-cover border border-white/10' />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30 text-xs font-semibold">
                                        {user?.name?.charAt(0).toUpperCase() || <AiOutlineUser size={14} />}
                                    </div>
                                )}
                                {user && <span className="text-xs font-medium text-gray-300 hidden md:block max-w-24 truncate">{user.name}</span>}
                            </motion.button>

                            {/* Options Overlay Panel */}
                            <AnimatePresence>
                                {openMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 15, scale: 0.95, filter: "blur(4px)" }}
                                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95, filter: "blur(4px)" }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                        className='absolute right-0 mt-3 w-56 bg-[#0a0a0c]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-1.5 z-50'
                                    >
                                        <div className="px-3 py-2 border-b border-white/5 mb-1.5">
                                            <p className="text-xs font-semibold text-white truncate">{user?.name || "Guest Account"}</p>
                                            <p className="text-[10px] text-zinc-500 truncate mt-0.5">{user?.email || "Management Console"}</p>
                                        </div>
                                        <button onClick={() => { router.push("/profile"); setOpenMenu(false) }} className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                            <AiOutlineUser size={16} /> Profile Workspace
                                        </button>
                                        <button onClick={() => { signOut({ callbackUrl: "/login" }); setOpenMenu(false) }} className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-0.5">
                                            <AiOutlineLogout size={16} /> Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Hamburger Control Toggle Link */}
                        <motion.button 
                            whileTap={{ scale: 0.92 }}
                            onClick={() => setSidebarOpen(true)} 
                            className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                        >
                            <AiOutlineMenu size={22} />
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* --- Mobile Sidebar Drawer Slider System --- */}
            <AnimatePresence>
                {sidebarOpen && (
                    <div className="fixed inset-0 z-100 pointer-events-auto lg:hidden">
                        {/* Backdrop Blur Fade */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSidebarOpen(false)} />

                        {/* Drawer Sheet */}
                        <motion.div
                            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                            className='absolute top-0 right-0 h-screen w-[80%] sm:w-80 bg-[#08080a] border-l border-white/5 p-5 flex flex-col shadow-2xl shadow-black'
                        >
                            <div className='flex justify-between items-center mb-6'>
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-white text-sm">S</div>
                                    <h1 className='text-sm font-bold text-white uppercase tracking-wider'>Menu</h1>
                                </div>
                                <button onClick={() => setSidebarOpen(false)} className='p-1.5 bg-white/5 border border-white/5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors'>
                                    <AiOutlineClose size={16} />
                                </button>
                            </div>

                            <div className='flex flex-col gap-1 grow overflow-y-auto pr-1'>
                                {/* Contextual Rendering bases on Roles */}
                                {isConsumerView && (
                                    <>
                                        <MobileNavBtn label="Home Terminal" Icon={AiOutlineHome} isActive={pathname === "/"} onClick={() => { router.push("/"); setSidebarOpen(false) }} />
                                        <MobileNavBtn label="Categories Matrix" Icon={AiOutlineAppstore} isActive={pathname === "/categories"} onClick={() => { router.push("/categories"); setSidebarOpen(false) }} />
                                        <MobileNavBtn label="Marketplace Shops" Icon={AiOutlineShop} isActive={pathname === "/shops"} onClick={() => { router.push("/shops"); setSidebarOpen(false) }} />
                                        <MobileNavBtn label="Purchase Ledger" Icon={GoListUnordered} isActive={pathname === "/orders"} onClick={() => { router.push("/orders"); setSidebarOpen(false) }} />
                                    </>
                                )}

                                {isVendorView && (
                                    <>
                                        <MobileNavBtn label="Overview Dashboard" Icon={LuLayoutDashboard} isActive={currentTab === "dashboard"} onClick={() => { router.push("/?tab=dashboard"); setSidebarOpen(false) }} />
                                        <MobileNavBtn label="Products Hub" Icon={LuPackage} isActive={currentTab === "products"} onClick={() => { router.push("/?tab=products"); setSidebarOpen(false) }} />
                                        <MobileNavBtn label="Orders Flow Desk" Icon={GoListUnordered} isActive={currentTab === "orders"} onClick={() => { router.push("/?tab=orders"); setSidebarOpen(false) }} />
                                    </>
                                )}

                                {isAdminView && (
                                    <>
                                        <MobileNavBtn label="Overview Control" Icon={LuLayoutDashboard} isActive={currentTab === "dashboard"} onClick={() => { router.push("/?tab=dashboard"); setSidebarOpen(false) }} />
                                        <MobileNavBtn label="Vendor Details" Icon={LuUsers} isActive={currentTab === "vendordetails"} onClick={() => { router.push("/?tab=vendordetails"); setSidebarOpen(false) }} />
                                        <MobileNavBtn label="Global Orders" Icon={GoListUnordered} isActive={currentTab === "userorders"} onClick={() => { router.push("/?tab=userorders"); setSidebarOpen(false) }} />
                                        <MobileNavBtn label="Merchant Access" Icon={LuShieldAlert} isActive={currentTab === "approvals"} onClick={() => { router.push("/?tab=approvals"); setSidebarOpen(false) }} />
                                        <MobileNavBtn label="Product Audits" Icon={LuSquare} isActive={currentTab === "productapprovals"} onClick={() => { router.push("/?tab=productapprovals"); setSidebarOpen(false) }} />
                                    </>
                                )}

                                <div className="h-px w-full bg-white/5 my-3" />
                                <MobileNavBtn label="Profile Workspace" Icon={AiOutlineUser} isActive={pathname === "/profile"} onClick={() => { router.push("/profile"); setSidebarOpen(false) }} />
                            </div>

                            <div className="pt-4 mt-auto">
                                <button onClick={() => { signOut(); setSidebarOpen(false) }} className="flex items-center justify-center gap-2.5 w-full py-2.5 rounded-xl bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 transition-all border border-red-500/10">
                                    <AiOutlineLogout size={16} /> Secure Sign Out
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Navbar

// --- Sub-Components ---

const GlobalNavItem = ({ label, id, currentActive, onClick }: NavItemProps) => (
    <button
        onClick={onClick}
        className='relative px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-300 rounded-full group outline-none whitespace-nowrap'
    >
        {/* Universal layoutId shared workspace across all center rendering objects */}
        {currentActive && (
            <motion.div
                layoutId="desktop-global-pill"
                className="absolute inset-0 bg-white/10 border border-white/5 rounded-full shadow-inner"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
        )}
        <span className={`relative z-10 transition-colors duration-200 ${currentActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"}`}>
            {label}
        </span>
    </button>
)

const IconBtn = ({ Icon, onClick, badgeCount, className }: IconBtnProps) => (
    <motion.button 
        whileTap={{ scale: 0.92 }}
        onClick={onClick} 
        className={`relative p-2 text-zinc-400 hover:text-white bg-white/0 hover:bg-white/5 rounded-full transition-colors duration-300 ${className}`}
    >
        <Icon size={18} />
        {badgeCount !== undefined && (
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-violet-600 text-[8px] font-bold text-white flex items-center justify-center rounded-full border border-[#0a0a0c]">
                {badgeCount}
            </span>
        )}
    </motion.button>
)

const MobileNavBtn = ({ label, Icon, onClick, isActive }: { label: string, Icon: any, onClick: () => void, isActive: boolean }) => (
    <button className='relative flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium w-full text-left outline-none' onClick={onClick}>
        {isActive && <motion.div layoutId="mobile-nav-bg" className="absolute inset-0 bg-white/5 border border-white/5 rounded-xl" />}
        <Icon size={16} className={`relative z-10 ${isActive ? "text-violet-400" : "text-zinc-500"}`} />
        <span className={`relative z-10 text-xs font-semibold ${isActive ? "text-white" : "text-zinc-400"}`}>{label}</span>
    </button>
)