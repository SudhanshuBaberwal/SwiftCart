'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { motion } from 'motion/react'
import {
  LuPackageOpen, LuPlus, LuFileDigit,
  LuPower, LuPowerOff,
  LuClock, LuCircleAlert,
} from 'react-icons/lu'
import { LucideAlertCircle } from 'lucide-react'
import UseGetCurrentUser from '@/hooks/UseGetCurrentUser'
import UseGetAllProductsData from '@/hooks/UseGetAllProductsData'

const VendorProduct = () => {
  UseGetCurrentUser()
  UseGetAllProductsData()
  
  const router = useRouter()

  const currentUser = useSelector((state: RootState) => state.user.userData)
  console.log(currentUser)

  const allProductsData = useSelector((state: RootState) => state.vendor.allProdutctsData)
  console.log(allProductsData[0])

  const products = Array.isArray(allProductsData) ? allProductsData : allProductsData?.product || []

  const myProducts = products.filter((p : any) => {
    if (!p.vendor) return false;
    return String(p.vendor?._id || p.vendor) === String(currentUser?._id)
  })
  // console.log(currentUser?._id)
  // console.log(allProductsData.length)
  // const myProducts = currentUser?._id && allProductsData.length > 0 ?

  //   allProductsData.filter((p: any) => p.vendor === currentUser._id || p.vendor?._id === currentUser?._id) : []

  //   console.log(myProducts)


  // Helper for status colors
  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: <LuCircleAlert size={14} /> };
      case 'pending': return { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: <LuClock size={14} /> };
      case 'rejected': return { color: 'text-rose-400', bg: 'bg-rose-400/10', border: 'border-rose-400/20', icon: <LucideAlertCircle size={14} /> };
      default: return { color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', icon: <LuClock size={14} /> };
    }
  }

  return (
    <div className='w-full min-h-screen bg-[#030305] text-white p-4 sm:p-8 pt-24 pb-20'>

      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/4 w-[50%] h-[50%] bg-violet-600/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* --- HEADER --- */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent'>
              My Products
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage your inventory, pricing, and product status.</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/addVendorProduct")}
            className='bg-linear-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all w-full sm:w-auto justify-center'
          >
            <LuPlus size={18} /> Add Product
          </motion.button>
        </div>

        {/* --- EMPTY STATE --- */}
        {myProducts.length === 0 ? (
          <div className="bg-[#0a0a0c] border border-white/5 rounded-3xl p-16 text-center flex flex-col items-center justify-center shadow-xl">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
              <LuPackageOpen size={36} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-200 mb-2">No products yet</h3>
            <p className="text-sm text-gray-500 max-w-sm mb-6">You haven't added any products to your store. Click the button above to get started.</p>
          </div>
        ) : (
          <>
            {/* --- DESKTOP TABLE VIEW (Hidden on Mobile) --- */}
            <div className='hidden md:block w-full overflow-hidden bg-[#0a0a0c] border border-white/5 rounded-2xl shadow-2xl'>
              <table className='w-full text-left border-collapse'>
                <thead className='bg-[#030305] border-b border-white/5'>
                  <tr className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                    <th className='p-5 rounded-tl-2xl'>Product</th>
                    <th className='p-5'>Pricing & Stock</th>
                    <th className='p-5'>Verification</th>
                    <th className='p-5'>Visibility</th>
                    <th className='p-5 text-right rounded-tr-2xl'>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {myProducts.map((p: any, index: number) => {
                    const status = getStatusConfig(p.verificationStatus);
                    return (
                      <tr className='hover:bg-white/2 transition-colors group' key={index}>

                        {/* Image & Title */}
                        <td className='p-5'>
                          <div className="flex items-center gap-4">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-white/10 bg-[#030305] shrink-0">
                              <Image src={p?.image1 || '/placeholder.png'} alt={p?.title} fill className='object-cover' />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-200 line-clamp-1">{p?.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{p?.category || 'General'}</p>
                            </div>
                          </div>
                        </td>

                        {/* Pricing */}
                        <td className='p-5'>
                          <p className="font-semibold text-gray-200">₹{p?.price}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{p?.stock} in stock</p>
                        </td>

                        {/* Verification Status */}
                        <td className='p-5'>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.bg} ${status.color} ${status.border}`}>
                            {status.icon}
                            <span className="capitalize">{p.verificationStatus || 'Pending'}</span>
                          </span>
                        </td>

                        {/* Visibility / Active Status */}
                        <td className='p-5'>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${p.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-600"}`} />
                            <span className={`text-sm ${p.isActive ? "text-gray-300" : "text-gray-500"}`}>
                              {p.isActive ? "Active" : "Hidden"}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className='p-5 text-right'>
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => router.push(`/editVendorProduct/${p._id}`)}
                              className='p-2 rounded-lg bg-white/5 hover:bg-violet-600/20 text-gray-400 hover:text-violet-400 transition-colors'
                              title="Edit Product"
                            >
                              <LuFileDigit size={18} />
                            </button>
                            <button
                              disabled={p.verificationStatus !== "approved"}
                              className={`p-2 rounded-lg transition-colors ${p.verificationStatus === "approved"
                                ? p.isActive
                                  ? 'bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400'
                                  : 'bg-white/5 hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-400'
                                : 'bg-white/5 opacity-50 cursor-not-allowed text-gray-600'
                                }`}
                              title={p.isActive ? "Disable Product" : "Enable Product"}
                            >
                              {p.isActive ? <LuPowerOff size={18} /> : <LuPower size={18} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* --- MOBILE CARD VIEW (Hidden on Desktop) --- */}
            <div className="md:hidden space-y-4">
              {myProducts.map((p: any, index: number) => {
                const status = getStatusConfig(p.verificationStatus);
                return (
                  <div key={index} className="bg-[#0a0a0c] border border-white/5 rounded-2xl p-4 flex flex-col gap-4 shadow-lg">
                    {/* Top Row: Image & Info */}
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-[#030305] shrink-0">
                        <Image src={p?.image1 || '/placeholder.png'} alt={p?.title} fill className='object-cover' />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-200 line-clamp-2 text-sm leading-tight">{p?.title}</p>
                        <p className="font-semibold text-violet-400 mt-1">₹{p?.price}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{p?.stock} units left</p>
                      </div>
                    </div>

                    {/* Middle Row: Badges */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${status.bg} ${status.color} ${status.border}`}>
                        {status.icon}
                        <span className="capitalize">{p.verificationStatus || 'Pending'}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${p.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-gray-600"}`} />
                        <span className={`text-xs ${p.isActive ? "text-gray-300" : "text-gray-500"}`}>
                          {p.isActive ? "Active" : "Hidden"}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/editVendorProduct/${p._id}`)}
                        className='flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors'
                      >
                        <LuFileDigit size={16} /> Edit
                      </button>
                      <button
                        disabled={p.verificationStatus !== "approved"}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium transition-colors ${p.verificationStatus === "approved"
                          ? p.isActive
                            ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          : 'bg-white/5 opacity-50 cursor-not-allowed text-gray-500'
                          }`}
                      >
                        {p.isActive ? <><LuPowerOff size={16} /> Disable</> : <><LuPower size={16} /> Enable</>}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VendorProduct
