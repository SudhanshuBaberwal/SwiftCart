'use client'

import { IUser } from '@/model/user.model'
import { RootState } from '@/redux/store'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useSelector } from 'react-redux'
import { LuMapPin, LuArrowUpRight, LuCompass } from 'react-icons/lu'
import { CheckCircle2 } from "lucide-react"

// Framer Motion Parent Variant for Staggered Children Animation
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
} as const

const ShopPage = () => {
  const { allVendorData } = useSelector((state: RootState) => state.vendor)
  const router = useRouter()
  
  const allVerifiedVendor = Array.isArray(allVendorData) 
    ? allVendorData.filter((v: any) => v.verificationStatus === "approved") 
    : []

  if (!allVerifiedVendor || allVerifiedVendor.length === 0) {
    return (
      <div className='min-h-screen w-full flex flex-col items-center justify-center bg-[#050507] text-zinc-100 px-4'>
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-3"
        >
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <LuCompass size={20} className="animate-spin-slow" />
          </div>
          <h1 className='text-base font-medium text-zinc-200 tracking-tight'>No Stores Listed</h1>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto">Verified partner showrooms are currently undergoing synchronization updates.</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className='min-h-screen w-full bg-[#050507] text-zinc-200 px-4 sm:px-8 lg:px-16 py-16 sm:py-24 antialiased selection:bg-zinc-800 selection:text-white overflow-x-hidden relative'>
      
      {/* MINIMAL BACKGROUND LIGHT PATH */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-indigo-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/[0.01] rounded-full blur-[150px] pointer-events-none" />

      {/* MINIMALIST HEADER FRAME */}
      <div className='max-w-4xl mx-auto mb-16 sm:mb-24 space-y-4 border-b border-zinc-900 pb-10'>
        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-500 bg-zinc-900/40 px-3 py-1 rounded-full border border-zinc-800/50">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Verified Network</span>
        </div>
        <div className="space-y-2">
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className='text-3xl sm:text-5xl font-light tracking-tight text-white'
          >
            Explore <span className="font-medium text-zinc-400">Showrooms</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className='text-zinc-500 text-xs sm:text-sm max-w-md font-normal leading-relaxed'
          >
            A curated directory of exceptional merchant flagship profiles holding strict quality verifications.
          </motion.p>
        </div>
      </div>

      {/* CLEAN LIST INTERACTION BLOCK */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className='max-w-4xl mx-auto space-y-3'
      >
        {allVerifiedVendor.map((v: IUser, i: number) => (
          <motion.div
            key={ i}
            variants={itemVariants}
            onClick={() => router.push(`/shopDetails/${v._id}`)}
            className='group bg-zinc-900/10 hover:bg-zinc-900/30 border border-zinc-900 hover:border-zinc-800/80 rounded-2xl p-4 sm:p-5 cursor-pointer flex items-center justify-between transition-all duration-300 relative w-full'
          >
            {/* Flex Alignment Layout */}
            <div className="flex items-center gap-4 sm:gap-6 min-w-0 flex-1">
              
              {/* Ultra Simple Circular/Square Mini Branding Token */}
              <div className='relative w-12 h-12 sm:w-14 sm:h-14 overflow-hidden rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-2 shrink-0 transition-all duration-300 group-hover:border-zinc-700/60 shadow-md'>
                {v.image ? (
                  <Image 
                    src={v.image} 
                    alt={v.shopName || 'Store Identity'} 
                    fill 
                    className="object-contain p-2 transition-transform duration-500 group-hover:scale-105" 
                    sizes="56px"
                  />
                ) : (
                  <span className="text-zinc-700 font-mono text-xs font-bold">{v.shopName?.substring(0, 2).toUpperCase()}</span>
                )}
              </div>

              {/* Text Meta Descriptions */}
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <h2 className='font-semibold text-zinc-100 text-base sm:text-lg tracking-tight group-hover:text-white transition-colors truncate'>
                    {v.shopName}
                  </h2>
                  <span className='inline-flex items-center gap-1 text-[9px] tracking-wider uppercase font-extrabold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md'>
                    <CheckCircle2 size={9} className="stroke-[3]" /> {v.verificationStatus}
                  </span>
                </div>
                
                <div className='flex items-center gap-1.5 text-xs text-zinc-500 font-normal max-w-xl'>
                  <LuMapPin size={12} className="text-zinc-600 shrink-0" />
                  <p className='truncate'>{v.shopAddress || "Digital Flagship Platform"}</p>
                </div>
              </div>
            </div>

            {/* Minimal Right Navigation Arrow Slide Indicator */}
            <div className="flex items-center justify-center ml-4 shrink-0">
              <div className="w-8 h-8 rounded-full border border-zinc-900 group-hover:border-zinc-800 bg-transparent group-hover:bg-zinc-900/60 text-zinc-600 group-hover:text-white flex items-center justify-center transition-all duration-300">
                <LuArrowUpRight size={15} className="transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>

          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default ShopPage