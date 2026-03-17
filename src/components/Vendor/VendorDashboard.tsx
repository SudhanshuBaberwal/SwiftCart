'use client'
import React, { useState } from 'react'
import { FaBox, FaCheckCircle, FaShoppingBag, FaStore, FaChartLine, FaBoxOpen } from 'react-icons/fa'
import { MdDashboard, MdOutlineInsights } from 'react-icons/md'
import { LuBell, LuSearch, LuMoveHorizontal } from 'react-icons/lu'
import { AnimatePresence, motion } from 'motion/react'
import type { Variants } from "motion/react"
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import { ifError } from 'assert'
import VendorProduct from './VendorProduct'
import VendorOrders from './VendorOrders'
import Dashboard from './Dashboard'

const VendorDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard")
  const [openMenu, setOpenMenu] = useState(false)
  const renderPage = () => {
    switch (activePage) {
      case "dashboard": return <Dashboard />;
      case "product": return <VendorProduct />;
      case "orders": return <VendorOrders />;
    }
  }

  const menu = [
    { id: "dashboard", label: "Overview", icon: <MdDashboard size={20} /> },
    { id: "product", label: "Product", icon: <FaBoxOpen size={20} /> },
    { id: "orders", label: "Orders", icon: <FaShoppingBag size={20} /> },
    
  ]

  return (
    <div className='w-full flex min-h-screen bg-linear-to-r from-gray-900 to-gray-900 text-white'>
      {/* Mobile Tab bar */}
      <div className='lg:hidden fixed top-15 left-0 w-full bg-black px-6 py-3 flex justify-between items-center border-b border-gray-700 z-50'>
        <h1 className='text-xl font-bold'>Vendor Panel</h1>
        {!openMenu && <button onClick={() => setOpenMenu(true)}><AiOutlineMenu size={25} /></button>}
      </div>

      {/* sidebar for large */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className='hidden lg:block w-72 bg-gray-800/40 border-r border-gray-700 mt-12 p-6 backdrop-blur-xl'
      >
        <h1 className='text-xl font-bold mb-6'>Vendor Panel</h1>
        <div className='flex flex-col gap-3'>
          {
            menu.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm
                  ${activePage === item.id ?
                    "bg-blue-600 text-white"
                    :
                    "bg-gray-800 hover:bg-gray-700"
                  }
                  `}
              >
                {item.icon}{item.label}
              </button>
            ))
          }
        </div>
      </motion.div>

      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className='lg:hidden fixed top-0 left-0 w-72 h-full bg-gray-800/90 backdrop-blur-xl p-6 z-50 border-r border-gray-700'
          >
            <div className='flex justify-between items-center mb-6'>
              <h1 className='text-xl font-bold'>Vendor Panel</h1>
              <button onClick={() => setOpenMenu(false)}>
                <AiOutlineClose size={26} />
              </button>
            </div>
            <div className='flex flex-col gap-3'>
              {
                menu.map((item) => (
                  <button
                    onClick={() => { setOpenMenu(false); setActivePage(item.id) }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm
                    ${activePage == item.id ?
                        "bg-blue-600 text-white"
                        :
                        "bg-black/20 hover:bg-gray-700"
                      }
                    `}
                  >
                    {item.icon}{item.label}
                  </button>
                ))
              }
            </div>

          </motion.div>)}
      </AnimatePresence>

      {/* Main Area */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className='flex-1 p-10 mt-16 lg:mt-0'
      >
        {renderPage()}
      </motion.div>

    </div>
  )

}

//   return (
//     // ADDED `pt-24` HERE to push the dashboard content below the fixed Navbar
//     <div className="w-full h-screen overflow-hidden bg-[#030305] text-white flex relative font-sans pt-24">

//       {/* Background glowing effects */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
//       <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none" />

//       {/* Floating Sidebar */}
//       <motion.nav
//         initial={{ x: -50, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
//         // Adjusted margins slightly to align beautifully with the shifted layout
//         className="w-20 lg:w-64 mb-4 ml-4 sm:mb-6 sm:ml-6 bg-white/2 border border-white/5 rounded-3xl backdrop-blur-2xl flex flex-col p-4 shadow-2xl z-20 transition-all duration-300"
//       >
//         {/* Logo Area */}
//         <div className="flex items-center justify-center lg:justify-start gap-3 mb-10 mt-2 px-2">
//           <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(139,92,246,0.4)]">
//             S
//           </div>
//           <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400 hidden lg:block tracking-wide">
//             SwiftAdmin
//           </h1>
//         </div>

//         {/* Menu Items */}
//         <div className="flex flex-col gap-2 flex-1 relative">
//           {menu.map((item) => {
//             const isActive = activePage === item.id;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => setActivePage(item.id)}
//                 className="relative flex items-center justify-center lg:justify-start gap-4 px-4 py-3.5 rounded-2xl transition-colors text-sm font-medium w-full group"
//               >
//                 {/* Animated Sliding Background Pill */}
//                 {isActive && (
//                   <motion.div
//                     layoutId="active-nav-pill"
//                     className="absolute inset-0 bg-white/8 border border-white/5 rounded-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
//                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                   />
//                 )}

//                 <span className={`relative z-10 transition-colors duration-300 ${isActive ? "text-violet-400" : "text-gray-500 group-hover:text-gray-300"}`}>
//                   {item.icon}
//                 </span>
//                 <span className={`relative z-10 hidden lg:block transition-colors duration-300 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}>
//                   {item.label}
//                 </span>

//                 {/* Active dot indicator for mobile/collapsed state */}
//                 {isActive && (
//                   <motion.div
//                     layoutId="active-dot"
//                     className="absolute right-2 w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.8)] lg:hidden"
//                   />
//                 )}
//               </button>
//             )
//           })}
//         </div>

//         {/* Profile Widget */}
//         <div className="mt-auto p-2">
//           <div className="w-full bg-white/2 border border-white/5 rounded-2xl p-2 flex items-center gap-3 hover:bg-white/4 transition-colors cursor-pointer">
//             <img src="https://i.pravatar.cc/100?img=33" alt="Admin" className="w-10 h-10 rounded-xl object-cover" />
//             <div className="hidden lg:block overflow-hidden">
//               <p className="text-sm font-medium text-white truncate">Admin User</p>
//               <p className="text-xs text-gray-500 truncate">admin@swiftcart.com</p>
//             </div>
//           </div>
//         </div>
//       </motion.nav>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 pb-4 sm:pb-6 pr-4 sm:pr-6 pl-4 sm:pl-6">

//         {/* Floating Header */}
//         <motion.header
//           initial={{ y: -50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6, delay: 0.1 }}
//           className="h-16 rounded-3xl bg-white/2 border border-white/5 backdrop-blur-xl flex items-center justify-between px-6 mb-6"
//         >
//           <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-xl border border-white/3 w-64 focus-within:border-violet-500/50 transition-colors">
//             <LuSearch size={18} className="text-gray-500" />
//             <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm text-white w-full placeholder:text-gray-600" />
//           </div>

//           <div className="flex items-center gap-4">
//             <button className="relative p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-full">
//               <LuBell size={20} />
//               <span className="absolute top-2 right-2 w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(217,70,239,0.8)]"></span>
//             </button>
//           </div>
//         </motion.header>

//         {/* Scrollable Dashboard View */}
//         <main className="flex-1 overflow-y-auto scrollbar-hide pb-10 pr-2">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activePage}
//               initial={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
//               animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
//               exit={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
//               transition={{ duration: 0.4, ease: "easeOut" }}
//               className="h-full"
//             >
//               {activePage === "dashboard" ? <BentoDashboard /> : <PlaceholderView title={menu.find(m => m.id === activePage)?.label} />}
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>
//     </div>
//   )
// }

// const BentoDashboard = () => {
//   // Stagger animation setup
//   const container: Variants = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: { staggerChildren: 0.1 }
//     }
//   }

//   const item: Variants = {
//     hidden: { opacity: 0, y: 20 },
//     show: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         type: "spring" as const,
//         stiffness: 300,
//         damping: 24
//       }
//     }
//   }

//   return (
//     <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">

//       {/* Hero Card - Spans 2 cols, 2 rows */}
//       <motion.div variants={item} className="md:col-span-2 md:row-span-2 relative overflow-hidden bg-linear-to-br from-[#120d1d] to-[#0a0a0c] border border-violet-500/20 p-8 rounded-4xl group flex flex-col justify-between min-h-75">
//         <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 blur-[80px] rounded-full group-hover:bg-violet-600/20 transition-colors duration-700" />

//         <div className="relative z-10">
//           <div className="flex items-center gap-2 mb-2">
//             <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
//             <p className="text-sm font-medium text-violet-300">Live Revenue Update</p>
//           </div>
//           <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">$124,563.00</h2>
//           <p className="text-gray-400 text-sm flex items-center gap-2">
//             <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full text-xs font-semibold">+14.5%</span> from last month
//           </p>
//         </div>

//         {/* Abstract Chart Graphic */}
//         <div className="relative z-10 h-32 w-full mt-8 flex items-end gap-2 overflow-hidden">
//           {[40, 70, 45, 90, 65, 100, 85].map((height, i) => (
//             <motion.div
//               key={i}
//               initial={{ height: 0 }}
//               animate={{ height: `${height}%` }}
//               transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
//               className="flex-1 bg-linear-to-t from-violet-600 to-fuchsia-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
//             />
//           ))}
//         </div>
//       </motion.div>

//       {/* Smaller Stat Cards */}
//       <motion.div variants={item} className="bg-white/2 border border-white/5 p-6 rounded-4xl hover:bg-white/4 transition-colors flex flex-col justify-center">
//         <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
//           <FaStore size={20} />
//         </div>
//         <p className="text-sm text-gray-500 font-medium mb-1">Active Vendors</p>
//         <h3 className="text-3xl font-bold text-white">2,405</h3>
//       </motion.div>

//       <motion.div variants={item} className="bg-white/2 border border-white/5 p-6 rounded-4xl hover:bg-white/4 transition-colors flex flex-col justify-center">
//         <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-4">
//           <FaShoppingBag size={20} />
//         </div>
//         <p className="text-sm text-gray-500 font-medium mb-1">Pending Orders</p>
//         <h3 className="text-3xl font-bold text-white">842</h3>
//       </motion.div>

//       {/* Wide Activity Card */}
//       <motion.div variants={item} className="md:col-span-2 lg:col-span-2 bg-white/2 border border-white/5 p-6 rounded-4xl">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-lg font-semibold text-white">Recent Approvals</h3>
//           <button className="text-gray-500 hover:text-white transition-colors"><LuMoveHorizontal size={20} /></button>
//         </div>
//         <div className="flex flex-col gap-4">
//           {[
//             { name: "TechNova Electronics", type: "Vendor Request", status: "Approved", time: "2m ago" },
//             { name: "Nike Air Max Pro", type: "Product Listing", status: "Pending", time: "1hr ago" },
//             { name: "GreenLife Groceries", type: "Vendor Request", status: "Approved", time: "3hr ago" },
//           ].map((act, i) => (
//             <div key={i} className="flex items-center justify-between group cursor-pointer">
//               <div className="flex items-center gap-4">
//                 <div className="w-10 h-10 rounded-xl bg-white/3 flex items-center justify-center group-hover:bg-white/8 transition-colors">
//                   <MdOutlineInsights size={18} className="text-gray-400" />
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{act.name}</p>
//                   <p className="text-xs text-gray-500">{act.type}</p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <p className={`text-xs font-semibold ${act.status === 'Approved' ? 'text-emerald-400' : 'text-orange-400'}`}>{act.status}</p>
//                 <p className="text-xs text-gray-600">{act.time}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </motion.div>

//     </motion.div>
//   )
// }

// const PlaceholderView = ({ title }: { title: string | undefined }) => (
//   <div className="flex flex-col h-full min-h-100">
//     <h3 className="text-3xl font-bold text-white mb-6">{title}</h3>
//     <div className="flex-1 border border-dashed border-white/10 rounded-4xl flex flex-col items-center justify-center text-gray-500 hover:border-violet-500/30 transition-colors">
//       <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
//         <FaBox size={40} className="mb-4 text-white/5" />
//       </motion.div>
//       <p>Module configuration for <span className="text-white font-medium">{title}</span> goes here.</p>
//     </div>
//   </div>
// )

export default VendorDashboard