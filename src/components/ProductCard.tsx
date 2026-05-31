'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'motion/react'
import { FaStar, FaShoppingCart } from 'react-icons/fa'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { IProduct } from '@/model/product.model'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: IProduct
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [current, setCurrent] = useState(0)
  const router = useRouter()

  const images = [
    product.image1,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean) as string[]

  const totalReviews = product?.reviews?.length ?? 0
  const avgRating = totalReviews > 0
    ? Math.round(product.reviews!.reduce((sum: number, r: any) => sum + r.rating, 0) / totalReviews)
    : 0

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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await axios.post("/api/user/cart/add", { productId: product._id, quantity: 1 })
      toast.success("Added to Cart")
      router.push("/cart")
    } catch (error) {
      console.log("Error adding item to cart:", error)
    }
  }

  return (
    <div
      onClick={() => router.push(`/viewProduct/${product._id}`)}
      className="w-full max-w-[285px] mx-auto bg-white border border-gray-200 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow duration-300 flex flex-col h-[460px] cursor-pointer justify-between"
    >
      {/* --- LIGHT GREY IMAGE WINDOW CONTROLLER --- */}
      <div className="relative w-full h-[220px] bg-[#f3f4f6] rounded-xl overflow-hidden flex items-center justify-center p-4 group/image shrink-0">
        <div className="relative w-[85%] h-[85%]">
          <Image
            src={images[current] || '/placeholder.png'}
            alt={product.title || 'Product Image'}
            fill
            className="object-contain"
            sizes="285px"
            priority={false}
          />
        </div>

        {/* Carousel Arrow Controls (Visible on Image Container Hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 w-7 h-7 flex items-center justify-center rounded-full text-white z-20 opacity-0 group-hover/image:opacity-100 transition-opacity"
            >
              <FiChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 w-7 h-7 flex items-center justify-center rounded-full text-white z-20 opacity-0 group-hover/image:opacity-100 transition-opacity"
            >
              <FiChevronRight size={16} />
            </button>
          </>
        )}

        {/* Dynamic Nav dots at the bottom of image block */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  current === i ? "bg-gray-800" : "bg-gray-400/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* --- CONTENT DETAILS LAYER --- */}
      <div className="flex flex-col flex-grow justify-between mt-3 px-0.5">
        <div className="space-y-1.5">
          {/* Main Title Head */}
          <h3 className="font-bold text-[#1f2937] text-[14px] leading-snug line-clamp-2">
            {product.title}
          </h3>

          {/* Category Context Label */}
          {product.category && (
            <p className="text-[12px] text-gray-400 font-medium capitalize">
              {product.category}
            </p>
          )}

          {/* Accurate Display Price Tag */}
          <p className="font-bold text-[18px] text-[#10b981] tracking-tight">
            ₹{product.price?.toLocaleString('en-IN')}
          </p>

          {/* Star Rating Array Segment */}
          <div className="flex items-center gap-0.5 text-xs">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={index < avgRating ? "text-[#fbbf24]" : "text-gray-200"}
                size={13}
              />
            ))}
            <span className="text-gray-400 text-[11px] ml-1 font-medium">
              ({avgRating}.0/{totalReviews})
            </span>
          </div>
        </div>

        {/* Vendor and Footer Action Buttons */}
        <div className="mt-3 space-y-2.5">
          <p className="text-[11px] text-gray-400 font-medium">
            Sold by: <span className="text-gray-600 font-semibold">{product.vendor?.shopName || 'Store Vendor'}</span>
          </p>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full bg-black hover:bg-gray-900 text-white py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <FaShoppingCart size={12} /> Add to Cart
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard