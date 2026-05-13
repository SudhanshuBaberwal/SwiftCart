'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { ClipLoader } from 'react-spinners'
import toast, { Toaster } from 'react-hot-toast'
import {
  LuBox, LuDollarSign, LuTag, LuAlignLeft,
  LuImagePlus, LuTruck, LuShieldCheck, LuListPlus,
  LuShirt, LuX, LuPlus, LuCheck, LuCloudUpload,
  LuArrowLeft
} from 'react-icons/lu'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

const categories = [
  "Fashion & Lifestyle", "Electronics & Gadgets", "Home & Living",
  "Beauty & Personal Care", "Toys, Kids & Baby", "Food & Grocery",
  "Sports & Fitness", "Automotive Accessories", "Gift & Handcrafts",
  "Books & Stationery", "Others"
]

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"]

const UpdateProduct = () => {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const [loading, setLoading] = useState(false)

  // Redux Data
  const { allProdutctsData } = useSelector((state: RootState) => state.vendor)
  console.log(allProdutctsData)
  const product = Array.isArray(allProdutctsData) ?  allProdutctsData?.find((p: any) => String(p._id) === String(productId)) : null
  console.log(product)

  // Form States
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [stock, setStock] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [isWearable, setIsWearable] = useState(false)
  const [sizes, setSizes] = useState<string[]>([])
  const [freeDelivery, setFreeDelivery] = useState(false)
  const [payOnDelivery, setPayOnDelivery] = useState(false)
  const [replacementDays, setReplacementDays] = useState("")
  const [warranty, setWarranty] = useState("")
  const [detailPoints, setDetailPoints] = useState<string[]>([])
  const [currentPoint, setCurrentPoint] = useState("")

  // Image States: images stores the File objects (if newly uploaded), previews stores the URL
  const [images, setImages] = useState<(File | null)[]>([null, null, null, null])
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null])

  // 1. Fill Up Values on Mount
  useEffect(() => {
    if (!product) return

    setTitle(product.title || "")
    setDescription(product.description || "")
    setPrice(String(product.price))
    setStock(String(product.stock))
    
    // Logic for Custom Category
    if (categories.includes(product.category)) {
      setCategory(product.category)
    } else {
      setCategory("Others")
      setCustomCategory(product.category)
    }

    setIsWearable(Boolean(product.isWearable))
    setSizes(product.sizes || [])
    setReplacementDays(product.replacementDay ? String(product.replacementDay) : "")
    setWarranty(product.warranty || "")
    setFreeDelivery(Boolean(product.freeDelivery))
    setPayOnDelivery(Boolean(product.payOnDelivery))
    setDetailPoints(product.detailsPoints || [])


   const productImages = [
  product.image1,
  product.image2,
  product.image3,
  product.image4,
];

productImages.forEach((url, index) => {
  if (url && index < 4) {
    previews[index] = url;
  }
});
  }, [product])

  // Handlers
  const toggleSize = (size: string) => {
    setSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size])
  }

  const handleAddPoint = () => {
    if (!currentPoint.trim()) return
    setDetailPoints([...detailPoints, currentPoint.trim()])
    setCurrentPoint("")
  }

  const removePoint = (indexToRemove: number) => {
    setDetailPoints(prev => prev.filter((_, index) => index !== indexToRemove))
  }

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const newImages = [...images]
    newImages[index] = file
    setImages(newImages)

    const newPreviews = [...previews]
    newPreviews[index] = URL.createObjectURL(file)
    setPreviews(newPreviews)
  }

  const removeImage = (index: number) => {
    const newImages = [...images]; newImages[index] = null; setImages(newImages)
    const newPreviews = [...previews]; newPreviews[index] = null; setPreviews(newPreviews)
  }

  const handleSubmit = async () => {
    // Check if at least the title/price/stock/category exists
    if (!title || !description || !stock || !price || !category) {
      toast.error("Please fill in all required fields.")
      return
    }

    // Check if all 4 slots have either a File OR an existing URL
    if (previews.some(p => p === null)) {
        toast.error("All 4 image slots must be filled (new or existing).")
        return
    }

    setLoading(true)
    const formdata = new FormData()
    formdata.append("title", title)
    formdata.append("description", description)
    formdata.append("price", price)
    formdata.append("stock", stock)
    formdata.append("category", category === "Others" ? customCategory : category)
    formdata.append("isWearable", String(isWearable))
    sizes.forEach((size) => formdata.append("sizes", size))
    formdata.append("replacementDays", replacementDays)
    formdata.append("freeDelivery", String(freeDelivery))
    formdata.append("warranty", warranty)
    formdata.append("payOnDelivery", String(payOnDelivery))
    detailPoints.forEach((point) => formdata.append("detailsPoints", point))

    // Append Images: 
    // If it's a File object, it's new. 
    // If it's null in 'images' but exists in 'previews', it's an existing URL (send it as a string or keep it as is based on your backend)
    images.forEach((img, i) => {
      if (img) {
        formdata.append(`image${i + 1}`, img)
      } else if (previews[i]) {
        // We tell the backend to keep the existing image for this slot
        formdata.append(`existingImage${i + 1}`, previews[i] as string)
      }
    })

    try {
      // Changed to PUT and added productId
      await axios.put(`/api/vendor/updateProduct/${productId}`, formdata)
      toast.success("Product updated successfully!")
      setTimeout(() => router.push("/vendor/dashboard"), 1500)
    } catch (error) {
      console.error("Update Error:", error)
      toast.error("Failed to update product.")
    } finally {
      setLoading(false)
    }
  }

  // Styles (same as your original)
  const inputClass = "w-full bg-[#030305] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all shadow-inner";
  const labelClass = "text-[11px] font-bold text-gray-400 mb-2 ml-1 block uppercase tracking-wider";
  const sectionClass = "bg-[#0a0a0c] border border-white/5 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden";

  const ToggleSwitch = ({ checked, onChange, label, subtext }: any) => (
    <div className="flex items-center justify-between bg-[#030305] border border-white/5 p-4 rounded-xl cursor-pointer hover:border-white/10 transition-colors" onClick={onChange}>
      <div>
        <span className="text-sm font-semibold text-gray-200 block">{label}</span>
        {subtext && <span className="text-xs text-gray-500">{subtext}</span>}
      </div>
      <div className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-violet-600' : 'bg-white/10'}`}>
        <motion.div layout className={`w-4 h-4 bg-white rounded-full shadow-md ${checked ? 'ml-auto' : 'mr-auto'}`} />
      </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-[#030305] text-white pb-32'>
      <Toaster position="bottom-center" />
      <div className="fixed top-0 left-1/4 w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-[#030305]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white">
            <LuArrowLeft size={20} />
          </button>
          <div>
            <h1 className='text-xl font-bold'>Update Product</h1>
            <p className="text-xs text-gray-500">Edit {product?.title || "Product Details"}</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className='relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8'
      >
        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-8">
            {/* General Info */}
            <div className={sectionClass}>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-2"><LuBox className="text-violet-400" /> General Information</h2>
              <div>
                <label className={labelClass}>Product Title</label>
                <input type="text" className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <textarea className={`${inputClass} min-h-[160px]`} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
            </div>

            {/* Media Upload */}
            <div className={sectionClass}>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-2"><LuImagePlus className="text-pink-400" /> Product Media</h2>
              <div className='grid grid-cols-3 gap-4'>
                <div className="col-span-3 relative group">
                  <input type="file" hidden id='img-0' accept='image/*' onChange={(e) => handleImageChange(0, e)} />
                  {previews[0] ? (
                    <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-violet-500/30">
                      <Image src={previews[0]!} alt="Preview 0" fill className='object-cover' unoptimized />
                      <button onClick={() => removeImage(0)} className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-500 rounded-full backdrop-blur-md transition-colors"><LuX size={16} /></button>
                    </div>
                  ) : (
                    <label htmlFor='img-0' className='cursor-pointer border-2 border-dashed border-white/10 rounded-2xl h-64 sm:h-80 flex flex-col items-center justify-center'>
                      <LuCloudUpload size={32} className="text-gray-400" />
                      <span className="text-sm font-bold text-gray-300">Upload New Primary Image</span>
                    </label>
                  )}
                </div>
                {[1, 2, 3].map((index) => (
                  <div key={index} className="col-span-1 relative group">
                    <input type="file" hidden id={`img-${index}`} accept='image/*' onChange={(e) => handleImageChange(index, e)} />
                    {previews[index] ? (
                      <div className="relative h-32 sm:h-40 w-full rounded-xl overflow-hidden border border-white/10">
                        <Image src={previews[index]!} alt={`Preview ${index}`} fill className='object-cover' unoptimized />
                        <button onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-full transition-colors"><LuX size={14} /></button>
                      </div>
                    ) : (
                      <label htmlFor={`img-${index}`} className='cursor-pointer border-2 border-dashed border-white/10 rounded-xl h-32 sm:h-40 flex items-center justify-center'>
                        <LuPlus size={24} className="text-gray-500" />
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className={sectionClass}>
                <h2 className="text-lg font-bold flex items-center gap-2 mb-2"><LuListPlus className="text-yellow-400" /> Key Highlights</h2>
                <div className='flex gap-3'>
                    <input type="text" className={inputClass} placeholder='Add highlight...' value={currentPoint} onChange={(e) => setCurrentPoint(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPoint())} />
                    <button type='button' onClick={handleAddPoint} className='px-6 bg-white/10 rounded-xl font-bold'>Add</button>
                </div>
                <div className='mt-4 space-y-2'>
                    {detailPoints.map((point, index) => (
                        <div key={index} className='flex justify-between items-center bg-[#030305] border border-white/5 p-3 rounded-xl'>
                            <span className='text-sm text-gray-200'>{point}</span>
                            <button type='button' onClick={() => removePoint(index)} className='text-gray-500 hover:text-red-400'><LuX size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>
          </div>

          <div className="w-full lg:w-90 space-y-8">
            {/* Organization */}
            <div className={sectionClass}>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><LuTag className="text-blue-400" /> Organization</h2>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                <option value="" disabled>Select Category</option>
                {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              {category === "Others" && (
                <div className="pt-4">
                  <input type="text" className={inputClass} placeholder='Enter custom category' value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className={sectionClass}>
                <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><LuDollarSign className="text-emerald-400" /> Pricing & Stock</h2>
                <div className="space-y-4">
                    <input type="number" className={inputClass} placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)} />
                    <input type="number" className={inputClass} placeholder='Stock' value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
            </div>

            {/* Apparel */}
            <div className={sectionClass}>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><LuShirt className="text-cyan-400" /> Apparel</h2>
              <ToggleSwitch checked={isWearable} onChange={() => setIsWearable(!isWearable)} label="Wearable" />
              {isWearable && (
                <div className='flex flex-wrap gap-2 mt-4'>
                  {sizeOptions.map((size) => (
                    <button key={size} onClick={() => toggleSize(size)} className={`w-10 h-10 rounded-lg text-xs font-bold border ${sizes.includes(size) ? "bg-violet-600 border-violet-500" : "bg-[#030305] border-white/10"}`}>
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Shipping */}
            <div className={sectionClass}>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><LuTruck className="text-orange-400" /> Shipping</h2>
              <input type="text" className={inputClass} placeholder='Replacement window' value={replacementDays} onChange={(e) => setReplacementDays(e.target.value)} />
              <div className="pt-4 space-y-3">
                <ToggleSwitch checked={freeDelivery} onChange={() => setFreeDelivery(!freeDelivery)} label="Free Delivery" />
                <ToggleSwitch checked={payOnDelivery} onChange={() => setPayOnDelivery(!payOnDelivery)} label="COD" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0c]/90 backdrop-blur-xl border-t border-white/10 p-4 z-50">
        <div className="max-w-6xl mx-auto flex justify-end gap-4">
          <button onClick={() => router.back()} className="px-6 py-3 text-gray-400 font-bold">Cancel</button>
          <button
            disabled={loading} onClick={handleSubmit}
            className='px-8 py-3 bg-violet-600 rounded-xl font-bold flex items-center gap-2'
          >
            {loading ? <ClipLoader size={20} color='white' /> : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateProduct