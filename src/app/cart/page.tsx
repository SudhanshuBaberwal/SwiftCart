'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'
import { useRouter } from 'next/navigation'

const CartPage = () => {
    const [cart, setCart] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [actionId, setActionId] = useState<string | null>(null)
    const router = useRouter()

    // Fetch live cart dataset on mount
    const getCart = async () => {
        try {
            setLoading(true)
            const result = await axios.get("/api/user/cart/get")
            setCart(result.data.cart || [])
        } catch (error) {
            console.error("Error fetching cart data:", error)
            toast.error("Failed to load your shopping cart.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getCart()
    }, [])

    const updateQuantity = async (productId: string, currentQty: number, change: number) => {
        const newQty = currentQty + change
        if (newQty < 1) return

        try {
            setActionId(productId)
            await axios.post("/api/user/cart/update", { productId, quantity: newQty })
            // Locally update the UI state instantly for premium responsiveness
            setCart(prev => prev.map(item =>
                item.product._id === productId ? { ...item, quantity: newQty } : item
            ))
        } catch (error) {
            console.error("Error changing quantity:", error)
            toast.error("Could not update item quantity.")
        } finally {
            setActionId(null)
        }
    }

    // Handler for removing a product frame completely
    const handleRemoveItem = async (productId: string) => {
        try {
            setActionId(productId)
            await axios.post("/api/user/cart/remove", { productId })
            setCart(prev => prev.filter(item => item.product._id !== productId))
            toast.success("Item removed from cart")
        } catch (error) {
            console.error("Error removing item:", error)
            toast.error("Failed to remove item.")
        } finally {
            setActionId(null)
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#09090b] text-gray-100 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-4xl mx-auto space-y-6">

                {/* Header Title Metadata */}
                <div className="border-b border-white/[0.06] pb-4 mb-2">
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">Your Shopping Cart</h1>
                    <p className="text-xs text-gray-400 mt-1">Review items inside your bag layout before checking out safely.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <ClipLoader color="#3b82f6" size={32} />
                    </div>
                ) : cart.length > 0 ? (
                    <div className="space-y-4">
                        {cart.map((item, index) => {
                            const product = item?.product || {}
                            const currentProductId = product?._id || index.toString()

                            return (
                                <div
                                    key={currentProductId}
                                    className="bg-[#121214] border border-white/[0.04] p-5 rounded-xl flex gap-5 sm:gap-6 items-start transition-all duration-300 hover:border-white/[0.08]"
                                >
                                    {/* LEFT: Premium White Cutout Frame Image Box */}
                                    <div className="relative w-24 h-32 sm:w-28 sm:h-36 bg-white rounded-lg overflow-hidden flex items-center justify-center p-2 shrink-0 shadow-inner">
                                        <Image
                                            src={product.image1 || '/placeholder.png'}
                                            alt={product.title || 'Product asset preview'}
                                            fill
                                            className="object-contain p-1"
                                            sizes="(max-width: 640px) 96px, 112px"
                                        />
                                    </div>

                                    {/* RIGHT: High-Fidelity Details & Control Interface */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-base sm:text-lg text-white leading-snug tracking-tight truncate max-w-xl">
                                                {product.title || 'Product Title'}
                                            </h3>
                                            <p className="text-emerald-400 font-bold text-base sm:text-lg tracking-tight">
                                                ₹ {product.price?.toLocaleString('en-IN') || '0'}
                                            </p>
                                        </div>

                                        {/* Incremental Counter Control Row */}
                                        <div className="flex items-center gap-1 mt-3">
                                            <button
                                                onClick={() => updateQuantity(currentProductId, item.quantity, -1)}
                                                disabled={item.quantity <= 1 || actionId === currentProductId}
                                                className="w-7 h-7 flex items-center justify-center rounded border border-neutral-700 bg-neutral-900/40 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all font-medium text-sm"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center text-sm font-semibold text-white">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => updateQuantity(currentProductId, item.quantity, 1)}
                                                disabled={actionId === currentProductId}
                                                className="w-7 h-7 flex items-center justify-center rounded border border-neutral-700 bg-neutral-900/40 text-neutral-400 hover:text-white hover:bg-neutral-800 disabled:opacity-30 transition-all font-medium text-sm"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* Actions Footer Assembly */}
                                        <div className="mt-4 pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
                                            <button
                                                onClick={() => router.push(`/checkout/${item.product._id}`)}
                                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-5 py-2.5 rounded-lg shadow-md hover:shadow-blue-600/10 transition-all duration-200 uppercase tracking-wider w-fit">
                                                Checkout this product
                                            </button>
                                            <button
                                                onClick={() => handleRemoveItem(currentProductId)}
                                                disabled={actionId === currentProductId}
                                                className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors uppercase tracking-wider px-1 py-2 sm:py-0 w-fit text-left disabled:opacity-40"
                                            >
                                                Remove
                                            </button>

                                            <div className='font-bold'>
                                                {item.product.price * item.quantity}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    /* Custom Empty Bag Feedback View Slate */
                    <div className="w-full text-center py-20 bg-[#121214]/50 border border-dashed border-white/[0.06] rounded-2xl">
                        <h3 className="text-lg font-bold text-gray-300">Your cart is currently empty</h3>
                        <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                            Explore catalog items to pack this section module layer full of premium deals!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CartPage