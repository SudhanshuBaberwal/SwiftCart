'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { FaStar, FaShoppingCart, FaStore } from 'react-icons/fa'
import { FiChevronLeft, FiChevronRight, FiHeart } from 'react-icons/fi'
import { IProduct } from '@/model/product.model'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: IProduct
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [current, setCurrent] = useState(0)
  const router = useRouter()

  // Extract valid image URLs into an array
  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean) as string[]

  // Dynamic review and rating mathematical calculations
  const totalReviews = product?.reviews?.length ?? 0
  const avgRating = totalReviews > 0 
    ? (product.reviews!.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0'

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setCurrent((prev) => (prev + 1) % images.length)
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setCurrent((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <motion.div
      onClick={() => router.push(`/viewProduct/${product._id}`)}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 18 }}
      viewport={{ once: true, amount: 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative w-full max-w-[310px] mx-auto bg-[#0d0d11] border border-white/[0.06] hover:border-violet-500/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_12px_35px_rgba(139,92,246,0.12)] transition-all duration-500 flex flex-col h-[450px] cursor-pointer"
    >
      {/* --- IMAGE CONTAINER (Fixed 240px Height) --- */}
      <div className="relative w-full h-[240px] bg-[#16161c] border-b border-white/[0.04] overflow-hidden flex items-center justify-center p-6 shrink-0">
        
        {/* Subtle radial ambient backdrop glow on card hover */}
        <div className="absolute inset-0 bg-radial from-violet-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Animated Product Image Wrapper */}
        <motion.div 
          animate={{ scale: isHovered ? 1.04 : 1, y: isHovered ? -4 : 0 }}
          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          className="relative w-full h-full z-10"
        >
          <Image
            src={images[current] || '/placeholder.png'}
            alt={product.title || 'Product Image'}
            fill
            className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
            sizes="310px"
            priority={false}
          />
        </motion.div>

        {/* Floating Category Tag */}
        {product.category && (
          <div className="absolute top-3.5 left-3.5 z-20 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-violet-300 uppercase tracking-widest border border-white/10 shadow-md">
            {product.category}
          </div>
        )}

        {/* Wishlist Icon Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
          className="absolute top-3.5 right-3.5 z-20 bg-[#0d0d11]/60 backdrop-blur-md p-2 rounded-full text-gray-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 transition-all duration-300 shadow-md"
        >
          <FiHeart size={15} />
        </button>

        {/* --- CAROUSEL CONTROLS (Rendered if multiple images exist) --- */}
        {images.length > 1 && (
          <AnimatePresence>
            {isHovered && (
              <>
                {/* Left Arrow Button */}
                <motion.button
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  onClick={handlePrevImage}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-violet-600 backdrop-blur-md p-1.5 rounded-lg text-white border border-white/10 z-20 transition-colors shadow-lg"
                >
                  <FiChevronLeft size={16} />
                </motion.button>
                
                {/* Right Arrow Button */}
                <motion.button
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  onClick={handleNextImage}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-violet-600 backdrop-blur-md p-1.5 rounded-lg text-white border border-white/10 z-20 transition-colors shadow-lg"
                >
                  <FiChevronRight size={16} />
                </motion.button>

                {/* Carousel Navigation Indicator Dots */}
                <motion.div 
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20 bg-black/60 px-2 py-1 rounded-full backdrop-blur-md border border-white/10"
                >
                  {images.map((_, i) => (
                    <span 
                      key={i} 
                      className={`h-1 rounded-full transition-all duration-300 ${
                        current === i ? "w-3.5 bg-violet-400" : "w-1 bg-white/30"
                      }`}
                    />
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* --- CONTENT BLOCK --- */}
      <div className="p-4 flex flex-col flex-grow justify-between bg-[#0d0d11]">
        <div>
          {/* Title Line & Dynamic Rating Badge */}
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className="font-semibold text-gray-200 leading-snug line-clamp-2 text-sm flex-grow group-hover:text-violet-400 transition-colors duration-300">
              {product.title}
            </h3>
            
            <div className="flex items-center gap-1 bg-amber-500/10 px-1.5 py-0.5 rounded text-[10px] border border-amber-500/20 shrink-0 text-amber-400 font-bold">
              <FaStar size={9} />
              <span>{avgRating} <span className="text-gray-500 font-normal">({totalReviews})</span></span>
            </div>
          </div>

          {/* Shop/Vendor metadata context */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-3">
            <FaStore size={10} className="opacity-60" />
            <span className="truncate">
              by <span className="text-gray-400 font-medium">{product.vendor?.shopName || 'Store Vendor'}</span>
            </span>
          </div>
        </div>

        <div>
          {/* Price Detail */}
          <div className="mb-3.5">
            <span className="text-[10px] text-gray-500 block font-semibold uppercase tracking-wider mb-0.5">Price</span>
            <p className="font-extrabold text-xl text-emerald-400 tracking-tight">
              ₹{product.price?.toLocaleString('en-IN')}
            </p>
          </div>

          {/* Primary Action Button */}
          <motion.button 
            whileTap={{ scale: 0.97 }}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_12px_rgba(124,58,237,0.15)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.35)]"
          >
            <FaShoppingCart size={13} /> Add To Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard