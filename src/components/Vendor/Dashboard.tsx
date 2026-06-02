'use client'

import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData'
import UseGetAllProductsData from '@/hooks/UseGetAllProductsData'
import UseGetCurrentUser from '@/hooks/UseGetCurrentUser'
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
  LuUsers,
  LuClock,
  LuCircleCheck
} from 'react-icons/lu'

const Dashboard = () => {
  UseGetAllOrdersData()
  UseGetAllProductsData()
  UseGetCurrentUser()

  const { allProdutctsData } = useSelector((state: RootState) => state.vendor)
  const { userData, allOrdersData } = useSelector((state: RootState) => state.user)
  const products = allProdutctsData?.product || []
  const order = allOrdersData?.orders || []

  // Compute clean contextual scope datasets matched to the current logged-in vendor identity
  const vendorOrders = order?.filter((o: any) => String(o.productVendor?._id || o.productVendor) === String(userData?._id)) || []
  const vendorProducts = products.filter((p: any) => String(p.vendor?._id || p.vendor) === String(userData?._id)) || []
  const validOrders = vendorOrders.filter((o: any) => o.orderStatus !== "cencelled" && o.orderStatus !== "cancelled" && o.orderStatus !== "returned")

  let totalSales = 0
  const customers = new Set<string>()

  validOrders.forEach((o: any) => {
    totalSales += o.totalAmount || 0
    customers.add(String(o.buyer?._id || o.buyer))
  })

  const deliveredOrders = vendorOrders.filter((o: any) => o.orderStatus === "delivered")
  const cancelledOrders = vendorOrders.filter((o: any) => o.orderStatus === "cencelled" || o.orderStatus === "cancelled")
  const returnedOrders = vendorOrders.filter((o: any) => o.orderStatus === "returned")
  const remainingOrders = vendorOrders.filter((o: any) => !["delivered", "cencelled", "cancelled", "returned"].includes(o.orderStatus))

  const orderProgress = [
    { name: "Delivered", value: deliveredOrders.length },
    { name: "Pending", value: remainingOrders.length },
    { name: "Cancelled", value: cancelledOrders.length },
    { name: "Returned", value: returnedOrders.length },
  ]

  // Dynamic linear dates compilation engine
  const orderDataMap: Record<string, number> = {}
  validOrders.forEach((o: any) => {
    const d = new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })
    orderDataMap[d] = (orderDataMap[d] || 0) + 1
  })

  const orderByDate = Object.keys(orderDataMap).map((d) => ({
    date: d,
    orders: orderDataMap[d]
  })).slice(-7) // Show trailing calendar windows cleanly up to 7 ticks

  const COLORS = ["#10B981", "#3B82F6", "#EF4444", "#F97316"]

  return (
    <div className='min-h-screen w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-zinc-100 bg-[#09090b] antialiased selection:bg-blue-500/20 overflow-x-hidden'>
      <div className='max-w-7xl mx-auto space-y-6 sm:space-y-8 relative z-10'>

        {/* Ambient backdrop visual structural nodes */}
        <div className="absolute top-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/[0.02] blur-[100px] sm:blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-purple-600/[0.02] blur-[90px] sm:blur-[110px] rounded-full pointer-events-none -z-10" />

        {/* Dashboard Control Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/60 pb-5 gap-4">
          <div>
            <h1 className='text-xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-200 to-zinc-500 tracking-tight capitalize'>
              {userData?.shopName ? `${userData.shopName} Terminal` : "Merchant Dashboard"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Welcome back, <span className="text-zinc-200 font-semibold">{userData?.name || "Vendor Partner"}</span>. Track catalog status, metrics, and shop performance.
            </p>
          </div>
          <div className="self-start sm:self-center flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/40 border border-zinc-800 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Merchant Profile Active
          </div>
        </div>

        {/* --- DYNAMIC METRIC INSIGHT CARDS GRID --- */}
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
          <Statebox title="Net Revenue" value={`₹${totalSales.toLocaleString('en-IN')}`} icon={<LuTrendingUp className="text-emerald-400" size={14} />} isSuccess />
          <Statebox title="Active Catalog" value={vendorProducts.length} icon={<LuPackage className="text-purple-400" size={14} />} />
          <Statebox title="Gross Orders" value={vendorOrders.length} icon={<LuShoppingBag className="text-blue-400" size={14} />} />
          <Statebox title="Total Customers" value={customers.size} icon={<LuUsers className="text-cyan-400" size={14} />} />
        </div>

        {/* --- PERFORMANCE VISUALIZATION GRAPHICS MATRIX --- */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>

          {/* Timeline Linear Bar Chart */}
          <div className='bg-zinc-950/40 border border-zinc-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col shadow-xl min-w-0'>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-4 bg-blue-500 rounded-sm" />
              <h2 className='font-bold text-sm tracking-tight text-zinc-200'>Sales Timeline Velocity</h2>
            </div>
            <div className='h-64 sm:h-72 w-full text-xs font-medium overflow-hidden'>
              {orderByDate.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 font-medium">No system order vectors recorded on this matrix.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={orderByDate} margin={{ bottom: 5, left: -25, right: 5, top: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f1f23" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#71717a', fontSize: 10 }} stroke="#27272a" tickLine={false} />
                    <YAxis tick={{ fill: '#71717a', fontSize: 10 }} stroke="#27272a" allowDecimals={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.01)' }} contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '11px', color: '#f4f4f5' }} />
                    <Bar dataKey="orders" fill='#3b82f6' radius={[4, 4, 0, 0]} barSize={16} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Fulfillment Breakdown & Distribution Donut */}
          <div className='bg-zinc-950/40 border border-zinc-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-5 flex flex-col shadow-xl min-w-0'>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-2 h-4 bg-emerald-500 rounded-sm" />
              <h2 className='font-bold text-sm tracking-tight text-zinc-200'>Fulfillment Architecture</h2>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5'>
              <StatusBox label='Delivered' value={deliveredOrders.length} color='text-emerald-400' borderBg='bg-emerald-500/5 border-emerald-500/10' />
              <StatusBox label='Processing' value={remainingOrders.length} color='text-blue-400' borderBg='bg-blue-500/5 border-blue-500/10' />
              <StatusBox label='Cancelled' value={cancelledOrders.length} color='text-red-400' borderBg='bg-red-500/5 border-red-500/10' />
              <StatusBox label='Returned' value={returnedOrders.length} color='text-orange-400' borderBg='bg-orange-500/5 border-orange-500/10' />
            </div>

            <div className='h-52 w-full relative flex items-center justify-center font-semibold text-xs text-zinc-400 overflow-hidden'>
              {vendorOrders.length === 0 ? (
                <div className="text-zinc-600 font-medium">No logistics tracking data distributed.</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie data={orderProgress} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70} paddingAngle={4} label={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 600 }}>
                      {orderProgress.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={COLORS[i]} stroke="#09090b" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px', fontSize: '11px', color: '#f4f4f5' }} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* --- LOWER FOOTER QUICK OVERVIEW TRACE PANEL --- */}
        <div className="bg-zinc-950/20 border border-zinc-800/60 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 shrink-0">
              <LuStore size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-200">Catalog Verification Status</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Ensure uploaded product items are configured properly to match structural guidelines.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold w-full md:w-auto">
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900/30 border border-zinc-800/40 flex-1 md:flex-initial justify-center md:justify-start">
              <LuCircleCheck className="text-emerald-500 shrink-0" size={13} />
              <span className="text-zinc-400 whitespace-nowrap">Approved: <b className="font-mono text-zinc-200 font-bold ml-0.5">{vendorProducts.length - vendorProducts.filter((p: any) => p.verificationStatus === "pending").length}</b></span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900/30 border border-zinc-800/40 flex-1 md:flex-initial justify-center md:justify-start">
              <LuClock className="text-amber-500 shrink-0" size={13} />
              <span className="text-zinc-400 whitespace-nowrap">In Review: <b className="font-mono text-amber-400 font-bold ml-0.5">{vendorProducts.filter((p: any) => p.verificationStatus === "pending").length}</b></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard

/* --- CORE INTERFACE REUSABLE STRUCTURAL SUB-COMPONENTS --- */

interface StateboxProps {
  title: string
  value: string | number
  icon: React.ReactNode
  isSuccess?: boolean
}

function Statebox({ title, value, icon, isSuccess }: StateboxProps) {
  return (
    <div className={`border rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-xs bg-zinc-950/40 relative overflow-hidden transition-all duration-200 hover:scale-[1.01] ${isSuccess
        ? "border-emerald-500/20 hover:border-emerald-500/30 shadow-emerald-950/5"
        : "border-zinc-800/80 hover:border-zinc-700/80 shadow-black"
      }`}>
      <div className="flex items-center justify-between gap-2">
        <p className='text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 truncate'>{title}</p>
        <div className="p-1 sm:p-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800/60 shrink-0">
          {icon}
        </div>
      </div>
      <p className={`text-base sm:text-2xl font-black tracking-tight mt-2 sm:mt-3 font-mono truncate ${isSuccess ? "text-emerald-400" : "text-white"
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
    <div className={`border rounded-xl p-2 text-center transition-all duration-200 hover:bg-zinc-900/10 ${borderBg}`}>
      <p className='text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase tracking-wide truncate'>{label}</p>
      <p className={`text-sm sm:text-base font-black mt-0.5 font-mono ${color}`}>{value}</p>
    </div>
  )
}