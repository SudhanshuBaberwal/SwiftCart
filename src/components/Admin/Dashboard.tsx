'use client'

import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData'
import UseGetAllProductsData from '@/hooks/UseGetAllProductsData'
import UseGetAllVendors from '@/hooks/UseGetAllVendors'
import { IUser } from '@/model/user.model'
import { RootState } from '@/redux/store'
import React from 'react'
import { useSelector } from 'react-redux'
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  CartesianGrid, 
  Cell, 
  PieChart as RechartsPieChart, 
  Pie, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts'
import { 
  LuStore, 
  LuPackage, 
  LuTrendingUp, 
  LuShoppingBag, 
  LuUserCheck, 
  LuLoaderCircle, 
  LuActivity 
} from 'react-icons/lu'

const Dashboard = () => {
  UseGetAllOrdersData()
  UseGetAllProductsData()
  UseGetAllVendors()

  const { allProdutctsData, allVendorData } = useSelector((state: RootState) => state.vendor)
  const { allOrdersData } = useSelector((state: RootState) => state.user)
  
  const products = allProdutctsData?.product || []
  const vendors = allVendorData || []
  const order = allOrdersData?.orders || []

  const pendingVendors = vendors.filter((v) => v.verificationStatus === "pending")
  const pendingProducts = products.filter((p: any) => p.verificationStatus === "pending")

  const deliveredOrders = order.filter((o: any) => o.orderStatus === "delivered")
  
  const totalEarning = deliveredOrders.reduce((acc: number, o: any) => {
    return o.isPaid ? acc + o.totalAmount : acc
  }, 0)

  // Compute vendor wise order statistics correctly
  const vendorOrderMap: { [key: string]: number } = {}
  order.forEach((o: any) => {
    const shopName = o.productVendor?.shopName || "Unknown Merchant"
    const displayName = shopName.length > 12 ? shopName.slice(0, 12) + "..." : shopName
    vendorOrderMap[displayName] = (vendorOrderMap[displayName] || 0) + 1
  })

  const vendorOrderGraph = Object.keys(vendorOrderMap).map(key => ({
    vendor: key,
    orders: vendorOrderMap[key]
  }))

  const cancelledOrders = order.filter((o: any) => o.orderStatus === "cencelled" || o.orderStatus === "cancelled")
  const returnedOrders = order.filter((o: any) => o.orderStatus === "returned")
  const remainingOrders = order.filter((o: any) => !["delivered", "cencelled", "cancelled", "returned"].includes(o.orderStatus))

  const orderProgress = [
    { name: "Delivered", value: deliveredOrders.length },
    { name: "Pending", value: remainingOrders.length },
    { name: "Cancelled", value: cancelledOrders.length },
    { name: "Returned", value: returnedOrders.length },
  ]

  const COLORS = ["#10B981", "#3B82F6", "#EF4444", "#F97316"]
  
  return (
    <div className='min-h-screen w-full px-4 sm:px-6 lg:px-8 py-8 text-zinc-100 bg-[#09090b] antialiased selection:bg-blue-500/20'>
      <div className='max-w-7xl mx-auto space-y-8 relative z-10'>
        
        {/* Decorative ambient background flares */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/[0.03] blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/[0.02] blur-[100px] rounded-full pointer-events-none -z-10" />

        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-5">
          <div>
            <h1 className='text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500 tracking-tight'>
              Admin Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">Real-time overview of merchant channels, logistics matrices, and sales analytics.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/40 border border-zinc-800 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live System Feed
          </div>
        </div>

        {/* --- STATS GRID OVERVIEW --- */}
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
          <Statebox title="Total Vendors" value={vendors.length} icon={<LuUserCheck className="text-blue-400" size={14} />} />
          <Statebox title="Pending Vendors" value={pendingVendors.length} icon={<LuLoaderCircle className="text-amber-400" size={14} />} isWarning={pendingVendors.length > 0} />
          <Statebox title="Total Products" value={products.length} icon={<LuPackage className="text-purple-400" size={14} />} />
          <Statebox title="Pending Products" value={pendingProducts.length} icon={<LuLoaderCircle className="text-amber-400" size={14} />} isWarning={pendingProducts.length > 0} />
          <Statebox title="Total Orders" value={order.length} icon={<LuShoppingBag className="text-cyan-400" size={14} />} />
          <Statebox title="Total Earnings" value={`₹${totalEarning.toLocaleString()}`} icon={<LuTrendingUp className="text-emerald-400" size={14} />} isSuccess />
        </div>

        {/* --- PERFORMANCE VISUALIZATION GRAPHICS --- */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          
          {/* Vendor Wise Bar Chart */}
          <div className='bg-zinc-950/40 border border-zinc-800/80 backdrop-blur-md rounded-2xl p-5 flex flex-col shadow-xl'>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-4 bg-blue-500 rounded-sm" />
              <h2 className='font-bold text-sm tracking-tight text-zinc-200'>Vendor Logistics Share</h2>
            </div>
            <div className='h-72 w-full text-xs font-medium'>
              {vendorOrderGraph.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 font-medium">No order routing paths tracked.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={vendorOrderGraph} margin={{ bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="vendor" interval={0} angle={-25} textAnchor='end' height={45} tick={{ fill: '#71717a', fontSize: 10 }} stroke="#27272a" />
                    <YAxis tick={{ fill: '#71717a', fontSize: 10 }} stroke="#27272a" allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '11px', color: '#f4f4f5' }} />
                    <Bar dataKey="orders" fill='#3b82f6' radius={[4, 4, 0, 0]} barSize={24} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Status Breakdown & Donut Section */}
          <div className='bg-zinc-950/40 border border-zinc-800/80 backdrop-blur-md rounded-2xl p-5 flex flex-col shadow-xl'>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-4 bg-emerald-500 rounded-sm" />
              <h2 className='font-bold text-sm tracking-tight text-zinc-200'>Order Lifecycle Mapping</h2>
            </div>
            
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5'>
              <StatusBox label='Delivered' value={deliveredOrders.length} color='text-emerald-400' borderBg='bg-emerald-500/10 border-emerald-500/20' />
              <StatusBox label='Pending' value={remainingOrders.length} color='text-blue-400' borderBg='bg-blue-500/10 border-blue-500/20' />
              <StatusBox label='Cancelled' value={cancelledOrders.length} color='text-red-400' borderBg='bg-red-500/10 border-red-500/20' />
              <StatusBox label='Returned' value={returnedOrders.length} color='text-orange-400' borderBg='bg-orange-500/10 border-orange-500/20' />
            </div>

            <div className='h-52 w-full relative flex items-center justify-center font-semibold text-xs'>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie data={orderProgress} dataKey="value" nameKey="name" innerRadius={55} outerRadius={75} paddingAngle={4} label={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 600 }}>
                    {orderProgress.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} stroke="#09090b" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '11px', color: '#f4f4f5' }} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* --- MERCHANT ROSTER METRIC MATRIX --- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LuStore className="text-zinc-500" size={16} />
            <h2 className="text-base font-bold text-zinc-200 tracking-tight">Active Vendor Profiles Matrix</h2>
          </div>
          
          {vendors.length === 0 ? (
            <div className="text-center py-16 bg-zinc-950/20 border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-xs font-medium">
              No merchant profiles registered to the environment directory.
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {vendors.map((vendor: IUser, i: number) => {
                const vendorProducts = products.filter((p: any) => String(p.vendor?._id || p.vendor) === String(vendor._id))
                const vendorOrders = order.filter((o: any) => String(o.productVendor?._id || o.productVendor) === String(vendor._id))
                const returned = vendorOrders.filter((o: any) => o.orderStatus === "returned").length
                const cancelled = vendorOrders.filter((o: any) => o.orderStatus === "cencelled" || o.orderStatus === "cancelled").length
                const delivered = vendorOrders.filter((o: any) => o.orderStatus === "delivered").length
                
                const vendorEarning = vendorOrders.reduce((acc: number, o: any) => {
                  return o.orderStatus === "delivered" && o.isPaid ? acc + o.totalAmount : acc
                }, 0)

                return (
                  <div key={ i} className='bg-zinc-950/40 border border-zinc-800/70 hover:border-zinc-700 backdrop-blur-md rounded-2xl p-5 shadow-md transition-all duration-200 group relative overflow-hidden'>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="min-w-0">
                        <h3 className='font-bold text-sm text-zinc-100 group-hover:text-blue-400 transition-colors truncate'>
                          {vendor.shopName || "Unnamed Store Hub"}
                        </h3>
                        <p className="text-[11px] font-medium text-zinc-500 truncate mt-0.5">{vendor.name || "Operator Account"}</p>
                      </div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-extrabold border ${
                        vendor.verificationStatus === "approved" 
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}>
                        {vendor.verificationStatus || 'Pending'}
                      </span>
                    </div>

                    <div className='grid grid-cols-2 gap-x-4 gap-y-2 border-t border-zinc-800/60 pt-3 text-xs font-semibold text-zinc-400'>
                      <div className="flex justify-between items-center bg-zinc-900/30 px-2 py-1 rounded-md border border-zinc-800/30">
                        <span className="text-zinc-600 text-[10px] uppercase">Products</span>
                        <span className="text-zinc-200">{vendorProducts.length}</span>
                      </div>
                      <div className="flex justify-between items-center bg-zinc-900/30 px-2 py-1 rounded-md border border-zinc-800/30">
                        <span className="text-zinc-600 text-[10px] uppercase">Orders</span>
                        <span className="text-zinc-200">{vendorOrders.length}</span>
                      </div>
                      <div className="flex justify-between items-center bg-zinc-900/30 px-2 py-1 rounded-md border border-zinc-800/30">
                        <span className="text-red-500/50 text-[10px] uppercase">Cancelled</span>
                        <span className="text-red-400 font-mono">{cancelled}</span>
                      </div>
                      <div className="flex justify-between items-center bg-zinc-900/30 px-2 py-1 rounded-md border border-zinc-800/30">
                        <span className="text-orange-500/50 text-[10px] uppercase">Returned</span>
                        <span className="text-orange-400 font-mono">{returned}</span>
                      </div>
                      <div className="flex justify-between items-center bg-zinc-900/30 px-2 py-1 rounded-md border border-zinc-800/30 col-span-2 mt-1">
                        <span className="text-emerald-500/60 text-[10px] uppercase flex items-center gap-1">
                          <LuActivity size={10} /> Delivered Volume
                        </span>
                        <span className="text-emerald-400 font-mono text-xs font-bold">
                          {delivered} Active / ₹{vendorEarning.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Dashboard

/* --- SUB-COMPONENTS WITH SPECIFIC DESIGN VARIABLES --- */

interface StateboxProps {
  title: string
  value: string | number
  icon: React.ReactNode
  isWarning?: boolean
  isSuccess?: boolean
}

function Statebox({ title, value, icon, isWarning, isSuccess }: StateboxProps) {
  return (
    <div className={`border rounded-xl p-4 flex flex-col justify-between shadow-xs bg-zinc-950/40 relative overflow-hidden transition-colors ${
      isWarning 
        ? "border-amber-500/20 hover:border-amber-500/30" 
        : isSuccess 
        ? "border-emerald-500/20 hover:border-emerald-500/30" 
        : "border-zinc-800/80 hover:border-zinc-700/80"
    }`}>
      <div className="flex items-center justify-between gap-2">
        <p className='text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 truncate'>{title}</p>
        <div className="p-1 rounded-md bg-zinc-900/80 border border-zinc-800/60 shrink-0">
          {icon}
        </div>
      </div>
      <p className={`text-base sm:text-xl font-black tracking-tight mt-3 font-mono ${
        isWarning ? "text-amber-400" : isSuccess ? "text-emerald-400" : "text-white"
      }`}>{value}</p>
    </div>
  )
}

interface StatusBoxProps {
  label: string
  value: number
  color: string
  borderBg: string
}

function StatusBox({ label, value, color, borderBg }: StatusBoxProps) {
  return (
    <div className={`border rounded-xl p-2.5 text-center transition-all ${borderBg}`}>
      <p className='text-[10px] font-bold text-zinc-500 uppercase tracking-wide'>{label}</p>
      <p className={`text-sm sm:text-base font-black mt-0.5 font-mono ${color}`}>{value}</p>
    </div>
  )
}