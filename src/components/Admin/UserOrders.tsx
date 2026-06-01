'use client'

import UseGetAllVendors from '@/hooks/UseGetAllVendors'
import { IUser } from '@/model/user.model'
import { AppDispatch, RootState } from '@/redux/store'
import { setAllVendorsData } from '@/redux/vendorSlice'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import toast from 'react-hot-toast'
import {
  LuStore, LuUser, LuPhone, LuMail, LuMapPin,
  LuFileText, LuCheck, LuCircle, LuInbox, LuArrowLeft, LuLoaderCircle
} from 'react-icons/lu'
import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData'
import UseGetCurrentUser from '@/hooks/UseGetCurrentUser'
import { setAllOrdersData } from '@/redux/userSlice'

const UserOrders = () => {
  const dispatch = useDispatch<AppDispatch>()
  UseGetAllOrdersData()
  UseGetCurrentUser()

  const { allOrdersData } = useSelector((state: RootState) => state.user)

  // Safely grab the orders array to prevent application runtime crashes
  const orders = allOrdersData?.orders && Array.isArray(allOrdersData.orders) ? allOrdersData.orders : []

  const formateDate = (date: string) => {
    if (!date) return ''
    const d = new Date(date)
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  return (
    <div className='relative w-full min-h-screen px-4 sm:px-6 lg:px-10 py-8 text-white font-sans overflow-x-hidden bg-[#09090b]'>
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[40%] h-[30%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Header */}
      <div className="mb-8 relative z-10">
        <h1 className='text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight'>
          Vendor Orders
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">Review and manage client product orders assigned to your shop.</p>
      </div>

      {/* --- Desktop Table Layout (Optimized for Large Viewports) --- */}
      <div className='hidden md:block relative z-10 w-full bg-white/[0.02] border border-white/5 rounded-[2rem] shadow-2xl backdrop-blur-xl overflow-hidden'>
        <div className="w-full overflow-x-auto">
          <table className='w-full text-left border-collapse min-w-[800px]'>
            <thead className='bg-black/40 border-b border-white/5'>
              <tr className="text-xs uppercase tracking-wider text-gray-500">
                <th className='p-6 font-medium'>OrderId</th>
                <th className='p-6 font-medium'>Buyer</th>
                <th className='p-6 font-medium'>Vendor</th>
                <th className='p-6 font-medium'>Product</th>
                <th className='p-6 font-medium'>Amount</th>
                <th className='p-6 font-medium'>Payment</th>
                <th className='p-6 font-medium text-center'>Status</th>
                <th className='p-6 font-medium text-right'>Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className='p-16 text-center'>
                    <div className="flex flex-col items-center justify-center text-gray-500 gap-3">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-2">
                        <LuInbox size={32} className="opacity-50" />
                      </div>
                      <p className="text-lg font-medium text-gray-400">All caught up!</p>
                      <p className="text-sm">No Orders Found at the moment.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order: any, index: any) => (
                  <tr className='hover:bg-white/[0.02] transition-colors group text-sm' key={order._id || index}>
                    <td className='p-5 font-mono text-gray-500 text-xs'>#{String(order._id!).slice(-8).toUpperCase()}</td>
                    <td className='p-5 font-medium'>
                      <div className="text-gray-200">{order.address?.name || 'Unknown Buyer'}</div>
                      <div className='text-xs text-gray-500 mt-0.5'>{order.address?.phone || '--'}</div>
                    </td>
                    <td className='p-5 text-gray-300'>{order.productVendor?.shopName || 'N/A'}</td>
                    <td className='p-5 text-sm text-gray-300'>
                      <div className="space-y-1 max-w-xs">
                        {order.products?.map((p: any, i: number) => (
                          <div key={i} className="truncate text-xs text-gray-400">
                            {p.product?.title} <span className="text-gray-600 font-bold">*</span> <span className="text-zinc-200 font-semibold">{p.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className='p-5 font-semibold text-zinc-200'>
                      ₹{order.totalAmount || '0'}
                    </td>
                    <td className='p-5 text-xs'>
                      <span className="font-semibold block text-gray-400">{order.paymentMethod?.toUpperCase()}</span>
                      <div className={`text-[11px] font-bold mt-0.5 ${order.isPaid ? "text-emerald-500" : "text-amber-500"}`}>
                        {order.isPaid ? "Paid" : "Pending"}
                      </div>
                    </td>
                    <td className='p-5 text-center'>
                      {order.orderStatus === "cancelled" && (
                        <span className='text-red-400 font-semibold text-xs bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full capitalize'>Cancelled</span>
                      )}
                       {order.orderStatus === "pending" && (
                        <span className='text-yellow-400 font-semibold text-xs bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full capitalize'>Pending</span>
                      )}
                      {order.orderStatus === "delivered" && (
                        <span className='text-emerald-400 font-semibold text-xs bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full capitalize'>Delivered</span>
                      )}
                      {order.orderStatus === "returned" && (
                        <span className='text-indigo-400 font-semibold text-xs bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full capitalize'>Returned</span>
                      )}
                      {order.orderStatus === "confirmed" && (
                        <span className='text-green-400 font-semibold text-xs bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full capitalize'>Confirmed</span>
                      )}
                      {order.orderStatus === "shipped" && (
                        <span className='text-pink-400 font-semibold text-xs bg-pink-500/10 border border-pink-500/20 px-2.5 py-1 rounded-full capitalize'>Shipped</span>
                      )}
                    </td>
                    <td className='p-5 text-right font-mono text-xs text-gray-500'>
                      {formateDate(String(order.createdAt))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Mobile Cards Layout (Optimized for Small & Medium Screen Frameworks) --- */}
      <div className='md:hidden flex flex-col gap-4 relative z-10 w-full'>
        {orders.length === 0 ? (
          <div className='bg-white/[0.02] border border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center text-center text-gray-500 mt-4'>
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mb-3">
              <LuInbox size={26} className="opacity-50" />
            </div>
            <p className="text-base font-medium text-gray-300">All caught up!</p>
            <p className="text-xs mt-1 text-gray-500">No Orders Found at the moment.</p>
          </div>
        ) : (
          orders.map((order: any, index: any) => (
            <div
              key={order._id || index}
              className='bg-[#111113]/90 border border-white/[0.06] rounded-2xl p-5 space-y-4 backdrop-blur-md shadow-xl w-full'
            >
              {/* Card Topline Layer */}
              <div className='flex justify-between items-start border-b border-white/[0.04] pb-3 gap-2'>
                <div className="space-y-1 min-w-0">
                  <span className='font-mono text-xs text-gray-500 tracking-wider block font-bold'>
                    #{String(order._id).slice(-8).toUpperCase()}
                  </span>
                  <span className='text-[10px] text-gray-500 font-mono block'>
                    {formateDate(String(order.createdAt)).split(',')[0]}
                  </span>
                </div>

                {/* Total amount representation tag */}
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Total Amount</span>
                  <span className="text-emerald-400 font-bold text-base tracking-tight">
                    ₹{order.totalAmount || '0'}
                  </span>
                </div>
              </div>

              {/* Customer Shipping Frame Box */}
              <div className="bg-white/[0.02] border border-white/[0.02] p-3 rounded-xl space-y-1">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Shipping Details</p>
                <div className="text-sm font-semibold text-gray-200 truncate">{order.address?.name || 'Unknown Buyer'}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                  <LuPhone size={12} className="text-gray-600 shrink-0" />
                  <span className="font-mono">{order.address?.phone || 'No phone attached'}</span>
                </div>
              </div>

              {/* Nested Content Item Array Frame */}
              <div className='space-y-1.5'>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Ordered Items</p>
                <div className="divide-y divide-white/[0.03] bg-black/20 rounded-xl p-3 border border-white/[0.02] space-y-1.5">
                  {order.products?.map((p: any, i: number) => (
                    <div key={i} className='flex justify-between items-center py-1 first:pt-0 last:pb-0 text-xs gap-4'>
                      <span className='text-gray-300 font-medium truncate flex-1'>
                        {p.product?.title || 'Unknown Product'}
                      </span>
                      <span className='text-[10px] font-mono bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-400 shrink-0 font-bold'>
                        Qty: {p.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Action Row Block */}
              <div className='pt-2.5 border-t border-white/[0.04] grid grid-cols-2 gap-4 items-center'>
                <div>
                  <span className='text-[9px] uppercase text-gray-500 font-bold tracking-wider block mb-0.5'>
                    Payment ({order.paymentMethod?.toUpperCase() || 'COD'})
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${order.isPaid ? "text-emerald-500" : "text-amber-500"}`}>
                    • {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span className='text-[9px] uppercase text-gray-500 font-bold tracking-wider block mb-1 text-right w-full'>
                    Workflow State
                  </span>
                  {order.orderStatus === "cancelled" && (
                    <span className='text-red-400 text-xs font-bold uppercase tracking-wide bg-red-500/10 border border-red-500/10 px-2 py-0.5 rounded-md'>Cancelled</span>
                  )}
                  {order.orderStatus === "delivered" && (
                    <span className='text-emerald-400 text-xs font-bold uppercase tracking-wide bg-emerald-500/10 border border-emerald-500/10 px-2 py-0.5 rounded-md'>Delivered</span>
                  )}
                  {order.orderStatus === "returned" && (
                    <span className='text-orange-400 text-xs font-bold uppercase tracking-wide bg-orange-500/10 border border-orange-500/10 px-2 py-0.5 rounded-md'>Returned</span>
                  )}
                  {order.orderStatus === "confirmed" && (
                    <span className='text-indigo-400 text-xs font-bold uppercase tracking-wide bg-indigo-500/10 border border-indigo-500/10 px-2 py-0.5 rounded-md'>Confirmed</span>
                  )}
                  {order.orderStatus === "shipped" && (
                    <span className='text-pink-400 text-xs font-bold uppercase tracking-wide bg-pink-500/10 border border-pink-500/10 px-2 py-0.5 rounded-md'>Shipped</span>
                  )}
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default UserOrders