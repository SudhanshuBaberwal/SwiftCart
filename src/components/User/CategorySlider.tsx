'use client'
import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

const CategorySlider = () => {
    const categories = [
        { label: "Fashion & Lifestyle", icon: "👕", color: "from-blue-500/10 to-purple-500/10" },
        { label: "Electronics", icon: "💻", color: "from-cyan-500/10 to-blue-500/10" },
        { label: "Mobiles & Accessories", icon: "📱", color: "from-indigo-500/10 to-cyan-500/10" },
        { label: "Home & Kitchen", icon: "🏠", color: "from-orange-500/10 to-red-500/10" },
        { label: "Beauty & Personal Care", icon: "💄", color: "from-pink-500/10 to-rose-500/10" },
        { label: "Sports & Fitness", icon: "🏋️‍♂️", color: "from-green-500/10 to-emerald-500/10" },
        { label: "Books & Stationery", icon: "📚", color: "from-yellow-500/10 to-orange-500/10" },
        { label: "Toys & Baby", icon: "🧸", color: "from-purple-500/10 to-pink-500/10" },
        { label: "Groceries", icon: "🛒", color: "from-emerald-500/10 to-teal-500/10" },
        { label: "Footwear", icon: "👟", color: "from-blue-500/10 to-indigo-500/10" },
        { label: "Jewelry", icon: "💍", color: "from-amber-500/10 to-yellow-500/10" },
        { label: "Furniture", icon: "🛋️", color: "from-stone-500/10 to-gray-500/10" },
        { label: "Automotive", icon: "🚗", color: "from-red-500/10 to-orange-500/10" },
        { label: "Gaming", icon: "🎮", color: "from-violet-500/10 to-purple-500/10" },
        { label: "Health", icon: "💊", color: "from-teal-500/10 to-cyan-500/10" },
        { label: "Pet Supplies", icon: "🐶", color: "from-amber-500/10 to-orange-500/10" },
        { label: "Office", icon: "📦", color: "from-gray-500/10 to-slate-500/10" },
    ]

    const [startIndex, setStartIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const itemsPerPage = 5

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setStartIndex((prev) =>
                prev + itemsPerPage >= categories.length ? 0 : prev + itemsPerPage
            )
        }, 5000)

        return () => clearInterval(interval)
    }, [isHovered, categories.length])

    const handleNext = () => {
        setStartIndex((prev) =>
            prev + itemsPerPage >= categories.length ? 0 : prev + itemsPerPage
        )
    }

    const handlePrev = () => {
        setStartIndex((prev) =>
            prev - itemsPerPage < 0 ? Math.max(0, categories.length - (categories.length % itemsPerPage || itemsPerPage)) : prev - itemsPerPage
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true, margin: "-50px" }}
            className='w-full max-w-[95%] xl:max-w-350 mx-auto py-16 relative'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div>
                    <h2 className='text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2'>
                        Explore Categories
                    </h2>
                    <p className="text-gray-400 text-sm md:text-lg">Discover products across our top collections</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handlePrev}
                        // Softened button backgrounds
                        className="p-3 rounded-full bg-white/3 border border-white/5 text-white hover:bg-[#2563eb] hover:border-[#2563eb] transition-all duration-300 group"
                    >
                        <LuChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-3 rounded-full bg-white/3 border border-white/5 text-white hover:bg-[#2563eb] hover:border-[#2563eb] transition-all duration-300 group"
                    >
                        <LuChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            <div className='relative overflow-hidden py-4 min-h-65'>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={startIndex}
                        initial={{ opacity: 0, x: 80 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -80 }}
                        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                        className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 w-full'
                    >
                        {categories.slice(startIndex, startIndex + itemsPerPage).map((item, index) => (
                            <motion.div
                                key={`${startIndex}-${index}`}
                                whileHover={{ y: -6, scale: 1.02 }}
                                whileTap={{ scale: 0.96 }}
                                // Changed background to a seamless solid #08080a and softened the borders significantly
                                className='relative group flex flex-col items-center justify-center h-45 md:h-55 bg-[#08080a] border border-white/3 rounded-4xl text-white transition-all duration-500 hover:border-white/8 hover:shadow-[0_15px_40px_-15px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer w-full'
                            >
                                {/* Glowing Aura Background - Reduced opacity slightly to blend better */}
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-80 bg-linear-to-br ${item.color} transition-opacity duration-700 blur-3xl`} />

                                <div className='relative z-10 flex flex-col items-center gap-4 w-full px-4'>
                                    {/* Icon Container - Made more subtle */}
                                    <div className='w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/2 border border-white/4 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-white/5 transition-all duration-500 ease-out'>
                                        <span className='text-3xl md:text-4xl drop-shadow-md'>{item.icon}</span>
                                    </div>
                                    <p className='text-sm md:text-base font-medium tracking-wide text-center text-gray-500 group-hover:text-white transition-colors duration-300 truncate w-full'>
                                        {item.label}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Progress Indicator */}
                <div className="absolute bottom-0 left-0 w-full flex justify-center gap-2 mt-4">
                    {Array.from({ length: Math.ceil(categories.length / itemsPerPage) }).map((_, idx) => (
                        <div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-500 ${Math.floor(startIndex / itemsPerPage) === idx
                                ? "w-8 bg-[#3b82f6]"
                                : "w-2 bg-white/10"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    )
}

export default CategorySlider