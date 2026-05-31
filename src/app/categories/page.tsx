'use client'

import ProductCard from '@/components/ProductCard';
import { RootState } from '@/redux/store';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { LuSearch, LuStore, LuX, LuCircle, LuSlidersHorizontal } from 'react-icons/lu';

const CategoriesPage = () => {
  const categoryList = [
    { label: "all", icon: "🗂️" },
    { label: "Fashion & Lifestyle", icon: "👗" },
    { label: "Electronics & Gadgets", icon: "📱" },
    { label: "Home & Living", icon: "🏠" },
    { label: "Beauty & Personal Care", icon: "💄" },
    { label: "Toys, Kids & Baby", icon: "🧸" },
    { label: "Food & Grocery", icon: "🛒" },
    { label: "Sports & Fitness", icon: "🏀" },
    { label: "Automotive Accessories", icon: "🚗" },
    { label: "Gifts & Handcrafts", icon: "🎁" },
    { label: "Books & Stationery", icon: "📚" },
  ];

  const { allVendorData } = useSelector((state: RootState) => state.vendor);
  const vendors = allVendorData || [];

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedShop, setSelectedShop] = useState("all")
  const [search, setSearch] = useState("")
  const [shopSearch, setShopSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [isReady , setIsReady] = useState(false)

  const filterShops = !shopSearch
    ? []
    : vendors.filter((v: any) => v?.shopName?.toLowerCase().includes(shopSearch.toLowerCase()))

  const [displayProducts, setDisplayProducts] = useState<any[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState("");


  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    console.log(params)
    const cat = params.get("category")
    if (cat) {
      setSelectedCategory(cat)
    }
    setIsReady(true)
  }, [])


  const fetchProduct = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams()
      if (debouncedSearch) params.append("query", debouncedSearch)
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }
      if (selectedShop !== "all") {
        params.append("shop", selectedShop)
      }

      const result = await axios.get(`/api/search?${params.toString()}`)
      setDisplayProducts(result.data.products || [])
    } catch (error) {
      console.error("Error retrieving products:", error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!isReady) return
    fetchProduct();
  }, [selectedCategory, selectedShop, debouncedSearch , isReady]);

  const clearShopFilter = () => {
    setShopSearch("");
    setSelectedShop("all");
  };

  

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-950 via-zinc-900 to-neutral-950 text-white px-4 sm:px-6 lg:px-8 py-6 md:py-10 antialiased w-full overflow-x-hidden'>

      {/* Header Panel */}
      <div className='max-w-7xl mx-auto mb-6 md:mb-10 border-b border-white/[0.06] pb-4 md:pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h1 className='text-xl sm:text-3xl font-extrabold tracking-tight text-white'>
            Browse Marketplace
          </h1>
          <p className='text-neutral-400 text-xs mt-1 font-medium'>
            Filter catalog records dynamically by categories, shops, or keywords.
          </p>
        </div>

        {/* Mobile Toggle Button for Filters Control */}
        <button
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="md:hidden w-full sm:w-auto flex items-center justify-center gap-2 bg-neutral-900 border border-white/10 px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-neutral-800 active:scale-95 transition-all duration-200"
        >
          <LuSlidersHorizontal className={`transform transition-transform duration-300 ${showMobileFilters ? 'rotate-180 text-blue-400' : ''}`} size={14} />
          <span>{showMobileFilters ? "Hide Filters" : "Show Filters & Shops"}</span>
        </button>
      </div>

      {/* Main Structural Layout Grid */}
      <div className='max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 items-start w-full relative'>

        {/* SMOOTH WRAPPER: Handles CSS grid-row height morphs on mobile, native presentation on desktop */}
        <div className={`
          grid md:block transition-all duration-300 ease-in-out md:col-span-1
          ${showMobileFilters ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'}
        `}>

          {/* Internal container that slides without layout clipping */}
          <div className="overflow-hidden md:overflow-visible w-full">

            {/* THE SIDEBAR BODY */}
            <div className="bg-[#121214] border border-white/[0.06] rounded-2xl p-5 space-y-5 shadow-xl backdrop-blur-md md:sticky md:top-6">

              {/* Keyword Search Section */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Keyword Match</label>
                <div className="relative">
                  <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={15} />
                  <input
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                    type="text"
                    placeholder='Search items...'
                    className='w-full pl-9 pr-8 py-2 rounded-xl bg-neutral-900/60 text-xs border border-white/10 focus:outline-none focus:border-blue-500 text-white placeholder-neutral-500 transition-all'
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white">
                      <LuX size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Department Categories Container */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Department</label>
                <div className='space-y-1 max-h-48 md:max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent'>
                  {categoryList.map((cat) => {
                    const isSelected = selectedCategory === cat.label;
                    return (
                      <button
                        onClick={() => {
                          setSelectedCategory(cat.label);
                          setSelectedShop("all");
                          setShopSearch("");
                          if (window.innerWidth < 768) setShowMobileFilters(false);
                        }}
                        key={cat.label}
                        className={`w-full flex items-center justify-between text-left px-3 py-2 text-xs font-medium rounded-xl border transition-all duration-200 ${isSelected
                            ? "bg-blue-600/10 text-blue-400 border-blue-500/20 shadow-md scale-[0.99]"
                            : "bg-neutral-900/20 text-neutral-300 border-transparent hover:bg-white/[0.04] hover:text-white"
                          }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-sm shrink-0">{cat.icon}</span>
                          <span className="truncate capitalize">{cat.label}</span>
                        </div>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 animate-pulse" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shop Selector Container */}
              <div className="space-y-2 pt-3 border-t border-white/[0.04]">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Filter by Shop</label>
                <div className="relative">
                  <LuStore className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
                  <input
                    type="text"
                    onChange={(e) => setShopSearch(e.target.value)}
                    value={shopSearch}
                    placeholder='Type shop brand name...'
                    className='w-full pl-9 pr-8 py-2 rounded-xl bg-neutral-900/60 text-xs border border-white/10 focus:outline-none focus:border-blue-500 text-white placeholder-neutral-500 transition-all'
                  />
                  {selectedShop !== "all" && (
                    <button onClick={clearShopFilter} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-300">
                      <LuX size={14} />
                    </button>
                  )}
                </div>

                {/* Shop Search Filter Dropdown Overlay Box */}
                <div className={`transition-all duration-200 ease-in-out ${shopSearch && selectedShop === "all" ? 'opacity-100 scale-100 mt-1' : 'opacity-0 scale-95 h-0 pointer-events-none'}`}>
                  {shopSearch && selectedShop === "all" && (
                    <div className='bg-neutral-950 border border-white/10 rounded-xl max-h-40 overflow-y-auto shadow-2xl divide-y divide-white/[0.04] z-50 relative'>
                      {filterShops.length > 0 ? (
                        filterShops.map((v: any) => (
                          <button
                            key={v._id}
                            className='w-full px-3 py-2 text-xs text-left text-neutral-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2'
                            onClick={() => {
                              setShopSearch(v.shopName);
                              setSelectedShop(v._id);
                              if (window.innerWidth < 768) setShowMobileFilters(false);
                            }}
                          >
                            <LuStore size={12} className="text-neutral-500" />
                            <span className="font-medium truncate">{v.shopName}</span>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-2.5 text-[11px] text-neutral-500 italic text-center">
                          No matching shops found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT HAND CONTENT CONTAINER: DISPLAY CARD DECK MODULES */}
        <div className='md:col-span-3 w-full transition-all duration-300'>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-3">
              <div className="w-6 h-6 border-2 border-neutral-700 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-[11px] text-neutral-500 font-medium tracking-wide">Querying catalog items...</p>
            </div>
          ) : displayProducts.length === 0 ? (
            <div className='text-center py-20 px-4 bg-[#121214]/40 border border-dashed border-white/[0.06] rounded-2xl flex flex-col items-center justify-center max-w-md mx-auto mt-2 transition-all duration-300'>
              <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center mb-3 border border-white/[0.04]">
                <LuCircle className="text-neutral-500" size={18} />
              </div>
              <h3 className="text-sm font-bold text-neutral-300 tracking-tight">No Products Match Filters</h3>
              <p className='text-neutral-500 text-[11px] mt-1 max-w-xs mx-auto leading-relaxed'>
                Try modifying keywords, changing selected departments, or clearing your active filters.
              </p>
            </div>
          ) : (
            /* RESPONSIVE FLUID PRODUCT DISPLAY GRID STRUCTURE WITH ENHANCED TRANSITION APPEARANCE */
            <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 w-full auto-rows-fr transition-all duration-300'>
              {displayProducts.map((p: any) => (
                <div key={p._id} className="w-full flex justify-center transform transition-all duration-300 hover:scale-[1.02]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default CategoriesPage;