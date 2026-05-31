'use client'

import ProductCard from '@/components/ProductCard'
import UseGetAllProductsData from '@/hooks/UseGetAllProductsData'
import UseGetAllVendors from '@/hooks/UseGetAllVendors'
import { RootState } from '@/redux/store'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { 
  LuStore, 
  LuMapPin, 
  LuFileBadge, 
  LuLayers, 
  LuCircle, 
  LuArrowLeft, 
//   LuCheckCircle2,
  LuLayoutGrid,
  LuInfo
} from 'react-icons/lu'
import { CheckCircle2 } from "lucide-react";

const ShopDetails = () => {
    UseGetAllProductsData()
    UseGetAllVendors()
    const params = useParams()
    const router = useRouter()
    const vendorId = params.id as string

    const [activeTab, setActiveTab] = useState<'products' | 'about'>('products')

    const { allProdutctsData } = useSelector((state: RootState) => state.vendor)
    const { allVendorData } = useSelector((state: RootState) => state.vendor)

    const vendors = allVendorData || []
    const vendor = vendors.find((v: any) => String(v._id) === vendorId)

    if (!vendor) {
        return (
            <div className='min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white px-4 gap-3'>
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5 text-zinc-600">
                    <LuCircle size={24} />
                </div>
                <h1 className='text-lg font-bold tracking-tight'>Store Profile Missing</h1>
                <p className="text-xs text-zinc-500">The store profile could not be fetched or does not exist.</p>
            </div>
        )
    }

    const productsArray = allProdutctsData?.product || []
    const vendorProducts = Array.isArray(productsArray) 
        ? productsArray.filter((p: any) => String(p?.vendor?._id || p?.vendor) === String(vendor._id)) 
        : []

    return (
        <div className='min-h-screen bg-[#09090b] text-zinc-100 pb-24 antialiased selection:bg-blue-500/30 w-full overflow-x-hidden'>
            
            {/* AMBIENT BACKGROUND GLOWS */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-blue-600/10 via-purple-600/5 to-transparent blur-[120px] pointer-events-none z-0" />

            {/* TOP BAR NAVIGATION */}
            <div className="sticky top-0 z-50 bg-[#09090b]/70 backdrop-blur-md border-b border-zinc-800/50 w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <button 
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors group"
                    >
                        <LuArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" /> 
                        <span>Back to Marketplace</span>
                    </button>
                    <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-500">
                        <span>ID: {vendorId.substring(0, 8)}...</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 pt-8">
                
                {/* BRAND IDENTITY CARD */}
                <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 shadow-xl relative overflow-hidden"
                >
                    {/* Glass Overlay Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-transparent to-white/[0.03] pointer-events-none" />

                    {/* Minimalist Grid Logo Frame */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-inner flex items-center justify-center p-3 shrink-0 relative group">
                        {vendor?.image ? (
                            <Image 
                                src={vendor.image} 
                                alt={vendor.shopName || 'Brand Logo'} 
                                width={112}
                                height={112}
                                className="object-contain w-full h-full rounded-xl transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <LuStore size={36} className="text-zinc-700" />
                        )}
                    </div>

                    {/* Profile Information Block */}
                    <div className="flex-1 space-y-4 min-w-0 w-full">
                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2.5">
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white truncate">
                                    {vendor?.shopName}
                                </h1>
                                {vendor?.verificationStatus === 'approved' && (
                                    <span className="inline-flex items-center gap-1 self-center text-[10px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-full shadow-sm">
                                        <CheckCircle2 size={11} /> Authorized
                                    </span>
                                )}
                            </div>
                            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl font-medium line-clamp-2 sm:line-clamp-none leading-relaxed">
                                Curating an elite collection of tech, premium apparel, and daily utilities. Explore official product lineups with guaranteed brand authentication.
                            </p>
                        </div>

                        {/* Inline Specifications */}
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs font-medium text-zinc-500 border-t border-zinc-800/60 pt-4">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <LuMapPin size={13} className="text-zinc-600 shrink-0" />
                                <span className="truncate max-w-[240px] sm:max-w-md text-zinc-400">{vendor?.shopAddress || "Global Online Merchant"}</span>
                            </div>
                            {vendor?.gstNumber && (
                                <div className="flex items-center gap-1.5">
                                    <LuFileBadge size={13} className="text-zinc-600 shrink-0" />
                                    <span>GSTIN: <span className="font-mono text-zinc-300 bg-zinc-800/50 px-1.5 py-0.5 rounded">{vendor.gstNumber}</span></span>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* SEGMENTED TAB CONTROLLER */}
                <div className="flex items-center justify-between border-b border-zinc-800 mt-12 mb-8">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`pb-4 text-sm font-bold tracking-wide uppercase transition-all relative ${
                                activeTab === 'products' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <LuLayoutGrid size={14} /> Catalog ({vendorProducts.length})
                            </span>
                            {activeTab === 'products' && (
                                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('about')}
                            className={`pb-4 text-sm font-bold tracking-wide uppercase transition-all relative ${
                                activeTab === 'about' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
                            }`}
                        >
                            <span className="flex items-center gap-2">
                                <LuInfo size={14} /> Overview
                            </span>
                            {activeTab === 'about' && (
                                <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                            )}
                        </button>
                    </div>
                </div>

                {/* RENDERING CONTENT BLOCKS BASED ON ACTIVE SELECTIONS */}
                {activeTab === 'products' ? (
                    vendorProducts?.length === 0 ? (
                        <div className="text-center py-24 bg-zinc-900/10 border border-dashed border-zinc-800 rounded-3xl max-w-md mx-auto flex flex-col items-center justify-center">
                            <LuLayers className="text-zinc-700 mb-3" size={24} />
                            <h3 className="text-sm font-bold text-zinc-300">No active collections</h3>
                            <p className="text-xs text-zinc-500 mt-1 max-w-xs leading-relaxed">
                                This showroom hasn't updated its display lists recently. Check back soon.
                            </p>
                        </div>
                    ) : (
                        /* ULTRA-RESPONSIVE ADAPTIVE CARD GRID PATTERN */
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-fr"
                        >
                            {vendorProducts.map((p: any, i: number) => (
                                <div key={p._id || i} className="w-full flex justify-center h-full">
                                    <ProductCard product={p} />
                                </div>
                            ))}
                        </motion.div>
                    )
                ) : (
                    /* EXPLICIT CLEAN ABOUT COMPONENT WINDOW OVERVIEW */
                    <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl bg-zinc-900/20 border border-zinc-800/60 rounded-2xl p-6 space-y-6"
                    >
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Operational Merchant Name</h3>
                            <p className="text-base text-zinc-200 font-medium">{vendor?.shopName || "Unregistered Store Entity"}</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Physical Hub Address</h3>
                                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">{vendor?.shopAddress || "No physical hub provided"}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Registration Status</h3>
                                <p className="text-xs sm:text-sm text-zinc-300 capitalize font-medium">{vendor?.verificationStatus || "Pending Review"}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default ShopDetails