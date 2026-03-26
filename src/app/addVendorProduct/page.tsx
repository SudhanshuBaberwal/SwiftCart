'use client'
import React, { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import { ClipLoader } from 'react-spinners'
import toast, { Toaster } from 'react-hot-toast' // <-- Imported toast here
import { 
    LuBox, LuDollarSign, LuTag, LuAlignLeft, 
    LuImagePlus, LuTruck, LuShieldCheck, LuListPlus, 
    LuShirt, LuX, LuPlus, LuCheck, LuCloudUpload,
    LuArrowLeft
} from 'react-icons/lu'

const categories = [
    "Fashion & Lifestyle", "Electronics & Gadgets", "Home & Living",
    "Beauty & Personal Care", "Toys, Kids & Baby", "Food & Grocery",
    "Sports & Fitness", "Automotive Accessories", "Gift & Handcrafts",
    "Books & Stationery", "Others"
]

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"]

const AddProductPage = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    // Form States
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [stock, setStock] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [customCategory, setCustomCategory] = useState("")
    
    // Toggles & Options
    const [isWearable, setIsWearable] = useState(false)
    const [sizes, setSizes] = useState<string[]>([])
    const [freeDelivery, setFreeDelivery] = useState(false)
    const [payOnDelivery, setPayOnDelivery] = useState(false)
    const [replacementDays, setReplacementDays] = useState("")
    const [warranty, setWarranty] = useState("")

    // Images
    const [images, setImages] = useState<(File | null)[]>([null, null, null, null])
    const [previews, setPreviews] = useState<(string | null)[]>([null, null, null, null])

    // Details Points
    const [currentPoint, setCurrentPoint] = useState("")
    const [detailPoints, setDetailPoints] = useState<string[]>([])

    // Handlers
    const toggleSize = (size: string) => {
        setSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size])
    }

    const handleAddPoint = () => {
        if (!currentPoint.trim()) return;
        setDetailPoints([...detailPoints, currentPoint.trim()])
        setCurrentPoint("")
    }

    const removePoint = (indexToRemove: number) => {
        setDetailPoints(prev => prev.filter((_, index) => index !== indexToRemove))
    }

    const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const newImages = [...images];
        newImages[index] = file;
        setImages(newImages);

        const newPreviews = [...previews];
        newPreviews[index] = URL.createObjectURL(file);
        setPreviews(newPreviews);
    }

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages[index] = null;
        setImages(newImages);

        const newPreviews = [...previews];
        newPreviews[index] = null;
        setPreviews(newPreviews);
    }

    const handleSubmit = async () => {
        if (!title || !description || !stock || !price || !category || images.includes(null)) {
            toast.error("All primary fields and 4 images are required.") // <-- Replaced alert
            return;
        }
        if (isWearable && sizes.length === 0) {
            toast.error("Please select at least one size for wearable products.") // <-- Replaced alert
            return;
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

        images.forEach((img, i) => {
            if (img) formdata.append(`image${i + 1}`, img)
        })

        try {
            await axios.post("/api/vendor/addProduct", formdata)
            toast.success("Product submitted successfully! Waiting for Admin Approval.") // <-- Replaced alert
            setTimeout(() => {
                router.push("/")
            }, 1500) // Give the user a moment to read the toast before redirecting
        } catch (error) {
            console.error("Error in Add Product", error)
            toast.error("Failed to add product. Please try again.") // <-- Replaced alert
        } finally {
            setLoading(false)
        }
    }

    // Reusable styles
    const inputClass = "w-full bg-[#030305] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all shadow-inner";
    const labelClass = "text-[11px] font-bold text-gray-400 mb-2 ml-1 block uppercase tracking-wider";
    const sectionClass = "bg-[#0a0a0c] border border-white/5 p-6 sm:p-8 rounded-3xl space-y-6 shadow-xl relative overflow-hidden";

    // Custom Toggle Switch Component
    const ToggleSwitch = ({ checked, onChange, label, subtext }: { checked: boolean, onChange: () => void, label: string, subtext?: string }) => (
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
            {/* The Toaster component styles the notifications */}
            <Toaster 
                position="bottom-center"
                toastOptions={{
                    style: {
                        background: '#0a0a0c',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '16px',
                        borderRadius: '16px',
                    },
                    success: { iconTheme: { primary: '#8b5cf6', secondary: '#fff' } }, // Violet theme for success
                    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                }}
            />

            {/* Ambient Glow */}
            <div className="fixed top-0 left-1/4 w-[50%] h-[50%] bg-violet-600/10 blur-[150px] rounded-full pointer-events-none" />

            {/* Top Navigation Bar */}
            <div className="sticky top-0 z-40 bg-[#030305]/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-gray-400 hover:text-white">
                        <LuArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className='text-xl font-bold'>Create Product</h1>
                        <p className="text-xs text-gray-500">Add a new item to your store</p>
                    </div>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className='relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8'
            >
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* --- LEFT COLUMN: MAIN CONTENT --- */}
                    <div className="flex-1 space-y-8">
                        
                        {/* 1. GENERAL INFO */}
                        <div className={sectionClass}>
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-2"><LuBox className="text-violet-400"/> General Information</h2>
                            
                            <div>
                                <label className={labelClass}>Product Title</label>
                                <input type="text" className={inputClass} placeholder='e.g. Premium Wireless Over-Ear Headphones' value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>

                            <div>
                                <label className={labelClass}>Description</label>
                                <textarea className={`${inputClass} min-h-[160px] resize-y`} placeholder='Describe the product in detail. What makes it special?' value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                        </div>

                        {/* 2. MEDIA UPLOAD */}
                        <div className={sectionClass}>
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-2"><LuImagePlus className="text-pink-400"/> Product Media</h2>
                            <p className="text-xs text-gray-500 mb-6">Upload 4 high-quality images. The first image will be your primary cover.</p>
                            
                            <div className='grid grid-cols-3 gap-4'>
                                {/* Primary Cover Image */}
                                <div className="col-span-3 relative group">
                                    <input type="file" hidden id='img-0' accept='image/*' onChange={(e) => handleImageChange(0, e)} />
                                    {previews[0] ? (
                                        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-violet-500/30">
                                            <Image src={previews[0]!} alt="Preview 0" fill className='object-cover' />
                                            <div className="absolute top-3 left-3 bg-violet-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">PRIMARY COVER</div>
                                            <button onClick={() => removeImage(0)} className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-500 rounded-full backdrop-blur-md transition-colors"><LuX size={16} /></button>
                                        </div>
                                    ) : (
                                        <label htmlFor='img-0' className='cursor-pointer bg-[#030305] hover:bg-white/5 transition-colors border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-2xl h-64 sm:h-80 flex flex-col items-center justify-center gap-3'>
                                            <div className="p-4 bg-white/5 rounded-full text-gray-400 group-hover:text-violet-400 group-hover:scale-110 transition-all"><LuCloudUpload size={32} /></div>
                                            <div className="text-center">
                                                <span className="text-sm font-bold text-gray-300 block">Upload Primary Image</span>
                                                <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                                            </div>
                                        </label>
                                    )}
                                </div>

                                {/* Remaining 3 Images */}
                                {[1, 2, 3].map((index) => (
                                    <div key={index} className="col-span-1 relative group">
                                        <input type="file" hidden id={`img-${index}`} accept='image/*' onChange={(e) => handleImageChange(index, e)} />
                                        {previews[index] ? (
                                            <div className="relative h-32 sm:h-40 w-full rounded-xl overflow-hidden border border-white/10">
                                                <Image src={previews[index]!} alt={`Preview ${index}`} fill className='object-cover' />
                                                <button onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-full backdrop-blur-md transition-colors"><LuX size={14} /></button>
                                            </div>
                                        ) : (
                                            <label htmlFor={`img-${index}`} className='cursor-pointer bg-[#030305] hover:bg-white/5 transition-colors border-2 border-dashed border-white/10 hover:border-violet-500/50 rounded-xl h-32 sm:h-40 flex flex-col items-center justify-center gap-2'>
                                                <LuPlus size={24} className="text-gray-500 group-hover:text-violet-400 transition-colors" />
                                            </label>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. HIGHLIGHTS & DETAILS */}
                        <div className={sectionClass}>
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-2"><LuListPlus className="text-yellow-400"/> Key Highlights</h2>
                            
                            <div className='flex gap-3'>
                                <input type="text" className={inputClass} placeholder='e.g. 24-hour battery life' value={currentPoint} onChange={(e) => setCurrentPoint(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPoint())} />
                                <button type='button' onClick={handleAddPoint} className='px-6 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-colors'>Add</button>
                            </div>

                            {detailPoints.length > 0 && (
                                <div className='mt-4 space-y-2'>
                                    {detailPoints.map((point, index) => (
                                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} key={index} className='flex justify-between items-center bg-[#030305] border border-white/5 p-3 px-4 rounded-xl'>
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                                                <span className='text-sm text-gray-200'>{point}</span>
                                            </div>
                                            <button type='button' onClick={() => removePoint(index)} className='text-gray-500 hover:text-red-400 p-1 transition-colors'><LuX size={16} /></button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* --- RIGHT COLUMN: METADATA & SETTINGS --- */}
                    <div className="w-full lg:w-[360px] space-y-8">
                        
                        {/* 4. ORGANIZATION */}
                        <div className={sectionClass}>
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><LuTag className="text-blue-400"/> Organization</h2>
                            
                            <div>
                                <label className={labelClass}>Product Category</label>
                                <div className="relative">
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} appearance-none cursor-pointer font-medium`}>
                                        <option value="" disabled className="bg-gray-900">Select a Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <AnimatePresence>
                                {category === "Others" && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4">
                                        <label className={labelClass}>Custom Category</label>
                                        <input type="text" className={inputClass} placeholder='Enter custom category' value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 5. PRICING & STOCK */}
                        <div className={sectionClass}>
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><LuDollarSign className="text-emerald-400"/> Pricing & Stock</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className={labelClass}>Price (₹)</label>
                                    <input type="number" className={`${inputClass} text-xl font-bold`} placeholder='0.00' value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Inventory / Stock</label>
                                    <input type="number" className={inputClass} placeholder='Available quantity' value={stock} onChange={(e) => setStock(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* 6. APPAREL SETTINGS */}
                        <div className={sectionClass}>
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><LuShirt className="text-cyan-400"/> Apparel Options</h2>
                            <ToggleSwitch checked={isWearable} onChange={() => setIsWearable(!isWearable)} label="Wearable Item" subtext="Enable size selection" />

                            <AnimatePresence>
                                {isWearable && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-4 overflow-hidden">
                                        <label className={labelClass}>Available Sizes</label>
                                        <div className='flex flex-wrap gap-2 mt-2'>
                                            {sizeOptions.map((size) => {
                                                const isSelected = sizes.includes(size);
                                                return (
                                                    <button
                                                        key={size} type='button' onClick={() => toggleSize(size)}
                                                        className={`w-[45px] h-[45px] rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center border
                                                            ${isSelected ? "bg-violet-600 border-violet-500 shadow-lg text-white" : "bg-[#030305] border-white/10 text-gray-500 hover:border-white/30"}`}
                                                    >
                                                        {size}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 7. SHIPPING */}
                        <div className={sectionClass}>
                            <h2 className="text-lg font-bold flex items-center gap-2 mb-4"><LuTruck className="text-orange-400"/> Shipping</h2>
                            
                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className={labelClass}>Replacement Window</label>
                                    <input type="text" className={inputClass} placeholder='e.g. 7 Days' value={replacementDays} onChange={(e) => setReplacementDays(e.target.value)} />
                                </div>
                                <div>
                                    <label className={labelClass}>Warranty</label>
                                    <input type="text" className={inputClass} placeholder='e.g. 1 Year' value={warranty} onChange={(e) => setWarranty(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <ToggleSwitch checked={freeDelivery} onChange={() => setFreeDelivery(!freeDelivery)} label="Free Delivery" />
                                <ToggleSwitch checked={payOnDelivery} onChange={() => setPayOnDelivery(!payOnDelivery)} label="Pay on Delivery" />
                            </div>
                        </div>

                    </div>
                </div>
            </motion.div>

            {/* --- STICKY ACTION BAR --- */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0c]/90 backdrop-blur-xl border-t border-white/10 p-4 sm:p-5 z-50">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="hidden sm:block">
                        <p className="text-sm font-bold text-white">Ready to publish?</p>
                        <p className="text-xs text-gray-400">Ensure all 4 images are uploaded before saving.</p>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                        <button onClick={() => router.back()} className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors flex-1 sm:flex-none">
                            Cancel
                        </button>
                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={loading} onClick={handleSubmit}
                            className='px-8 py-3 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 rounded-xl font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] flex justify-center items-center gap-2 transition-all flex-1 sm:flex-none'
                        >
                            {loading ? <ClipLoader size={20} color='white' /> : <><LuCheck size={20} /> Publish Product</>}
                        </motion.button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AddProductPage