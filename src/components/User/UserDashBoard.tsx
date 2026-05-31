'use client'
import React from 'react'
import Slider from './Slider'
import CategorySlider from './CategorySlider'
import ProductCardPage from './ProductCardPage'
import ShopPage from '@/app/shop/page'

const UserDashBoard = () => {
  return (
    // Removed pb-12 and gap-12. Kept it clean.
    <div className="w-full min-h-screen bg-[#050505] text-white flex flex-col">
      
      {/* Hero Slider Section */}
      <section className="w-full">
        <Slider />
        <CategorySlider />
        <ProductCardPage/>
        <ShopPage />
      </section>
      
    </div>
  )
}

export default UserDashBoard