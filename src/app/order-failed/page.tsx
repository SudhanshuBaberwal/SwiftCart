'use client'

import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FiX, FiRefreshCw, FiShoppingBag, FiAlertCircle } from 'react-icons/fi'

const OrderFailed = () => {
  const router = useRouter()

  // Container animation configuration for staggered child entries
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.12,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className='min-h-screen bg-[#0a0a0c] bg-gradient-to-br from-[#1a0c0c] via-[#040405] to-[#0a0a0c] flex items-center justify-center px-4 selection:bg-red-500/20'>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='bg-[#111114]/80 backdrop-blur-md border border-white/[0.06] shadow-2xl rounded-2xl p-8 sm:p-10 max-w-md w-full text-center relative overflow-hidden'
      >
        {/* Decorative subtle background glow behind the error icon */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Failed Animated Badge Icon */}
        <motion.div
          variants={childVariants}
          className='mx-auto w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-400 shadow-inner'
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          >
            <FiX size={40} strokeWidth={2.5} />
          </motion.div>
        </motion.div>

        {/* Text Header Content */}
        <motion.h1 
          variants={childVariants}
          className='text-2xl sm:text-3xl font-extrabold text-white mt-6 tracking-tight'
        >
          Payment failed
        </motion.h1>

        {/* Status Error Description Section */}
        <motion.div 
          variants={childVariants}
          className='flex flex-col items-center gap-3 mt-4 text-gray-400 text-sm max-w-xs mx-auto leading-relaxed'
        >
          <p>We couldn't process your transaction. This might be due to a temporary gateway timeout or insufficient funds.</p>
        </motion.div>

        {/* Quick Helper Banner */}
        <motion.div 
          variants={childVariants}
          className="mt-5 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex items-start gap-2.5 text-left text-[12px] text-gray-400"
        >
          <FiAlertCircle className="text-red-400 mt-0.5 shrink-0" size={16} />
          <p>Don't worry, if any money was deducted from your account, it will be automatically refunded within 2-3 business days.</p>
        </motion.div>

        {/* Direct Functional Navigation Actions Footers */}
        <motion.div variants={childVariants} className="mt-6 space-y-3">
          <motion.button
            onClick={() => router.push("/cart")} // Directing back to cart so they can re-checkout
            whileHover={{ scale: 1.01, backgroundColor: "#dc2626" }}
            whileTap={{ scale: 0.99 }}
            className='w-full py-3 px-4 rounded-xl bg-red-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 group shadow-lg shadow-red-900/20'
          >
            <FiRefreshCw className="text-red-200 group-hover:rotate-45 transition-transform" />
            <span>Retry Payment</span>
          </motion.button>

          <motion.button
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.04)" }}
            whileTap={{ scale: 0.99 }}
            className='w-full py-3 px-4 rounded-xl bg-transparent border border-white/[0.08] text-gray-300 hover:text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2'
          >
            <FiShoppingBag className="text-gray-400 text-xs" />
            <span>Return to Shop</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default OrderFailed