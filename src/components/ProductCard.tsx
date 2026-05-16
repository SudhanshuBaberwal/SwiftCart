import { IProduct } from '@/model/product.model'
import React from 'react'

const ProductCard = ({ product }: { product: IProduct }) => {

    const Images = [
        product.image1,
        product.image2,
        product.image3,
        product.image4,
    ].filter(Boolean)

    return (
        <div className='bg-white rounded-xl shadow-md overflow-hidden border hover:shadow-xl transition cursor-pointer'>
            <div className='relative w-full h-55 bg-gray-100 overflow-hidden flex items-center justify-center'> 

            </div>
            {/* ProductData */}
            <div className='p-4 space-y-2'>

            </div>
        </div>
    )
}

export default ProductCard
