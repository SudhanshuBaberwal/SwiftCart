'use client'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { LuArrowRight } from 'react-icons/lu'

const Slider = () => {
  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
      title: "RUN ON AIR",
      subtitle: "DO IT NOW",
      description: "Next-Gen Running Shoes",
      button: "DISCOVER"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
      title: "STYLE & COMFORT",
      subtitle: "NEW COLLECTION",
      description: "Women's Autumn Fashion",
      button: "EXPLORE"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2080&auto=format&fit=crop",
      title: "STEP INTO POWER",
      subtitle: "FEEL THE SPEED",
      description: "Smart Gadgets Ecosystem",
      button: "SHOP NOW"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=2188&auto=format&fit=crop",
      title: "PURE SOUND",
      subtitle: "HIGH FIDELITY",
      description: "Noise Cancelling Audio",
      button: "LISTEN NOW"
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop",
      title: "TIMELESS ELEGANCE",
      subtitle: "LUXURY",
      description: "Exclusive Timepieces",
      button: "SHOP LUXURY"
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=2070&auto=format&fit=crop",
      title: "WORK IN ZEN",
      subtitle: "MINIMALIST",
      description: "Premium Desk Setup",
      button: "UPGRADE"
    }
  ]

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isHovered, slides.length])

  return (
    <div
      // Set to exactly h-screen and removed all borders/margins
      className='relative w-full h-screen overflow-hidden bg-[#030305] text-white'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
          className='absolute inset-0 flex'
        >
          {/* Background Image */}
          <Image
            src={slides[current].image}
            alt={slides[current].title}
            fill
            priority
            className='object-cover opacity-80'
          />

          {/* Gradient Overlay */}
          <div className='absolute inset-0 bg-linear-to-r from-[#030305] via-[#030305]/80 to-transparent z-10' />

          {/* Text Content */}
          <div className='absolute inset-0 z-20 flex flex-col items-start justify-center px-8 md:px-20 lg:px-32 max-w-5xl'>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className='mb-6'
            >
              <span className='px-4 py-1.5 text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full backdrop-blur-md'>
                {slides[current].subtitle}
              </span>
            </motion.div>

            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className='text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 tracking-tight leading-[1.05] text-white drop-shadow-2xl'
            >
              {slides[current].description}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className='text-lg md:text-2xl text-gray-300 mb-10 font-medium tracking-wide drop-shadow-lg'
            >
              {slides[current].title}
            </motion.p>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='group relative flex items-center gap-3 px-8 py-4 rounded-2xl overflow-hidden font-semibold text-[16px] text-white transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)]'
            >
              <div className="absolute inset-0 bg-linear-to-r from-[#2563eb] to-[#3b82f6] transition-transform duration-300 group-hover:scale-105" />
              <span className="relative z-10">{slides[current].button}</span>
              <LuArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" size={20} />
            </motion.button>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Thumbnail Navigation */}
      <div className='absolute bottom-8 right-8 flex flex-col items-end gap-4 z-30'>
        <div className="flex gap-2 sm:gap-3 bg-[#0c0c0e]/80 backdrop-blur-xl p-2 sm:p-3 rounded-2xl border border-white/5 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8)] max-w-full overflow-x-auto no-scrollbar">
          {slides.map((slide, index) => (
            <motion.div
              key={slide.id}
              whileHover={{ scale: 1.05, y: -2 }}
              onClick={() => setCurrent(index)}
              className={`relative shrink-0 w-16 h-12 sm:w-20 sm:h-14 md:w-28 md:h-16 lg:w-32 lg:h-20 cursor-pointer rounded-xl overflow-hidden transition-all duration-500 ${index === current
                  ? "border border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)] opacity-100"
                  : "border border-white/10 opacity-50 hover:opacity-100"
                }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="(max-width: 768px) 96px, 128px"
                className={`object-cover transition-transform duration-700 ${index === current ? 'scale-110' : 'scale-100'}`}
              />

              {/* Active Progress Bar */}
              {index === current && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5000 / 1000, ease: "linear" }}
                  className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-[#2563eb] to-[#3b82f6] z-10"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Slider