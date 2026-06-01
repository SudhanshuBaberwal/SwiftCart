'use client'

import UseGetAllVendors from '@/hooks/UseGetAllVendors'
import { IUser } from '@/model/user.model'
import { AppDispatch, RootState } from '@/redux/store'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  LuStore, LuMapPin, LuPhone, LuInbox, LuX, 
   LuCircle, LuFileBadge, LuShoppingBag 
} from 'react-icons/lu'
import Image from 'next/image'
import { CheckCircle2 } from "lucide-react"

const VendorDetails = () => {
  UseGetAllVendors()
  const dispatch = useDispatch<AppDispatch>()

  const allVendorData: IUser[] = useSelector((state: RootState) => state.vendor.allVendorData)
  
  // Filtering out approved vendors from the vendor state list 
  const ApprovedVendors = Array.isArray(allVendorData) 
    ? allVendorData.filter((v) => v.verificationStatus === "approved") 
    : []

  const [selectedVendor, setSelectedVendor] = useState<IUser | null>(null)

  return (
    <div className='relative w-full min-h-screen px-4 sm:px-6 lg:px-10 py-10 text-zinc-100 font-sans overflow-x-hidden bg-[#09090b] antialiased selection:bg-violet-500/30'>
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[400px] bg-violet-600/[0.04] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/[0.02] blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Header Panel */}
      <div className="mb-10 relative z-10 max-w-7xl mx-auto space-y-1">
        <h1 className='text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500 tracking-tight'>
          Vendor Details
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm font-medium">Review operational logs, listed parameters, and inventory catalogs of active verified stores.</p>
      </div>

      {/* --- Desktop Table Framework (Visible md viewport and up) --- */}
      <div className='hidden md:block relative z-10 w-full overflow-hidden bg-zinc-900/20 border border-zinc-800/80 rounded-2xl shadow-2xl backdrop-blur-xl max-w-7xl mx-auto'>
        <div className="overflow-x-auto w-full">
          <table className='w-full text-left border-collapse min-w-[950px]'>
            <thead className='bg-zinc-900/60 border-b border-zinc-800'>
              <tr className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                <th className='p-5 pl-6'>Vendor Profile</th>
                <th className='p-5'>Shop Name</th>
                <th className='p-5'>Hub Location</th>
                <th className='p-5'>Contact Channel</th>
                <th className='p-5 text-center'>Status</th>
                <th className='p-5'>GSTIN Mapping</th>
                <th className='p-5 pr-6 text-right'>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40 text-xs font-medium text-zinc-300">
              {ApprovedVendors.length === 0 ? (
                <tr>
                  <td colSpan={7} className='p-20 text-center'>
                    <div className="flex flex-col items-center justify-center text-zinc-500 gap-3 max-w-md mx-auto">
                      <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-1 text-zinc-600">
                        <LuInbox size={22} />
                      </div>
                      <p className="text-sm font-bold text-zinc-300">No active partner accounts</p>
                      <p className="text-xs text-zinc-500">There are currently no merchants registered with fully verified matching listings profiles.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                ApprovedVendors.map((vendor, index) => (
                  <tr className='hover:bg-zinc-900/40 transition-colors group' key={ index}>
                    <td className='p-4 pl-6'>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-violet-500/10 to-fuchsia-500/10 flex items-center justify-center border border-violet-500/20 text-violet-400 font-bold text-sm shadow-inner shrink-0">
                          {vendor?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-zinc-200 truncate max-w-[140px]">{vendor?.name}</span>
                      </div>
                    </td>
                    <td className='p-4 text-zinc-300 font-semibold'>
                      <div className="flex items-center gap-2 truncate max-w-[160px]">
                        <LuStore size={14} className="text-zinc-600 shrink-0" /> 
                        <span>{vendor?.shopName}</span>
                      </div>
                    </td>
                    <td className='p-4 text-zinc-400 max-w-xs truncate font-normal'>{vendor?.shopAddress || 'Global digital platform'}</td>
                    <td className='p-4 text-zinc-400 font-mono text-[11px]'>{vendor?.phone || '--'}</td>
                    <td className='p-4 text-center'>
                      <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-xs'>
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        {vendor?.verificationStatus}
                      </span>
                    </td>
                    <td className='p-4 font-mono text-zinc-400 text-[11px]'>{vendor?.gstNumber || 'Exempt / None'}</td>
                    <td className='p-4 pr-6 text-right'>
                      <button
                        onClick={() => setSelectedVendor(vendor)}
                        className='px-4 py-1.5 rounded-lg bg-zinc-900/60 hover:bg-violet-600 border border-zinc-800 hover:border-violet-500 text-xs font-bold transition-all duration-300 text-zinc-300 hover:text-white shadow-xs group-hover:border-zinc-700/60'
                      >
                        Inspect Inventory
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Mobile Cards Deck Layout (Visible below md viewports) --- */}
      <div className='md:hidden flex flex-col gap-4 relative z-10 max-w-xl mx-auto w-full'>
        {ApprovedVendors.length === 0 ? (
          <div className='bg-zinc-900/20 border border-dashed border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-center text-zinc-500'>
            <LuInbox size={32} className="mb-2 opacity-40 text-zinc-600" />
            <p className="text-sm font-bold text-zinc-300">No active partner accounts</p>
            <p className="text-xs mt-1 text-zinc-500">There are currently no merchants registered with matching profiles.</p>
          </div>
        ) : (
          ApprovedVendors.map((vendor, index) => (
            <div className='bg-zinc-900/30 border border-zinc-800/80 rounded-xl p-5 space-y-4 shadow-lg relative overflow-hidden' key={ index}>
              <div className='flex justify-between items-start gap-4 border-b border-zinc-800/60 pb-3.5'>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center border border-violet-500/20 text-violet-400 font-bold text-sm shrink-0 shadow-inner">
                    {vendor?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className='font-bold text-zinc-200 text-sm truncate'>{vendor?.name}</h3>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5 font-medium truncate">
                      <LuStore size={12} className="text-zinc-600" /> {vendor?.shopName}
                    </p>
                  </div>
                </div>
                <span className='px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0'>
                  {vendor.verificationStatus}
                </span>
              </div>
              <button
                className='w-full bg-zinc-900/80 hover:bg-violet-600 border border-zinc-800 text-zinc-300 hover:text-white text-xs py-2.5 rounded-lg transition-all duration-300 font-bold shadow-xs'
                onClick={() => setSelectedVendor(vendor)}
              >
                Inspect Inventory
              </button>
            </div>
          ))
        )}
      </div>

      {/* --- Interactive Layered Review Modal --- */}
      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          >
            <motion.div
              initial={{ scale: 0.96, y: 12, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 12, opacity: 0 }}
              transition={{ type: "spring", damping: 24, stiffness: 280 }}
              className='bg-[#0c0c0e] border border-zinc-800/80 shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden relative flex flex-col max-h-[85vh]'
            >
              {/* Decorative Subtle Header Color Flare Underlay */}
              <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-violet-600/[0.06] to-transparent pointer-events-none z-0" />

              {/* Modal Frame Fixed Top Area */}
              <div className="p-5 sm:p-6 border-b border-zinc-800/60 relative z-10 flex items-center justify-between bg-zinc-950/20">
                <div className="space-y-0.5 min-w-0">
                  <div className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-bold flex items-center gap-1">
                    <LuShoppingBag size={11} className="text-zinc-600" /> Catalog Manifest
                  </div>
                  <h3 className='text-lg font-black text-white tracking-tight truncate pr-2'>
                    Products of {selectedVendor.shopName}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedVendor(null)}
                  className="w-7 h-7 rounded-lg border border-zinc-800/80 bg-zinc-900/50 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-700 transition-colors shrink-0"
                >
                  <LuX size={14} />
                </button>
              </div>

              {/* Modal Scrollable Catalog Content Frame */}
              <div className="p-5 sm:p-6 overflow-y-auto relative z-10 flex-1 space-y-4 bg-zinc-950/10">
                {selectedVendor.vendorProducts && selectedVendor.vendorProducts.length > 0 ? (
                  <div className='space-y-3.5 pr-1'>
                    {selectedVendor.vendorProducts.map((p: any, i: number) => (
                      <div
                        className='bg-zinc-900/30 border border-zinc-800/60 rounded-xl p-4 flex flex-col space-y-3 shadow-inner relative overflow-hidden'
                        key={p._id || i}
                      >
                        <div className='flex gap-4.5 items-center min-w-0'>
                          <div className="relative w-14 h-14 rounded-lg bg-zinc-950 border border-zinc-800/80 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                            {p.image1 ? (
                              <Image src={p.image1} alt='Product image representation token' fill className='rounded-md object-contain p-1' />
                            ) : (
                              <LuStore size={18} className="text-zinc-700" />
                            )}
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <p className='font-bold text-zinc-200 text-sm truncate'>{p.title || 'Catalog Product Item'}</p>
                            <p className='text-xs font-mono font-bold text-emerald-400'>
                              {typeof p.price === 'number' || !isNaN(Number(p.price)) ? `₹${p.price}` : p.price}
                            </p>
                          </div>
                        </div>

                        {/* Specifications Metadata Block Grid */}
                        <div className='grid grid-cols-2 gap-x-4 gap-y-2 border-t border-zinc-800/40 pt-3 text-[11px] font-medium text-zinc-400'>
                          <div className="space-y-0.5 min-w-0">
                            <span className="text-zinc-600 block text-[9px] uppercase tracking-wider font-bold">Category</span>
                            <span className="text-zinc-300 font-semibold block truncate bg-zinc-900/40 border border-zinc-800/40 px-2 py-0.5 rounded w-fit max-w-full">{p.category || 'General'}</span>
                          </div>
                          
                          <div className="space-y-0.5">
                            <span className="text-zinc-600 block text-[9px] uppercase tracking-wider font-bold">Verification State</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold capitalize border ${
                              p.verificationStatus === "approved" 
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10" 
                                : p.verificationStatus === "pending" 
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/10" 
                                : "bg-red-500/10 text-red-400 border-red-500/10"
                            }`}>
                              {p.verificationStatus || 'Pending'}
                            </span>
                          </div>

                          <div className="space-y-0.5 col-span-2 min-w-0">
                            <span className="text-zinc-600 block text-[9px] uppercase tracking-wider font-bold">Description Mapping</span>
                            <p className="text-zinc-400 leading-relaxed font-normal bg-zinc-950/40 border border-zinc-800/30 p-2 rounded-lg text-xs line-clamp-3">
                              {p.description || 'No supplementary manifest descriptive notes attached to this product item asset parameters.'}
                            </p>
                          </div>

                          <div className="space-y-0.5 col-span-2 flex items-center justify-between bg-zinc-900/20 border border-zinc-800/40 px-2.5 py-1.5 rounded-lg mt-1">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider">Active Showroom Status</span>
                            <span className={`inline-flex items-center gap-1 font-bold text-[10px] uppercase tracking-wide ${p.isActive ? "text-emerald-400" : "text-zinc-500"}`}>
                              {p.isActive ? <CheckCircle2 size={12} /> : <LuCircle size={12} />}
                              {p.isActive ? "Live in Display" : "Hidden"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-zinc-900/10 border border-dashed border-zinc-800/80 rounded-xl">
                    <LuFileBadge size={22} className="text-zinc-700 mb-2 mx-auto" />
                    <p className='text-zinc-400 text-xs font-bold'>No Inventory Found</p>
                    <p className='text-zinc-600 text-[11px] mt-0.5 max-w-[200px] mx-auto leading-normal'>This verified brand has not synced catalog items with the hub.</p>
                  </div>
                )}
              </div>

              {/* Modal Fixed Footer Controls */}
              <div className="p-4 sm:p-5 bg-zinc-900/40 border-t border-zinc-800/60 relative z-10">
                <button
                  onClick={() => setSelectedVendor(null)}
                  className='w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white py-2 rounded-xl text-xs font-bold transition-colors border border-zinc-800/80 shadow-xs'
                >
                  Close Specification Portal
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VendorDetails