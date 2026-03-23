'use client'
import { motion } from 'motion/react'
import Image from 'next/image'
import React, { useState } from 'react'
import { FaFileUpload } from 'react-icons/fa'

const categories = [
    "Fashion & Lifestyle",
    "Electronics & Gadgets",
    "Home & Living",
    "Beauty & Personal Care",
    "Toys, Kids & Baby",
    "Food & Grocery",
    "Sports & Fitness",
    "Automotive Accessories",
    "Gift & Handcrafts",
    "Book &  Handcrafts",
    "Books &  Stationery",
    "Others"
]

const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"]

const page = () => {

    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [stock, setStock] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("")
    const [customCategory, setCustomCategory] = useState("")
    const [isWearable, setIsWearable] = useState(false)
    const [sizes, setSizes] = useState<string[]>([])
    const [replacementDays, setReplacementDays] = useState("")
    const [warranty, setWarranty] = useState("")
    const [freeDelivery, setFreeDelivery] = useState(false)
    const [payOnDelivery, setPayOnDelivery] = useState(false)

    const [image1, setImage1] = useState<File | null>(null)
    const [image2, setImage2] = useState<File | null>(null)
    const [image3, setImage3] = useState<File | null>(null)
    const [image4, setImage4] = useState<File | null>(null)

    const [preview1, setPreview1] = useState<string | null>(null)
    const [preview2, setPreview2] = useState<string | null>(null)
    const [preview3, setPreview3] = useState<string | null>(null)
    const [preview4, setPreview4] = useState<string | null>(null)

    const [currentPoint, setCurrentPoint] = useState("")
    const [pointIndex, setPointIndex] = useState(0)
    const [detailPoint, setDetailPoint] = useState<string[]>([])



    const toggleSizes = (size: string) => {
        setSizes((prev) => prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size])
    }

    const handleAddPoint = () => {
        if (!currentPoint.trim()) return;
        setDetailPoint((prev) => {
            const updated = [...prev]
            updated[pointIndex] = currentPoint
            return updated;
        })
        setCurrentPoint("")
        setPointIndex((prev) => prev + 1)
    }

    return (
        <div className='min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white px-4 pt-20 pb-10'>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='max-w-3xl mask-auto bg-white/10 backdrop:blur-xl p-6 sm:p-10 rounded-2xl border border-white/20 shadow-xl'
            >
                <h1 className='text-2xl sm:text-3xl font-bold mb-6'>Add New Product</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

                    <input type="text" className='p-3 bg-white/10 border border-white/20 rounded ' placeholder='Product Title' onChange={(e) => setTitle(e.target.value)} value={title} />

                    <input type="number" className='p-3 bg-white/10 border border-white/20 rounded ' placeholder='Price' value={price} onChange={(e) => setPrice(e.target.value)} />

                    <input type="number" className='p-3 bg-white/10 border border-white/20 rounded ' placeholder='Stock Quantity' value={stock} onChange={(e) => setStock(e.target.value)} />

                    <select onChange={(e) => setCategory(e.target.value)} className='p-3 bg-white/10 border border-white/20 rounded text-white'>
                        <option className='bg-gray-800 ' value="">Select Category</option>
                        {categories.map((cat) => (
                            <option className='bg-gray-900 ' key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {category === "Others" &&
                    <input type="text" className='mt-4 w-full p-3 bg-white/10 border border-white/20 rounded'
                        placeholder='Enter Custom Category'
                        value={customCategory} onChange={(e) => setCustomCategory(e.target.value)}
                    />
                }

                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder='Product Description' className='mt-4 w-full p-3 bg-white/10 border border-white/20 rounded' >

                </textarea>

                <div className='flex items-center gap-3 mt-5'>
                    <input type="checkbox" className='w-5 h-5'
                        checked={isWearable}
                        onChange={(e) => setIsWearable(!isWearable)}
                    />
                    <span className='text-sm'>This is Wearable / Clothing Product</span>
                </div>

                {isWearable &&
                    <div className='mt-4'>
                        <p className=' mb-2 text-sm font-semibold '>Select Sizes</p>
                        <div className='flex flex-wrap gap-3'>
                            {sizeOptions.map((size) => (
                                <button
                                    type='button'
                                    className={`px-4 py-1 rounded-full border 
                                    ${sizes.includes(size) ?
                                            "bg-blue-600 border-blue-500"
                                            :
                                            "bg-white/10 border-white/20"
                                        }
                                    `}
                                    onClick={() => toggleSizes(size)}
                                    key={size}

                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                }

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6'>
                    <input type="text" className='p-3 bg-white/10 border border-white/20 rounded '
                        placeholder='ReplacementDays (eg. 7 days)'
                        onChange={(e) => setReplacementDays(e.target.value)}
                        value={replacementDays}
                    />

                    <input type="text" className='p-3 bg-white/10 border border-white/20 rounded '
                        placeholder='Warranty'
                        onChange={(e) => setWarranty(e.target.value)}
                        value={warranty}
                    />
                </div>

                <div className='flex items-center gap-3 mt-5'>
                    <input type="checkbox" className='w-5 h-5'
                        checked={freeDelivery}
                        onChange={(e) => setFreeDelivery(!freeDelivery)}
                    />
                    <span className='text-sm'>Free Delivery</span>
                    <input type="checkbox" className='w-5 h-5'
                        checked={payOnDelivery}
                        onChange={(e) => setPayOnDelivery(!payOnDelivery)}
                    />
                    <span className='text-sm'>Pay On Delivery</span>
                </div>

                <h3 className='mt-6 mb-3 font-semibold'>Upload Image</h3>
                <div className=' grid grid-cols-2 sm:grid-cols-4 gap-4'>
                    {/* image1  */}
                    <div>
                        <input type="file" hidden id='img1' accept='image/*'
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setImage1(file)
                                setPreview1(URL.createObjectURL(file))
                            }}
                        />
                        <label htmlFor="img1"
                            className='cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20'
                        >
                            {preview1 ? (<Image src={preview1} alt='img1' width={120} height={120} className='w-full h-full object-cover rounded ' />)
                                :
                                (
                                    <div className='flex flex-col items-center text-gray-400 text-xs'>
                                        <FaFileUpload size={12} />
                                        <span>Image 1</span>
                                    </div>
                                )}
                        </label>
                    </div>
                    {/* image2  */}
                    <div>
                        <input type="file" hidden id='img2' accept='image/*'
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setImage2(file)
                                setPreview2(URL.createObjectURL(file))
                            }}
                        />
                        <label htmlFor="img2"
                            className='cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20'
                        >
                            {preview2 ? (<Image src={preview2} alt='img1' width={120} height={120} className='w-full h-full object-cover rounded ' />)
                                :
                                (
                                    <div className='flex flex-col items-center text-gray-400 text-xs'>
                                        <FaFileUpload size={12} />
                                        <span>Image 2</span>
                                    </div>
                                )}
                        </label>
                    </div>
                    {/* image 3  */}
                    <div>
                        <input type="file" hidden id='img3' accept='image/*'
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setImage3(file)
                                setPreview3(URL.createObjectURL(file))
                            }}
                        />
                        <label htmlFor="img3"
                            className='cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20'
                        >
                            {preview3 ? (<Image src={preview3} alt='img1' width={120} height={120} className='w-full h-full object-cover rounded ' />)
                                :
                                (
                                    <div className='flex flex-col items-center text-gray-400 text-xs'>
                                        <FaFileUpload size={12} />
                                        <span>Image 3</span>
                                    </div>
                                )}
                        </label>
                    </div>
                    {/* iamge 4  */}
                    <div>
                        <input type="file" hidden id='img4' accept='image/*'
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setImage4(file)
                                setPreview4(URL.createObjectURL(file))
                            }}
                        />
                        <label htmlFor="img4"
                            className='cursor-pointer bg-gray-800 p-2 rounded h-28 flex items-center justify-center border border-white/20'
                        >
                            {preview4 ? (<Image src={preview4} alt='img1' width={120} height={120} className='w-full h-full object-cover rounded ' />)
                                :
                                (
                                    <div className='flex flex-col items-center text-gray-400 text-xs'>
                                        <FaFileUpload size={12} />
                                        <span>Image 4</span>
                                    </div>
                                )}
                        </label>
                    </div>
                </div>

                <div className='mt-6'>
                    <p className='font-semibold mb-2'>Product Details Points</p>
                    <div className='flex gap-2'>
                        <input type="text" className='flex-1 p-3 bg-white/10 border border-white/20 rounded' placeholder={`Point ${pointIndex + 1}`} onChange={(e) => setCurrentPoint(e.target.value)} value={currentPoint} />
                        <button onClick={handleAddPoint} type='button' className='px-4 bg-blue-600 hover:bg-blue-700 rounded font-semibold'>Add Point</button>
                    </div>
                    {detailPoint.length > 0 && (
                        <ul className='mt-3 space-y-2'>
                            {detailPoint.map((point, index) => (
                                <li key={index} className='flex justify-between items-center bg-white/10 p-2 rounded '>
                                    <span className='text-sm'>{index + 1}. {point}</span>
                                    <button
                                    type='button'
                                        onClick={() => {
                                            setDetailPoint(prev => prev.filter((_, i) => i !== index))
                                        }}
                                        className='text-red-400 text-xs'
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <motion.button>Add Product</motion.button>

            </motion.div>
        </div>
    )
}

export default page
