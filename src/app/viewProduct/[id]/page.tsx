'use client'

import UseGetAllProductsData from '@/hooks/UseGetAllProductsData'
import { IProduct } from '@/model/product.model'
import { RootState } from '@/redux/store'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

const viewProduct = () => {

  const params = useParams()
  const productId = params.id as string
  UseGetAllProductsData()
 const products = useSelector(
  (state: RootState) =>
    state.vendor.allProdutctsData?.product || []
)

const product: IProduct | undefined =
  products.find(
    (p:IProduct)=>
      String(p._id) === String(productId)
  )
  // console.log(product)
  const images : string[] = [
    product?.image1,
    product?.image2,
    product?.image3,
    product?.image4
  ].filter((img) : img is string => Boolean(img))

  const [activeImage, setActiveImage] = useState(0)

  return (
    <div className='min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 px-4 py-10'>
      <div className='max-w-6xl mx-auto'>
        <div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
            {/* Left Top */}
            <div className='flex flex-col lg:flex-row gap-4'>
              <div className='relative w-full lg:w-112.5 h-105 bg-black rounded-lg overflow-hidden flex items-center justify-center border border-white/10'>
               {images.length > 0 && images[activeImage] && <Image src={images[activeImage]} alt={product?.title?? "product Image"} fill className='object-contain' />}
              </div>
              <div className='flex flex-row lg:flex-col gap-3 justify-center'>
                {images.map((img , i) => (
                  <div key={i} className={`relative w-20 h-20 border rounded cursor-pointer overflow-hidden flex items-center justify-center hover:scale-[110%] transition-all ${
                    activeImage ===i ? "border-blue-600" : "border-white/20"
                  }`}>

                  </div>
                ))}
              </div>
            </div>
            {/* Right Bottom */}
            <div></div>
          </div>

          <div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default viewProduct
