'use client'

import { motion } from 'motion/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FiCheck, FiShoppingBag, FiArrowRight } from 'react-icons/fi'

const OrderSuccess = () => {
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
    <div className='min-h-screen bg-[#0a0a0c] bg-gradient-to-br from-[#0c1610] via-[#040405] to-[#0a0a0c] flex items-center justify-center px-4 selection:bg-emerald-500/20'>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className='bg-[#111114]/80 backdrop-blur-md border border-white/[0.06] shadow-2xl rounded-2xl p-8 sm:p-10 max-w-md w-full text-center relative overflow-hidden'
      >
        {/* Decorative subtle background glow behind the checkmark */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Success Animated Badge Icon */}
        <motion.div
          variants={childVariants}
          className='mx-auto w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 shadow-inner'
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          >
            <FiCheck size={40} strokeWidth={2.5} />
          </motion.div>
        </motion.div>

        {/* Text Header Content */}
        <motion.h1 
          variants={childVariants}
          className='text-2xl sm:text-3xl font-extrabold text-white mt-6 tracking-tight'
        >
          Order placed successfully!
        </motion.h1>

        {/* Status Processing Description Section */}
        <motion.div 
          variants={childVariants}
          className='flex flex-col items-center gap-3 mt-4 text-gray-400 text-sm max-w-xs mx-auto leading-relaxed'
        >
          <p>Thank you for your purchase. Your order has been received and is currently being processed by our system.</p>
        </motion.div>

        {/* Direct Functional Navigation Actions Footers */}
        <motion.div variants={childVariants} className="mt-8 space-y-3">
          <motion.button
            onClick={() => router.push("/orders")}
            whileHover={{ scale: 1.01, backgroundColor: "#059669" }}
            whileTap={{ scale: 0.99 }}
            className='w-full py-3 px-4 rounded-xl bg-emerald-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 group shadow-lg shadow-emerald-900/20'
          >
            <span>Go to Order Page</span>
            <FiArrowRight className="text-emerald-200 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          <motion.button
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.04)" }}
            whileTap={{ scale: 0.99 }}
            className='w-full py-3 px-4 rounded-xl bg-transparent border border-white/[0.08] text-gray-300 hover:text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2'
          >
            <FiShoppingBag className="text-gray-400 text-xs" />
            <span>Continue Shopping</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default OrderSuccess