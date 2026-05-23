'use client'

import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ProductCard from '../ProductCard'
import { motion } from 'motion/react'
import { FiInbox, FiShoppingBag, FiLayers } from 'react-icons/fi'

const ProductCardPage = () => {
  // 1. Safely fetch products from Redux state management
  const products = useSelector(
    (state: RootState) => state.vendor.allProdutctsData?.product || []
  )

  // 2. Filter for store-ready validated items
  const approvedProducts = products.filter(
    (p: any) => p.isActive === true && p.verificationStatus === 'approved'
  )

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-gray-100 relative overflow-hidden">
      
      {/* Dynamic Ambient Blur Lights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.06] pb-8 mb-10">
          <div>
            <div className="flex items-center gap-2 text-violet-400 font-semibold text-xs uppercase tracking-widest mb-2.5">
              <FiShoppingBag className="animate-pulse" /> Verified Marketplace
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explore Trending Products
            </h1>
            <p className="text-sm text-gray-400 mt-2 max-w-xl leading-relaxed">
              Shop authentic premium items from certified network sellers with guaranteed quality checking protocols.
            </p>
          </div>

          {/* Metric Status Badge */}
          <div className="bg-[#0d0d11] border border-white/[0.06] px-4 py-2.5 rounded-xl shrink-0 self-start md:self-auto flex items-center gap-3 shadow-md">
            <div className="p-2 bg-violet-500/10 text-violet-400 rounded-lg">
              <FiLayers size={16} />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block font-bold uppercase tracking-wider">Live Inventory</span>
              <span className="text-sm font-bold text-gray-200">
                {approvedProducts.length} Items Listed
              </span>
            </div>
          </div>
        </div>

        {/* --- DYNAMIC DISPLAY SYSTEM --- */}
        {approvedProducts.length === 0 ? (
          
          /* High-Fidelity Empty State */
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md mx-auto text-center py-20 px-6 bg-[#0d0d11] border border-white/[0.06] rounded-2xl shadow-2xl mt-12"
          >
            <div className="w-14 h-14 bg-white/[0.02] border border-white/[0.08] text-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
              <FiInbox size={24} />
            </div>
            <h3 className="text-base font-semibold text-gray-200">No products available</h3>
            <p className="text-xs text-gray-400 mt-1.5 max-w-xs mx-auto leading-relaxed">
              Our verified merchants are updating inventory right now. Please check back shortly for fresh catalog arrivals.
            </p>
          </motion.div>
          
        ) : (
          
          /* Single Stable Responsive CSS Grid Layout Wrapper */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-6 justify-center items-stretch">
            {approvedProducts.map((p: any) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
          
        )}
      </div>
    </div>
  )
}

export default ProductCardPage