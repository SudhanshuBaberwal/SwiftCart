'use client'
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
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
import { IUser } from '@/model/user.model'
import logo from "@/assets/logo.png"

// --- Helper Types ---
interface NavProps { user?: IUser | null }
interface NavItemProps { label: string; path: string; router: any }
interface IconBtnProps { Icon: React.ElementType; onClick: () => void; badgeCount?: number }
interface DropDownBtnProps { Icon: React.ElementType; label: string; onClick: () => void; danger?: boolean }
interface SidebarBtnProps { label: string; path?: string; Icon: React.ElementType; onClick: () => void; danger?: boolean }

const Navbar = ({ user }: NavProps) => {
    const [openMenu, setOpenMenu] = useState<boolean>(false) // Fixed: Start closed
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
    const router = useRouter()
    const dropdownRef = useRef<HTMLDivElement>(null)

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

    // Determine if the view is for a standard consumer (or guest) vs vendor/admin
    const isConsumerView = !user || user.role === 'user'

    return (
        <div className='fixed top-0 left-0 w-full bg-[#050505]/90 backdrop-blur-xl text-white z-50 border-b border-white/5 shadow-2xl'>
            <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>

                {/* --- Logo --- */}
                <div onClick={() => router.push("/")} className='flex items-center gap-3 cursor-pointer group'>
                    <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-white/10 group-hover:border-white/30 transition-colors">
                        <Image src={logo} alt='SwiftCart Logo' fill className='object-cover' sizes="40px" />
                    </div>
                    <span className='text-xl font-bold tracking-wide hidden sm:inline bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400'>
                        SwiftCart
                    </span>
                </div>

                {/* --- Desktop Center Links --- */}
                {isConsumerView && (
                    <div className='hidden md:flex items-center gap-8 text-[15px] font-medium'>
                        <NavItem label="Home" path="/" router={router} />
                        <NavItem label="Categories" path="/categories" router={router} />
                        <NavItem label="Shop" path="/shop" router={router} />
                        <NavItem label="Orders" path="/orders" router={router} />
                    </div>
                )}

                {/* --- Desktop Right Icons --- */}
                <div className='hidden md:flex items-center gap-5'>
                    {isConsumerView && <IconBtn Icon={AiOutlineSearch} onClick={() => router.push("/categories")} />}
                    <IconBtn Icon={AiOutlinePhone} onClick={() => router.push("/support")} />

                    {/* Profile Dropdown Container */}
                    <div className='relative' ref={dropdownRef}>
                        {user?.image ? (
                            <div
                                onClick={() => setOpenMenu(!openMenu)}
                                className='w-10 h-10 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all cursor-pointer'
                            >
                                <Image width={40} height={40} src={user.image} alt='user' className='object-cover w-full h-full' />
                            </div>
                        ) : (
                            <IconBtn Icon={AiOutlineUser} onClick={() => setOpenMenu(!openMenu)} />
                        )}

                        <AnimatePresence>
                            {openMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className='absolute right-0 mt-4 w-52 bg-[#121214] border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden py-2 z-50'
                                >
                                    <DropDownBtn Icon={AiOutlineUser} label="Profile" onClick={() => { router.push("/profile"); setOpenMenu(false) }} />
                                    {user ? (
                                        <DropDownBtn danger Icon={AiOutlineLogout} label="Sign Out" onClick={() => { signOut({ callbackUrl: "/login" }); setOpenMenu(false) }} />
                                    ) : (
                                        <DropDownBtn Icon={AiOutlineLogin} label="Sign In" onClick={() => { router.push("/login"); setOpenMenu(false) }} />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {isConsumerView && <IconBtn Icon={AiOutlineShoppingCart} badgeCount={2} onClick={() => router.push("/cart")} />}
                </div>

                {/* --- Mobile Header Icons --- */}
                <div className='md:hidden flex items-center gap-4'>
                    {isConsumerView ? (
                        <>
                            <IconBtn Icon={AiOutlineSearch} onClick={() => router.push("/categories")} />
                            <IconBtn Icon={AiOutlineShoppingCart} badgeCount={5} onClick={() => router.push("/cart")} />
                        </>
                    ) : (
                        <IconBtn Icon={AiOutlinePhone} onClick={() => router.push("/support")} />
                    )}
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -mr-2 text-gray-300 hover:text-white transition-colors">
                        <AiOutlineMenu size={26} />
                    </button>
                </div>
            </div>

            {/* --- Mobile Sidebar Overlay & Drawer --- */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        {/* Dim Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-90"
                            onClick={() => setSidebarOpen(false)}
                        />

                        {/* Sidebar */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 250, damping: 30 }}
                            className='fixed top-0 right-0 h-screen w-[75%] sm:w-75 bg-[#0c0c0e] border-l border-white/10 p-6 text-white z-100 shadow-2xl flex flex-col'
                        >
                            <div className='flex justify-between items-center mb-8 border-b border-white/10 pb-4'>
                                <h1 className='text-xl font-bold tracking-wide'>Menu</h1>
                                <button onClick={() => setSidebarOpen(false)} className='p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors'>
                                    <AiOutlineClose size={20} />
                                </button>
                            </div>

                            <div className='flex flex-col gap-2 grow overflow-y-auto'>
                                {isConsumerView && (
                                    <>
                                        <SidebarBtn label="Home" Icon={AiOutlineHome} onClick={() => { router.push("/"); setSidebarOpen(false) }} />
                                        <SidebarBtn label="Categories" Icon={AiOutlineAppstore} onClick={() => { router.push("/categories"); setSidebarOpen(false) }} />
                                        <SidebarBtn label="Shops" Icon={AiOutlineShop} onClick={() => { router.push("/shops"); setSidebarOpen(false) }} />
                                        <SidebarBtn label="Orders" Icon={GoListUnordered} onClick={() => { router.push("/orders"); setSidebarOpen(false) }} />
                                    </>
                                )}
                                <div className="h-px w-full bg-white/10 my-2" /> {/* Divider */}
                                <SidebarBtn label="Profile" Icon={AiOutlineUser} onClick={() => { router.push("/profile"); setSidebarOpen(false) }} />

                                {user ? (
                                    <SidebarBtn danger label="Sign Out" Icon={AiOutlineLogout} onClick={() => { signOut(); setSidebarOpen(false) }} />
                                ) : (
                                    <SidebarBtn label="Sign In" Icon={AiOutlineLogin} onClick={() => { router.push("/login"); setSidebarOpen(false) }} />
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Navbar

/* --- Subcomponents --- */

const NavItem = ({ label, path, router }: NavItemProps) => (
    <button
        onClick={() => router.push(path)}
        className='relative text-gray-400 hover:text-white transition-colors duration-200 group'
    >
        {label}
        {/* Subtle underline hover effect */}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full rounded-full" />
    </button>
)

const IconBtn = ({ Icon, onClick, badgeCount }: IconBtnProps) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className='relative p-2 text-gray-300 hover:text-white transition-colors bg-white/0 hover:bg-white/5 rounded-full'
    >
        <Icon size={24} />
        {badgeCount !== undefined && badgeCount > 0 && (
            <span className='absolute top-0 right-0 bg-blue-600 border-2 border-[#050505] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center translate-x-1/4 -translate-y-1/4'>
                {badgeCount}
            </span>
        )}
    </motion.button>
)

const DropDownBtn = ({ Icon, label, onClick, danger }: DropDownBtnProps) => (
    <button
        className={`flex items-center gap-3 w-full px-4 py-2.5 text-[14px] font-medium transition-colors cursor-pointer ${danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
        onClick={onClick}
    >
        <Icon size={18} />
        {label}
    </button>
)

const SidebarBtn = ({ label, Icon, onClick, danger }: SidebarBtnProps) => (
    <button
        className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium ${danger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
        onClick={onClick}
    >
        <Icon size={22} />
        {label}
    </button>
)