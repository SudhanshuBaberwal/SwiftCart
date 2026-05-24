'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'motion/react'
import {
  FaStar,
  FaRegStar,
  FaUserCircle,
  FaCheckCircle,
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaShoppingCart,
  FaStore
} from 'react-icons/fa' // Fixed clashing import locations
import { FiInbox, FiCamera, FiLayers, FiList } from 'react-icons/fi'
import axios from 'axios'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'

import UseGetAllProductsData from '@/hooks/UseGetAllProductsData'
import { IProduct } from '@/model/product.model'
import { RootState } from '@/redux/store'
import ProductCard from '@/components/ProductCard'

const ViewProduct = () => {
  const params = useParams()
  const productId = params.id as string

  // Initialize product dataset hooks
  UseGetAllProductsData()

  const products = useSelector(
    (state: RootState) => state.vendor.allProdutctsData?.product || []
  )

  // Form states for reviews
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewCommnet, setReviewComment] = useState('')
  const [reviewImage, setReviewImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Find targeted item matching page params route parameter
  const product: IProduct | undefined = products.find(
    (p: IProduct) => String(p._id) === String(productId)
  )

  // Compute clean image collection matrix
  const images: string[] = [
    product?.image1,
    product?.image2,
    product?.image3,
    product?.image4
  ].filter((img): img is string => Boolean(img))

  const handleSubmitReviews = async () => {
    if (reviewRating === 0) {
      toast.error('Please select a star rating before submitting.')
      return
    }

    const formData = new FormData()
    formData.append('productId', String(productId))
    formData.append('rating', String(reviewRating))
    formData.append('comment', reviewCommnet)
    if (reviewImage) {
      formData.append('image', reviewImage)
    }

    setLoading(true)
    try {
      await axios.post('/api/vendor/addReview', formData)
      toast.success('Review Added Successfully')
      setPreview(null)
      setReviewRating(0)
      setReviewComment('')
      setReviewImage(null)
    } catch (error) {
      toast.error('Failed to submit review. Try again later.')
      console.error('Error in viewProduct Page:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter linked catalog categories logic
  const relatedProducts = products.filter(
    (p: IProduct) => p.category === product?.category && String(p._id) !== String(product?._id)
  )

  const totalReviews = product?.reviews?.length ?? 0
  const avgRating = product && totalReviews > 0 ? (
    product.reviews!.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / totalReviews
  ).toFixed(1) : '0.0'


  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const result = await axios.post("/api/user/cart/add", { productId: productId, quantity: 1 })
      toast.success("Added to Cart")
      router.push("/cart")
    } catch (error) {
      console.log("Error in ProductCart Cart add function")
    }
  }


  return (
    <div className="min-h-screen w-full bg-[#09090b] text-gray-100 relative overflow-hidden px-4 sm:px-6 lg:px-8 py-10">

      {/* Background Ambient Depth Glow Elements */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-violet-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">

        {/* --- MAIN INTERACTIVE SPEC BLOCK --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-[#0d0d11]/40 border border-white/[0.04] rounded-3xl p-4 sm:p-8 backdrop-blur-md">

          {/* LEFT CONTAINER: Showcase Media Canvas System */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="relative w-full aspect-square sm:h-[460px] bg-[#14141a] border border-white/[0.06] rounded-2xl overflow-hidden flex items-center justify-center p-8 group shadow-xl">
              <div className="absolute inset-0 bg-radial from-violet-500/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              {images.length > 0 && images[activeImage] ? (
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={images[activeImage]}
                    alt={product?.title ?? 'Product Display'}
                    fill
                    className="object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                    priority
                  />
                </motion.div>
              ) : (
                <div className="text-gray-600 flex flex-col items-center gap-2">
                  <FiInbox size={40} />
                  <span className="text-xs">No preview image loaded</span>
                </div>
              )}
            </div>

            {/* Thumbnail Selection Strip */}
            <div className="flex flex-wrap gap-3 items-center justify-start mt-1">
              {images.map((img, i) => (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveImage(i)}
                  key={i}
                  className={`relative w-20 h-20 bg-[#14141a] border rounded-xl cursor-pointer overflow-hidden p-2 flex items-center justify-center transition-all ${activeImage === i
                    ? 'border-violet-500 ring-2 ring-violet-500/20'
                    : 'border-white/[0.08] hover:border-white/30'
                    }`}
                >
                  <Image src={img} alt="Thumb Asset" fill className="object-contain p-1.5" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT CONTAINER: Premium Context Pricing and Actions Checkout Panels */}
          {product && (
            <div className="lg:col-span-5 flex flex-col justify-between py-2 space-y-6">
              <div>
                <span className="inline-block bg-violet-500/10 border border-violet-500/20 text-violet-400 font-bold tracking-wider uppercase text-[10px] px-2.5 py-1 rounded-md mb-3">
                  {product?.category || 'General Listing'}
                </span>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-3">
                  {product?.title}
                </h1>

                {/* Rating Metrics Row Layout */}
                <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4 mb-4">
                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20 text-amber-400 font-bold text-xs rounded-md shadow-sm">
                    <FaStar size={11} />
                    <span>{avgRating}</span>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">({totalReviews} verified community reviews)</span>
                </div>

                {/* Pricing Block View */}
                <div className="mb-4">
                  <span className="text-gray-500 font-semibold tracking-wider text-[11px] uppercase block mb-0.5">Price</span>
                  <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-tight">
                    ₹{product?.price?.toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Core Description Markdown Block */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6 font-normal">
                  {product?.description || 'No extended overview provided for this specification.'}
                </p>

                {/* Inventory Stock Monitor Badge */}
                <div className="flex items-center gap-2 mb-2 bg-white/2 border border-white/[0.06] w-fit px-3 py-1.5 rounded-lg">
                  <span className="text-xs text-gray-400 font-medium">Availability:</span>
                  <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${product.stock > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    {product?.stock > 0 ? 'In Stock' : 'Out Of Stock'}
                  </span>
                </div>
              </div>

              {/* Form Trigger Primary Add Actions Button */}
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl py-3.5 text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(124,58,237,0.25)] flex items-center justify-center gap-2"
              >
                <FaShoppingCart size={14} /> Add Items to Bag Layout
              </motion.button>
            </div>
          )}
        </div>

        {/* --- CORE SPECIFICATIONS & EXTENDED HIGHLIGHTS --- */}
        {product && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0d0d11]/40 border border-white/[0.04] rounded-2xl p-6 backdrop-blur-sm">

            {/* Quick Policy Specs Strip */}
            <div className="md:col-span-5 space-y-4 border-b md:border-b-0 md:border-r border-white/[0.06] pb-6 md:pb-0 md:pr-6 justify-center flex flex-col">

              {/* Wearable Size Matrix rendering if declared variable isActive */}
              {product.isWearable && (
                <div className="mb-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FiLayers size={13} className="text-violet-400" /> Catalog Variants (Sizes)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes?.map((s) => (
                      <span key={s} className="px-3 py-1 bg-white/2 border border-white/[0.08] hover:border-violet-500/30 text-gray-200 text-xs font-semibold rounded-md transition-all shadow-inner">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 text-xs font-medium text-gray-300">
                {typeof product.replacementDay === 'number' && product.replacementDay > 0 && (
                  <div className="flex items-center gap-2.5 bg-white/1 border border-white/[0.03] p-2.5 rounded-lg">
                    <FaUndo className="text-violet-400" size={13} />
                    <span>{product.replacementDay} Days Hassle-Free Replacement Policy</span>
                  </div>
                )}
                {product.freeDelivery && (
                  <div className="flex items-center gap-2.5 bg-white/1 border border-white/[0.03] p-2.5 rounded-lg">
                    <FaTruck className="text-emerald-400" size={13} />
                    <span>Eligible for Free Standard Express Delivery Shipping</span>
                  </div>
                )}
                {product.payOnDelivery && (
                  <div className="flex items-center gap-2.5 bg-white/1 border border-white/[0.03] p-2.5 rounded-lg">
                    <FaCheckCircle className="text-sky-400" size={13} />
                    <span>Cash / Pay on Delivery (COD) Options Supported</span>
                  </div>
                )}
                {product.warranty && product.warranty !== 'No Warranty' && (
                  <div className="flex items-center gap-2.5 bg-white/1 border border-white/[0.03] p-2.5 rounded-lg">
                    <FaShieldAlt className="text-amber-400" size={13} />
                    <span>Coverage Parameters: Extended {product.warranty} Year Brand Warranty</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bullet Point Product Highlights Details */}
            <div className="md:col-span-7 flex flex-col justify-center pl-0 md:pl-2">
              {Array.isArray(product.detailsPoints) && product.detailsPoints.length > 0 ? (
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <FiList className="text-violet-400" /> Core Product Highlights
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 font-normal">
                    {product.detailsPoints.map((p, i) => (
                      <li key={i} className="flex items-start gap-2 bg-white/1 border border-white/[0.03] p-2.5 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                        <span className="leading-normal">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <span className="text-xs text-gray-500 italic">No structural bullet parameters mapped to item config.</span>
              )}
            </div>
          </div>
        )}

        {/* --- RELATED PRODUCTS SUGGESTIONS MATRIX --- */}
        {Array.isArray(relatedProducts) && relatedProducts.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2 border-b border-white/[0.06] pb-4">
              <h3 className="text-xl font-bold text-white tracking-tight">Related Product Collections</h3>
              <span className="bg-white/4 text-gray-400 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase border border-white/[0.08]">
                Matches Section
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center items-stretch">
              {relatedProducts.slice(0, 4).map((rp) => (
                <ProductCard key={rp?._id?.toString()} product={rp} />
              ))}
            </div>
          </div>
        )}

        {/* --- EXTENDED CUSTOMER REVIEWS PORTAL & FORM SYSTEM --- */}
        <div className="bg-[#0d0d11]/40 border border-white/[0.04] rounded-2xl p-4 sm:p-8 backdrop-blur-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT SUB-GRID COLUMN: Review Add Form */}
          <div className="lg:col-span-5 bg-[#121217]/50 border border-white/[0.04] p-5 rounded-xl space-y-4 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-gray-100 tracking-tight">Share Your Experience</h3>
              <p className="text-xs text-gray-400 mt-0.5">Help standard buyers check quality parameters metrics safely.</p>
            </div>

            {/* Interactive Rating Star */}
            <div>
              <span className="text-xs font-semibold text-gray-400 block mb-1.5">Rating Score</span>
              <div className="flex gap-1.5 text-xl text-gray-600">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.span
                    whileHover={{ scale: 1.15 }}
                    className="cursor-pointer transition-colors"
                    onClick={() => setReviewRating(i)}
                    key={i}
                  >
                    {i <= reviewRating ? <FaStar className="text-amber-400" /> : <FaRegStar className="hover:text-amber-400/60" />}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Structured Reviews Input */}
            <div>
              <span className="text-xs font-semibold text-gray-400 block mb-1.5">Review Message</span>
              <textarea
                placeholder="Describe your user experience, features build, shipping time metrics..."
                onChange={(e) => setReviewComment(e.target.value)}
                value={reviewCommnet}
                rows={3}
                className="w-full p-3 rounded-xl bg-black/40 text-gray-200 text-sm border border-white/[0.08] focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 transition-all focus:outline-none placeholder:text-gray-600 leading-relaxed resize-none"
              />
            </div>

            {/* Custom File Upload Assembly */}
            <div>
              <span className="text-xs font-semibold text-gray-400 block mb-1.5">Upload Product Media Image</span>
              <div className="flex items-center gap-3">
                <label
                  htmlFor="img"
                  className="bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/20 text-gray-300 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer flex items-center gap-2 transition-all shadow-inner shrink-0"
                >
                  <FiCamera size={14} className="text-violet-400" /> Choose Asset File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="img"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setReviewImage(file)
                      setPreview(URL.createObjectURL(file))
                    }
                  }}
                />

                <span className="text-[11px] text-gray-500 truncate max-w-[150px]">
                  {reviewImage ? reviewImage.name : 'No file chosen'}
                </span>
              </div>

              {/* Upload image preview */}
              <AnimatePresence>
                {preview && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="relative w-20 h-20 border border-white/[0.08] rounded-xl overflow-hidden mt-3 p-1 bg-black/20"
                  >
                    <Image src={preview} alt="Form Upload Frame Preview" fill className="object-cover rounded-lg" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={handleSubmitReviews}
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-50"
            >
              {loading ? <ClipLoader color="white" size={16} /> : 'Submit Verified Review'}
            </motion.button>
          </div>

          {/* RIGHT SUB-GRID COLUMN: Dynamic Feedback Feed */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Verified Feedback Index
              <span className="text-xs font-bold bg-white/[0.04] border border-white/[0.08] text-gray-400 px-2 py-0.5 rounded-full">
                {product?.reviews?.length || 0} Listed
              </span>
            </h2>

            {product?.reviews && product.reviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                {product.reviews.map((r, i) => (
                  <div
                    className="bg-[#121217]/40 border border-white/[0.04] rounded-xl p-4 flex flex-col justify-between space-y-3 shadow-inner hover:border-white/[0.08] transition-all"
                    key={i}
                  >
                    <div>
                      {/* Review User Badge Frame Metadata */}
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className="w-8 h-8 rounded-full border border-white/[0.08] overflow-hidden flex items-center justify-center bg-black/40 shrink-0 relative">
                          {r.user?.image ? (
                            <Image src={r.user.image} className="object-cover" alt="Avatar Asset" fill />
                          ) : (
                            <FaUserCircle size={18} className="text-gray-500" />
                          )}
                        </div>
                        <div className="truncate">
                          <p className="text-gray-200 font-semibold text-xs truncate">{r.user?.name || 'Anonymous Client'}</p>
                          <div className="flex text-amber-400 text-[10px] mt-0.5">
                            {[1, 2, 3, 4, 5].map((starIdx) => (
                              starIdx <= r.rating ? <FaStar key={starIdx} /> : <FaRegStar key={starIdx} className="text-gray-600" />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Plain Message Body Text Block */}
                      <p className="text-gray-300 text-xs font-normal leading-relaxed line-clamp-3">
                        {r.comment || 'User left a raw rating selection without written documentation review.'}
                      </p>
                    </div>

                    {/* Attached Review Photo asset token */}
                    {r.image && (
                      <div className="relative w-full h-24 bg-black/20 border border-white/[0.04] rounded-lg overflow-hidden shrink-0 mt-2 p-1">
                        <Image src={r.image} alt="Customer Proof Asset File" fill className="object-cover rounded-md" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full text-center py-14 px-6 bg-white/[0.01] border border-dashed border-white/[0.06] rounded-xl">
                <div className="w-12 h-12 bg-white/[0.02] border border-white/[0.06] rounded-xl flex items-center justify-center text-gray-600 mx-auto mb-3">
                  <FiCamera size={20} />
                </div>
                <h3 className="text-sm font-semibold text-gray-300">No community images or feedback verified</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-normal">
                  Be the first consumer to file a certified purchase overview review on this product block module asset checklist!
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default ViewProduct