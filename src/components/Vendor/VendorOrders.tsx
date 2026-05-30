'use client'

import UseGetAllVendors from '@/hooks/UseGetAllVendors'
import { IUser } from '@/model/user.model'
import { AppDispatch, RootState } from '@/redux/store'
import { setAllVendorsData } from '@/redux/vendorSlice'
import axios, { all } from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
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

const VendorOrders = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [otpModel, setOtpModel] = useState<any | null>(null)
  const [otp, setOtp] = useState("")

  UseGetAllOrdersData()
  UseGetCurrentUser()

  const { userData } = useSelector((state: RootState) => state.user)
  const { allOrdersData } = useSelector((state: RootState) => state.user)

  const orders = Array.isArray(allOrdersData?.orders)
    ? allOrdersData.orders.filter((o) => String(o?.buyer?._id) !== String(userData?._id))
    : []

  const statusOptions = ["pending", "confirmed", "shipped", "delivered"];

  const formateDate = (date: string) => {
    if (!date) return 'N/A'
    const d = new Date(date)
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  // Placeholder handler for handling backend status changes
  const handleStatusChange = async (orderId: string, nextStatus: string) => {
    try {
      const result = await axios.post('/api/order/update-status', { orderId, status: nextStatus })
      // console.log(result)
      toast.success(`Order updated to ${nextStatus}`)
      dispatch(setAllOrdersData(
        allOrdersData.orders.map((o: any) => (
          o._id === orderId ? { ...o, orderStatus: nextStatus } : o
        ))
      ))
    } catch (error) {
      toast.error("Failed to update status")
      console.log(error)
    }
  }

  const verifyOtp = async () => {
    try {
      const result = await axios.post("/api/order/verify-delivery-otp", { orderId: otpModel._id, otp: otp })
      dispatch(
        setAllOrdersData({
          ...allOrdersData,
          orders: allOrdersData.orders.map((o: any) =>
            o._id === otpModel._id
              ? { ...o, orderStatus: "delivered" }
              : o
          )
        })
      )
      toast.success("Order Delivered Successfully")
      setOtpModel(null)
      setOtp("")
    } catch (error) {
      console.log(error)
      toast.error("Order Delivery failed")
    }
  }

  return (
    <div className='relative w-full min-h-screen px-4 sm:px-6 lg:px-10 py-8 text-white font-sans overflow-hidden'>
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[40%] h-[30%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="mb-8 relative z-10">
        <h1 className='text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tight'>
          Vendor Orders
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">Review and manage client product orders assigned to your shop.</p>
      </div>

      {/* --- Desktop Table --- */}
      <div className='hidden md:block relative z-10 w-full overflow-hidden bg-white/2 border border-white/5 rounded-4xl shadow-2xl backdrop-blur-xl'>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-black/40 border-b border-white/5'>
            <tr className="text-xs uppercase tracking-wider text-gray-500">
              <th className='p-6 font-medium'>Order</th>
              <th className='p-6 font-medium'>Buyer</th>
              <th className='p-6 font-medium'>Products</th>
              <th className='p-6 font-medium'>Payment</th>
              <th className='p-6 font-medium'>Status</th>
              <th className='p-6 font-medium text-right'>Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/2">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-16 text-center'>
                  <div className="flex flex-col items-center justify-center text-gray-500 gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/2 flex items-center justify-center mb-2">
                      <LuInbox size={32} className="opacity-50" />
                    </div>
                    <p className="text-lg font-medium text-gray-400">All caught up!</p>
                    <p className="text-sm">No Orders Found at the moment.</p>
                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order: any, index: any) => (
                <tr className='hover:bg-white/2 transition-colors group' key={index}>
                  <td className='p-4 font-mono text-gray-400'>#{String(order._id!).slice(-8)}</td>
                  <td className='p-4 font-medium'>
                    {order.address?.name}
                    <div className='text-xs text-gray-400 mt-0.5'>{order.address?.phone}</div>
                  </td>
                  <td className='p-4 text-sm text-gray-300'>
                    {order.products?.map((p: any, i: number) => (
                      <div key={i} className="truncate max-w-xs">
                        {p.product?.title} <span className="text-gray-500">*</span> {p.quantity}
                      </div>
                    ))}
                  </td>
                  <td className='p-4 text-sm'>
                    <span className="font-semibold block">{order.paymentMethod?.toUpperCase()}</span>
                    <div className={`text-xs font-bold ${order.isPaid ? "text-emerald-500" : "text-amber-500"}`}>
                      {order.isPaid ? "Paid" : "Pending"}
                    </div>
                  </td>
                  <td className='p-4 text-xs font-bold uppercase tracking-wider text-gray-200'>
                    {order.orderStatus?.toUpperCase()}
                  </td>
                  <td className='p-4 text-right'>

                    {order.orderStatus === "cancelled" && (
                      <span className='text-red-500 font-semibold capitalize'>Cencelled</span>
                    )}
                    {order.orderStatus === "delivered" && (
                      <span className='text-green-500 font-semibold capitalize'>Delivered</span>
                    )}
                    {order.orderStatus === "cancelled" && (
                      <span className='text-orange-500 font-semibold capitalize'>Returned</span>
                    )}


                    {order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && <select
                      value={order.orderStatus}
                      onChange={async (e) => {
                        if (e.target.value === "delivered") {
                          handleStatusChange(String(order._id), "delivered")
                          setOtpModel(order)
                        } else {
                          handleStatusChange(String(order._id), e.target.value)
                        }
                      }}
                      className='bg-neutral-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-200 focus:outline-none focus:border-violet-500 transition-colors'
                    >
                      {statusOptions.map((s, i) => (
                        <option key={i} value={s} className='bg-neutral-950 text-left text-sm py-2'>
                          {s.toUpperCase()}
                        </option>
                      ))}
                    </select>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Mobile Cards (Optimized for Small & Medium Screen Frameworks) --- */}
      <div className='md:hidden flex flex-col gap-4 relative z-10'>
        {orders.length === 0 ? (
          <div className='bg-white/2 border border-white/5 rounded-4xl p-10 flex flex-col items-center justify-center text-center text-gray-500 mt-4'>
            <div className="w-16 h-16 rounded-full bg-white/2 flex items-center justify-center mb-2">
              <LuInbox size={32} className="opacity-50" />
            </div>
            <p className="text-lg font-medium text-gray-300">All caught up!</p>
            <p className="text-sm mt-1">No Orders Found at the moment.</p>
          </div>
        ) : (
          orders.map((order: any, index: any) => (
            <div
              key={index}
              className='bg-[#111113]/90 border border-white/[0.06] rounded-2xl p-5 space-y-4 backdrop-blur-md shadow-xl'
            >
              {/* Card Topline Layer */}
              <div className='flex justify-between items-start border-b border-white/[0.04] pb-3'>
                <div className="space-y-0.5">
                  <span className='font-mono text-xs text-gray-500 tracking-wider block'>
                    #{String(order._id).slice(-8)}
                  </span>
                  <span className='text-xs text-gray-400 font-medium block'>
                    {order.createdAt ? formateDate(order.createdAt.toString()) : "N/A"}
                  </span>
                </div>

                {/* Total amount representation tag */}
                <div className="text-right">
                  <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider block">Total Amount</span>
                  <span className="text-emerald-400 font-bold text-lg tracking-tight">
                    ₹{order.totalAmount || '0'}
                  </span>
                </div>
              </div>

              {/* Customer Shipping Frame Box */}
              <div className="bg-white/[0.02] border border-white/[0.02] p-3 rounded-xl space-y-1">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Shipping Details</p>
                <div className="text-sm font-semibold text-gray-200">{order.address?.name || 'Unknown Buyer'}</div>
                <div className="text-xs text-gray-400 flex items-center gap-1.5">
                  <LuPhone size={12} className="text-gray-500" />
                  <span>{order.address?.phone || 'No phone attached'}</span>
                </div>
              </div>

              {/* Nested Content Item Array Frame */}
              <div className='space-y-2'>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Ordered Items</p>
                <div className="divide-y divide-white/[0.03] bg-black/20 rounded-xl p-3 border border-white/[0.02]">
                  {order.products?.map((p: any, i: number) => (
                    <div key={i} className='flex justify-between items-center py-2 first:pt-0 last:pb-0 text-sm'>
                      <span className='text-gray-300 font-medium truncate max-w-[70%]'>
                        {p.product?.title || 'Unknown Product'}
                      </span>
                      <span className='text-xs font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400 shrink-0'>
                        Qty: {p.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Action Row Block */}
              <div className='pt-2 border-t border-white/[0.04] grid grid-cols-2 gap-4 items-center'>
                <div>
                  <span className='text-[10px] uppercase text-gray-500 font-bold tracking-wider block mb-1'>
                    Payment ({order.paymentMethod?.toUpperCase()})
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-wider ${order.isPaid ? "text-emerald-500" : "text-amber-500"}`}>
                    • {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </div>

                <div className="flex flex-col items-end">
                  <span className='text-[10px] uppercase text-gray-500 font-bold tracking-wider block mb-1 w-full text-right'>
                    Workflow State
                  </span>
                  {order.orderStatus === "cancelled" && (
                    <span className='text-red-500 font-semibold capitalize'>Cencelled</span>
                  )}
                  {order.orderStatus === "delivered" && (
                    <span className='text-green-500 font-semibold capitalize'>Delivered</span>
                  )}
                  {order.orderStatus === "cancelled" && (
                    <span className='text-orange-500 font-semibold capitalize'>Returned</span>
                  )}


                  {order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && order.orderStatus !== "cancelled" && <select
                    value={order.orderStatus}
                    onChange={async (e) => {
                      if (e.target.value === "delivered") {
                        handleStatusChange(String(order._id), "delivered")
                        setOtpModel(order)
                      } else {
                        handleStatusChange(String(order._id), e.target.value)
                      }
                    }}
                    className='bg-neutral-900/80 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-200 focus:outline-none focus:border-violet-500 transition-colors'
                  >
                    {statusOptions.map((s, i) => (
                      <option key={i} value={s} className='bg-neutral-950 text-left text-sm py-2'>
                        {s.toUpperCase()}
                      </option>
                    ))}
                  </select>}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {
        otpModel && (
          <div className='fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50'>
            <div className='bg-[#061526] p-6 rounded-xl w-full max-w-md'>
              <h2 className='text-lg font-semibold mb-3'>Enter Delivery OTP</h2>
              <input type="text" placeholder='Enter OTP'
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                className='w-full bg-white/10 border border-white/10 px-4 py-2 rounded mb-4' />
              <button
                onClick={verifyOtp}
                className='w-full bg-green-600 py-2 rounded flex items-center justify-center gap-2'
              >Verify & Delivery</button>
            </div>
          </div>
        )
      }

    </div>
  )
}

export default VendorOrders