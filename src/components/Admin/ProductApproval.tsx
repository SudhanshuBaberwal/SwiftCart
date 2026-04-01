'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'motion/react'
import { ClipLoader } from 'react-spinners'
import { AppDispatch, RootState } from '@/redux/store'

// NOTE: Make sure to export a 'setAllProductsData' action from your vendorSlice if you haven't already!
// import { setAllProductsData } from '@/redux/vendorSlice' 

import { IProduct } from '@/model/product.model'
import UseGetAllProductsData from '@/hooks/UseGetAllProductsData'

import {
  LuBox, LuTruck, LuCheck, LuCircle, LuInbox,
  LuArrowLeft, LuLoaderCircle
} from 'react-icons/lu'
import { setAllProductsData } from '@/redux/vendorSlice'

const ProductApproval = () => {
  UseGetAllProductsData()
  const dispatch = useDispatch<AppDispatch>()

  // State
  const allProductsData: IProduct[] = useSelector((state: RootState) => state.vendor.allProdutctsData)

  const products: IProduct[] = Array.isArray(allProductsData) ? allProductsData : allProductsData?.product || []

  const pendingProducts = products.filter(
    (p: any) => p.verificationStatus === "pending"
  )

  const [SelectedProduct, setSelectedProduct] = useState<IProduct | null>(null)
  const [loading, setLoading] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)

  // Rejection State
  const [rejectedModel, setRejectedModel] = useState(false)
  const [rejectedReason, setRejectedReason] = useState("")

  // --- Handlers ---
  const closeModel = () => {
    setRejectedModel(false)
    setRejectedReason("")
    setTimeout(() => {
      setSelectedProduct(null)
    }, 200) // Wait for animation before clearing data
  }

  const openRejectReasonArea = () => {
    setRejectedModel(true)
    setRejectedReason("")
  }

  const handleApproved = async () => {
    if (!SelectedProduct) return
    setLoading(true)
    try {
      await axios.post("/api/admin/update-product-status", { productId: SelectedProduct._id, status: "approved" })

      // const updated = allProductsData.map((p) =>
      //   p._id === SelectedProduct._id ? { ...p, verificationStatus: "approved" } : p
      // )
      const updated = allProductsData.filter((v) => v._id !== SelectedProduct._id)
      // dispatch({ type: 'vendor/setAllProductsData', payload: updated }) 
      dispatch(setAllProductsData(updated))
      setSelectedProduct(null)

      toast.success(`${SelectedProduct.title} Approved Successfully!`, {
        style: { background: '#1c1c1e', color: '#10b981', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' },
        iconTheme: { primary: '#10b981', secondary: '#fff' }
      });

      closeModel()
    } catch (error) {
      console.error(error)
      toast.error("Failed to approve product.", {
        style: { background: '#1c1c1e', color: '#ef4444', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }
      });
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!SelectedProduct) return
    if (!rejectedReason.trim()) {
      toast.error("Please provide a reason for rejection.", {
        style: { background: '#1c1c1e', color: '#ef4444', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }
      });
      return;
    }

    setRejectLoading(true)
    try {
      await axios.post("/api/admin/update-product-status", {
        productId: SelectedProduct._id,
        status: "rejected",
        rejectReason: rejectedReason
      })

      const updated = allProductsData.map((p) =>
        p._id === SelectedProduct._id ? { ...p, verificationStatus: "rejected" } : p
      )
      dispatch({ type: 'vendor/setAllProductsData', payload: updated })

      toast.success(`${SelectedProduct.title} has been rejected.`, {
        style: { background: '#1c1c1e', color: '#ef4444', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' },
        iconTheme: { primary: '#ef4444', secondary: '#fff' }
      });

      closeModel()
    } catch (error) {
      console.error(error)
      toast.error("Failed to reject product.", {
        style: { background: '#1c1c1e', color: '#ef4444', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }
      });
    } finally {
      setRejectLoading(false)
    }
  }

  return (
    // Added pt-24 (padding-top) so the content doesn't hide behind your fixed top navbar
    <div className='relative w-full min-h-screen px-4 sm:px-6 lg:px-10 pb-12 pt-24 text-white font-sans overflow-hidden bg-[#030305]'>
      <Toaster position="bottom-center" />

      {/* Ambient Background Glows */}
      <div className="fixed top-0 left-1/4 w-[40%] h-[40%] bg-violet-600/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="mb-8 relative z-10 max-w-7xl mx-auto">
        <h1 className='text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight'>
          Product Approvals
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">Review and manage pending items submitted by vendors.</p>
      </div>

      {/* --- Desktop Table --- */}
      <div className='hidden md:block relative z-10 w-full max-w-7xl mx-auto overflow-hidden bg-[#0a0a0c] border border-white/5 rounded-2xl shadow-2xl'>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-[#0f0f13] border-b border-white/5'>
            <tr className="text-[11px] uppercase tracking-widest text-gray-500 font-semibold">
              <th className='p-5 pl-6 rounded-tl-2xl'>Product</th>
              <th className='p-5'>Price</th>
              <th className='p-5'>Category</th>
              <th className='p-5'>Status</th>
              <th className='p-5 pr-6 text-right rounded-tr-2xl'>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pendingProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className='p-20 text-center'>
                  <div className="flex flex-col items-center justify-center text-gray-500 gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                      <LuInbox size={36} className="text-gray-400 opacity-50" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-300">All caught up!</p>
                      <p className="text-sm mt-1">No pending product requests at the moment.</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              pendingProducts.map((product, index) => (
                <tr className='hover:bg-white/[0.03] transition-colors group' key={index}>
                  <td className='p-5 pl-6'>
                    <div className="flex items-center gap-4">
                      {/* Product Image Box */}
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center p-1 shrink-0">
                        <Image
                          src={product.image1 || '/placeholder.png'}
                          fill
                          className='object-contain rounded-lg'
                          alt={product.title}
                        />
                      </div>
                      <span className="font-medium text-gray-200 line-clamp-2 max-w-[250px] leading-snug">{product.title}</span>
                    </div>
                  </td>
                  <td className='p-5 font-semibold text-gray-300'>₹{product.price}</td>
                  <td className='p-5'>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-gray-400 border border-white/5 inline-block w-max">
                      {product.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className='p-5'>
                    <span className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 w-max'>
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                      {product.verificationStatus}
                    </span>
                  </td>
                  <td className='p-5 pr-6 text-right'>
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className='px-5 py-2 rounded-xl bg-white/5 hover:bg-violet-600/20 border border-white/5 hover:border-violet-500/50 text-gray-300 hover:text-violet-300 text-sm font-medium transition-all duration-300 shadow-sm'
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Mobile Cards --- */}
      <div className='md:hidden flex flex-col gap-4 relative z-10 max-w-7xl mx-auto'>
        {pendingProducts.length === 0 ? (
          <div className='bg-[#0a0a0c] border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center text-gray-500 mt-4 shadow-xl'>
            <LuInbox size={40} className="mb-4 opacity-50" />
            <p className="text-lg font-medium text-gray-300">All caught up!</p>
            <p className="text-sm mt-1">No pending product requests.</p>
          </div>
        ) : (
          pendingProducts.map((product, index) => (
            <div className='bg-[#0a0a0c] border border-white/5 rounded-2xl p-5 space-y-4 shadow-xl' key={index}>
              <div className='flex gap-4'>
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-white/5 p-1 shrink-0">
                  <Image src={product.image1 || '/placeholder.png'} fill className='object-contain rounded-lg' alt={product.title} />
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <h3 className='font-bold text-gray-200 line-clamp-2 text-sm leading-tight'>{product.title}</h3>
                  <p className="font-semibold text-violet-400 mt-1.5">₹{product.price}</p>
                  <p className="text-xs text-gray-500 mt-1">{product.category}</p>
                </div>
              </div>
              <button
                className='w-full bg-white/5 hover:bg-violet-600/20 border border-white/5 hover:border-violet-500/50 text-gray-300 hover:text-violet-300 text-sm py-3 rounded-xl transition-all duration-300 font-medium'
                onClick={() => setSelectedProduct(product)}
              >
                Review Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* --- Interactive Review Modal --- */}
      <AnimatePresence>
        {SelectedProduct && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className='bg-[#0a0a0c] border border-white/10 shadow-2xl rounded-[2rem] w-full max-w-lg overflow-hidden relative flex flex-col max-h-[90vh]'
            >
              <div className={`absolute top-0 inset-x-0 h-32 pointer-events-none transition-colors duration-500 ${rejectedModel ? 'bg-gradient-to-b from-red-600/10 to-transparent' : 'bg-gradient-to-b from-violet-600/10 to-transparent'}`} />

              <div className="p-6 sm:p-8 relative z-10 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">

                  {/* VIEW 2: REJECTION REASON FORM */}
                  {rejectedModel ? (
                    <motion.div key="reject-view" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="flex flex-col h-full">
                      <button onClick={() => setRejectedModel(false)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6 w-fit bg-white/5 px-3 py-1.5 rounded-lg">
                        <LuArrowLeft size={16} /> Back
                      </button>

                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2.5 bg-red-500/10 rounded-xl text-red-400"><LuLoaderCircle size={20} /></div>
                        <h3 className='text-2xl font-bold text-white'>Reject Product</h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-6">Explain why this product cannot be approved. This will be sent to the vendor.</p>

                      <textarea
                        value={rejectedReason} onChange={(e) => setRejectedReason(e.target.value)}
                        placeholder="e.g., Image quality is too low, description violates policy..."
                        className="w-full bg-[#030305] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all resize-none min-h-[140px]"
                      />

                      <div className='flex gap-3 mt-6'>
                        <button disabled={rejectLoading || !rejectedReason.trim()} onClick={handleReject} className='flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]'>
                          {rejectLoading ? <ClipLoader size={18} color='#fff' /> : 'Confirm Rejection'}
                        </button>
                      </div>
                    </motion.div>
                  ) : (

                    /* VIEW 1: PRODUCT DETAILS */
                    <motion.div key="details-view" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                      <h3 className='text-xl sm:text-2xl font-bold mb-6 text-white'>Product Review</h3>

                      {/* Cover Image & Basic Info */}
                      <div className="flex gap-5 mb-6">
                        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-white/5 p-2">
                          <Image src={SelectedProduct.image1 || '/placeholder.png'} fill className='object-contain rounded-xl' alt={SelectedProduct.title} />
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="font-bold text-gray-200 text-lg line-clamp-2 leading-tight">{SelectedProduct.title}</h4>
                          <p className="text-violet-400 font-bold text-xl mt-2">₹{SelectedProduct.price}</p>
                          <span className="inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400 mt-2 w-max">
                            {SelectedProduct.category}
                          </span>
                        </div>
                      </div>

                      {/* Detailed Grid */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex flex-col p-4 rounded-2xl bg-[#030305] border border-white/5">
                          <span className="text-gray-500 text-xs flex items-center gap-1.5 mb-1.5"><LuBox /> Stock Available</span>
                          <span className="font-medium text-gray-200">{SelectedProduct.stock} units</span>
                        </div>

                        <div className="flex flex-col p-4 rounded-2xl bg-[#030305] border border-white/5">
                          <span className="text-gray-500 text-xs flex items-center gap-1.5 mb-1.5"><LuTruck /> Shipping</span>
                          <span className="font-medium text-gray-200">{SelectedProduct.freeDelivery ? 'Free Delivery' : 'Paid Delivery'}</span>
                        </div>
                      </div>

                      {/* Description Area */}
                      <div className="mt-3 p-4 rounded-2xl bg-[#030305] border border-white/5">
                        <span className="text-gray-500 text-xs mb-2 block uppercase tracking-wider font-bold">Description</span>
                        <p className="text-sm text-gray-300 leading-relaxed max-h-32 overflow-y-auto custom-scrollbar pr-2">
                          {SelectedProduct.description || 'No description provided for this product.'}
                        </p>
                      </div>

                      {/* Modal Actions */}
                      <div className='flex flex-col sm:flex-row gap-3 mt-8'>
                        <button disabled={loading || rejectLoading} onClick={handleApproved} className='flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 py-3.5 rounded-xl text-sm font-semibold transition-all'>
                          {loading ? <ClipLoader size={18} color='#10b981' /> : <><LuCheck size={18} /> Approve Product</>}
                        </button>

                        <button disabled={loading || rejectLoading} onClick={openRejectReasonArea} className='flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-3.5 rounded-xl text-sm font-semibold transition-all'>
                          <LuCircle size={18} /> Reject
                        </button>
                      </div>

                      <button onClick={closeModel} disabled={loading || rejectLoading} className='w-full mt-3 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white py-3.5 rounded-xl text-sm font-medium transition-colors'>
                        Cancel & Close
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductApproval