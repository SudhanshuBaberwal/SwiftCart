'use client'

import UseGetAllOrdersData from '@/hooks/UseGetAllOrdersData'
import UseGetCurrentUser from '@/hooks/UseGetCurrentUser'
import { AppDispatch, RootState } from '@/redux/store'
import { setAllOrdersData } from '@/redux/userSlice'
import axios from 'axios'
import { motion } from 'motion/react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FiTruck } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'


const Page = () => {
  UseGetAllOrdersData()
  UseGetCurrentUser()

  const dispatch = useDispatch<AppDispatch>()
  const { userData } = useSelector((state: RootState) => state.user)
  const { allOrdersData } = useSelector((state: RootState) => state.user)
  const [trackOrderModel, setTrackOrderModel] = useState<any | null>(null)
  const [selectdOrder, setSelectedOrder] = useState<any | null>(null)

  const orders = Array.isArray(allOrdersData?.orders)
    ? allOrdersData.orders.filter((o) => String(o?.buyer?._id) === String(userData?._id))
    : []

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

  const isCencelDisabled = (order: any) => order.isPaid === true && order.paymentMethod === "stripe"

  const status = ["pending", "confirmed", "shipped", "delivered"]

  const renderTrackStep = (currentStatus: string) => {
    return (
      <div className='relative pl-6'>
        <div className='absolute top-0 left-8 w-px h-full  bg-gray-600'> </div>
        {status.map((s, i) => {
          const active = currentStatus === s
          return (
            <div key={i} className='relative mb-6 flex items-start'>
              <div className={`w-4 h-4 rounded-full ${active ? "bg-blue-500 shadow-lg shadow-blue-500/50" : "bg-gray-500"}`}>

              </div>
              <div className='ml-4 text-sm'>{s.toUpperCase()}</div>
            </div>
          )
        })}

      </div>
    )
  }

  const handleCencel = async (orderId: string) => {
    try {
      await axios.post("/api/order/cencelOrder", { orderId })

      toast.success("Order Cencelled Successfully")

      const updatedOrders = allOrdersData.orders.map((o: any) =>
        o._id === orderId
          ? { ...o, orderStatus: "cencelled" }
          : o
      )

      dispatch(
        setAllOrdersData({
          ...allOrdersData,
          orders: updatedOrders
        })
      )

      setSelectedOrder(null) // <- ADD THIS
    }
    catch (error) {
      toast.error("Failed to cencel order")
      console.log(error)
    }
  }

  const isEligibleReturn = (deliveryDate: string, replacementDay: number) => {
    if (!deliveryDate || !replacementDay) return false;
    const deliveredAt = new Date(deliveryDate).getTime()
    const expiry = deliveredAt + replacementDay * 24 * 60 * 60 * 1000
    return Date.now() <= expiry;
  }
  const remainingDays = (deliveryDate: string, replacementDay: number) => {
    if (!deliveryDate || !replacementDay) return 0;
    const deliveredAt = new Date(deliveryDate).getTime()
    const expiry = deliveredAt + replacementDay * 24 * 60 * 60 * 1000;
    const diff = expiry - Date.now()
    if (diff <= 0) return 0;
    return Math.ceil(diff / (24 * 60 * 60 * 1000))
  }
  const ReturnEndDate = (deliveryDate: string, replacementDay: number) => {
    if (!deliveryDate || !replacementDay) return 0;
    const deliveredAt = new Date(deliveryDate)
    deliveredAt.setDate(deliveredAt.getDate() + replacementDay)
    return deliveredAt;
  }

  const returnOrder = async (orderId: string) => {
    try {
      const result = await axios.post("/api/order/return", { orderId })
      const updatedOrders = allOrdersData.orders.map((o: any) =>
        o._id === orderId
          ? { ...o, orderStatus: "returned", returnAmount: result.data }
          : o
      )
      toast.success("Order returned")
    } catch (error) {
      console.log(error)
      toast.error("Order return failed")
    }
  }

  if (!userData || !allOrdersData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 text-2xl font-semibold text-white p-6">
        Loading Orders....
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 text-white p-4 sm:p-6 md:p-8">
      <div className='max-w-6xl mx-auto'>

        {/* Header Alignment Frame */}
        <div className='mb-6 flex items-center justify-between border-b border-white/5 pb-4'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-white'>My Orders</h1>
            <p className='text-xs text-gray-400 mt-0.5'>All orders placed by you</p>
          </div>
          <div className='text-sm font-semibold text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5'>
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SMALL & MEDIUM DEVICES CODE (Card Deck Layout per Screenshot) */}
        {/* ========================================================= */}
        <div className='block lg:hidden space-y-4'>
          {orders.length !== 0 ? (
            orders.map((order: any, index: number) => (
              <div
                key={index}
                className="bg-[#121214] border border-white/[0.06] p-5 rounded-xl shadow-xl shadow-black/30 flex flex-col justify-between relative"
              >
                {/* Upper Metrics Layer */}
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-500 tracking-wider">
                      #{String(order._id).slice(-8)}
                    </span>
                    <p className="text-sm font-semibold text-gray-100">
                      {order?.createdAt ? formateDate(order.createdAt.toString()) : "N/A"}
                    </p>
                    <p className="text-xs text-gray-400 font-medium">
                      {order.productVendor?.shopName || 'Vendor Shop'}
                    </p>
                  </div>

                  {/* Price Tag styling */}
                  <div className="text-right">
                    <span className="text-emerald-400 font-bold text-xl tracking-tight">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Mid Payment & Vendor Line Container */}
                <div className="my-3 space-y-1.5 border-t border-b border-white/[0.04] py-3">
                  <div className="text-xs text-gray-400">
                    Payment Method : <span className="text-gray-200 font-medium uppercase">{order.paymentMethod}</span>
                  </div>

                  {/* Status Badges Matching Your Image Colors */}
                  <div className="flex items-center justify-between text-xs mt-1">
                    <span className={`font-semibold capitalize tracking-wide ${order.isPaid ? "text-emerald-500" : "text-amber-500"}`}>
                      {order.isPaid ? "paid" : "pending"}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-gray-500 block font-semibold tracking-wider">Status</span>
                      <span className="font-extrabold text-sm text-gray-100 tracking-wide uppercase">
                        {order.orderStatus || 'PENDING'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Custom Nested Map for Inner Products Mapping */}
                <div className="text-sm text-gray-300 font-medium my-2">
                  {order.products?.map((p: any, i: number) => (
                    <div key={i} className="truncate max-w-md">
                      {p.product?.title} <span className="text-gray-500 text-xs px-1">*</span> {p.quantity}
                    </div>
                  ))}
                </div>
                {order.orderStatus === "cencelled" && (
                  <span className='text-red-500 font-semibold'>Cencelled</span>
                )}
                {/* Bottom Control Actions Layer */}
                {order.orderStatus !== "cencelled" && order.orderStatus === "returned" && <div className="grid grid-cols-2 gap-3 mt-4">
                  <button onClick={() => setSelectedOrder(order)}
                    className="w-full py-3 px-4 bg-white/6 hover:bg-white/12 border border-white/4 rounded-lg text-xs font-semibold text-gray-200 transition-all text-center">
                    Check Details
                  </button>
                  <button
                    disabled={order.orderStatus === "delivered"}
                    onClick={() => setTrackOrderModel(order)}
                    className={`px-3 py-1 rounded flex items-center gap-2 transition ${order.orderStatus === "delivered" ?
                      "bg-green-500/20 text-green-400 cursor-not-allowed" : "bg-white/10 hover:bg-white/20"
                      }`}>
                    <FiTruck /> {order.orderStatus === "delivered" ? "Delivered" : "Track Order"}
                  </button>
                </div>}
              </div>
            ))
          ) : (
            <div className="text-center text-sm text-gray-400 py-12 bg-white/5 border border-dashed border-white/10 rounded-xl">
              No Orders Found
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* LARGE DEVICES TABLE CODE (Kept Intact & Enhanced) */}
        {/* ========================================================= */}
        <div className='hidden lg:block bg-[#121214] border border-white/10 rounded-xl overflow-hidden shadow-xl shadow-black/40'>
          <table className='w-full text-left border-collapse'>
            <thead className='text-xs bg-white/5 border-b border-white/10 text-gray-400 uppercase tracking-wider'>
              <tr>
                <th className='px-5 py-4 font-semibold'>Order ID</th>
                <th className='px-5 py-4 font-semibold'>Date</th>
                <th className='px-5 py-4 font-semibold'>Products</th>
                <th className='px-5 py-4 font-semibold'>Vendor</th>
                <th className='px-5 py-4 font-semibold'>Payments</th>
                <th className='px-5 py-4 font-semibold'>Status</th>
                <th className='px-5 py-4 text-right font-semibold'>Total</th>
                <th className='px-5 py-4 text-center font-semibold'>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {orders.length !== 0 ? (
                orders.map((order: any, index: number) => (
                  <tr key={index} className='hover:bg-white/[0.04] transition-all duration-200'>
                    <td className='px-5 py-4 text-sm font-mono text-gray-400'>#{String(order._id).slice(-8)}</td>
                    <td className='px-5 py-4 text-sm font-medium'>
                      {order?.createdAt ? formateDate(order.createdAt.toString()) : "N/A"}
                    </td>
                    <td className='px-5 py-4 text-sm text-gray-300 max-w-xs'>
                      {order.products?.map((p: any, i: number) => (
                        <div className="truncate" key={i}>
                          {p.product?.title} <span className="text-gray-500 font-light text-xs">*</span> {p.quantity}
                        </div>
                      ))}
                    </td>
                    <td className='px-5 py-4 text-sm text-gray-400'>
                      {order.productVendor?.shopName}
                    </td>
                    <td className='px-5 py-4 text-sm'>
                      <span className="font-semibold block text-gray-200 uppercase tracking-wide text-xs">{order.paymentMethod}</span>
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${order.isPaid ? "text-emerald-500" : "text-amber-500"}`}>
                        {order.isPaid ? "paid" : "pending"}
                      </span>
                    </td>
                    <td className='px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-100'>
                      {order.orderStatus || 'PENDING'}
                    </td>
                    <td className='px-5 py-4 text-right text-emerald-400 text-lg font-bold tracking-tight'>
                      ₹{order.totalAmount}
                    </td>
                    <td className='px-5 py-4 text-sm'>
                      {
                        order.orderStatus === "cencelled"
                          ? (
                            <div className='flex justify-center'>
                              <span className='px-3 py-1 rounded-full
                          bg-red-500/15 text-red-400
                          text-xs font-bold uppercase tracking-wider'>
                                Cancelled
                              </span>
                            </div>
                          )
                          : (
                            <div className='flex gap-2 justify-center items-center'>

                              <button
                                onClick={() => setSelectedOrder(order)}
                                className='px-3 py-1.5 bg-white/5 border border-white/5
          text-xs font-medium rounded hover:bg-white/10 transition-colors'
                              >
                                Check Details
                              </button>

                              <button
                                disabled={order.orderStatus === "delivered"}
                                onClick={() => setTrackOrderModel(order)}
                                className={`px-3 py-1 rounded flex items-center gap-2 transition
                                ${order.orderStatus === "delivered"
                                    ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                                    : "bg-white/10 hover:bg-white/20"
                                  }`}
                              >
                                <FiTruck />
                                {
                                  order.orderStatus === "delivered"
                                    ? "Delivered"
                                    : "Track Order"
                                }
                              </button>

                            </div>
                          )
                      }
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className='text-center text-gray-400 p-8 text-sm' colSpan={8}>
                    No Orders Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {
        selectdOrder && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className='relative z-10 w-full max-w-3xl bg-[#061526] border border-white/10  p-6 rounded-xl shadow-2xl shadow-black/40'
            >
              <h2 className='text-lg font-semibold'>#{String(selectdOrder._id).slice(-8)}</h2>
              <p className='text-sm text-gray-300'>{formateDate(selectdOrder.createdAt)}</p>
              <h3 className='font-semibold mb-3'>Product</h3>
              {
                selectdOrder.products.map((p: any, i: any) => (
                  <div
                    key={i}
                    className='flex justify-between bg-white/5 p-3 rounded mb-2'
                  >
                    <div>
                      <div className='font-medium'>
                        {p.product.title}
                      </div>
                      <div>
                        Qty: {p.quantity} * Price : {p.price}
                      </div>
                    </div>
                  </div>
                ))
              }
              <hr className='my-4 border-white/10' />
              <h3 className='font-semibold mb-2'>Invoice</h3>
              <div className='text-sm space-y-1'>
                <div className='flex justify-between'>
                  <span>Product Total</span>
                  <span>{selectdOrder.productTotal}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Delivery Charge</span>
                  <span>{selectdOrder.deliveryCharge}</span>
                </div>
                <div className='flex justify-between'>
                  <span>Service Charge</span>
                  <span>{selectdOrder.serviceCharge}</span>
                </div>
                <hr className='my-4 border-white/10' />
              </div>
              <div className='flex justify-between font-semibold text-green-500'>
                <span>Total Amount</span>
                <span>{selectdOrder.totalAmount}</span>
              </div>

              {
                selectdOrder.orderStatus === "delivered" && selectdOrder.deliveryDate && (
                  <div className='mt-3 text-sm text-green-400'>
                    Delivered On : {" "}
                    {new Date(selectdOrder.deliveryDate).toLocaleDateString("en-IN")}
                  </div>
                )
              }

              {
                selectdOrder.isPaid === true && selectdOrder.paymentMethod === "stripe" &&
                <div className='bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs rounded-lg p-3 mt-4'>
                  <p className='font-semibold mb-1'>Important Note</p>
                  <ul className='list-disc pl-4 space-y-1'>
                    <li>
                      Order cencellation feature is <b>not available if payment is done using online payment </b>
                    </li>
                    <li>You can only <b>return the product</b>after delivery</li>
                    <li>On return, you will receive only the <b>Product Amount</b></li>
                    <li>Delivery & service charges are non-refundable.</li>
                  </ul>

                </div>
              }

              <div className='mt-6 flex justify-end gap-3'>
                <button
                  className='px-4 py-2 bg-white/10 rounded'
                  onClick={() => setSelectedOrder(null)}
                >
                  Cencel
                </button>
                <button
                  disabled={selectdOrder.orderStatus === "delivered"}
                  onClick={() => setTrackOrderModel(selectdOrder)}
                  className={`px-3 py-1 rounded flex items-center gap-2 transition
                                ${selectdOrder.orderStatus === "delivered"
                      ? "bg-green-500/20 text-green-400 cursor-not-allowed"
                      : "bg-white/10 hover:bg-white/20"
                    }`}
                >
                  <FiTruck />
                  {
                    selectdOrder.orderStatus === "delivered"
                      ? "Delivered"
                      : "Track Order"
                  }
                </button>
                {
                  selectdOrder.orderStatus !== "delivered" ? (<button
                    onClick={() => handleCencel(selectdOrder._id)}
                    className={`px-4 py-2 rounded ${isCencelDisabled(selectdOrder) ? "bg-white/10 text-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-800"}`}
                  >
                    Cencel Order
                  </button>) : (
                    selectdOrder.products.map((p: any, i: number) => {
                      console.log(p)
                      const repalcementDays = p.product.replacementDay || 0
                      const eligible = isEligibleReturn(selectdOrder.deliveryDate, repalcementDays)
                      const remaining = remainingDays(selectdOrder.deliveryDate, repalcementDays)
                      const returnEndDate = ReturnEndDate(selectdOrder.deliveryDate, repalcementDays)
                      console.log(repalcementDays)
                      return (
                        <div key={i} className='flex justify-between items-center bg-white/5 px-3 py-2 rounded ml-2'>
                          <div>
                            <p className='text-xs text-gray-300'>
                              {p.product?.title}
                            </p>
                            {
                              eligible ? (
                                <>
                                  <p className='text-xs text-yellow-400'>
                                    Return available for {remaining} days {remaining > 1 ? "s" : ""}
                                  </p>
                                  {
                                    returnEndDate && (
                                      <p className='text-[11px] text-gray-400'>
                                        Return till : {" "}
                                        {returnEndDate.toLocaleDateString("en-IN")}
                                      </p>
                                    )
                                  }
                                </>
                              ) : (<p className='text-xs text-red-400'>Return Window Closed</p>)
                            }
                          </div>
                          {
                            eligible && (
                              <button onClick={() => returnOrder(selectdOrder._id)} className='mx-3 px-3 py-1 bg-yellow-600 rounded text-sm'>Return</button>
                            )
                          }
                        </div>
                      )
                    })
                  )
                }
              </div>

            </motion.div>
          </div>
        )
      }


      {
        trackOrderModel && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className='relative z-10 w-full min-h-125 max-w-lg bg-[#061526] border border-white/10 p-6 rounded-xl'
            >
              <h2 className='text-lg font-semibold'>Track Order</h2>
              <div className='text-sm text-gray-300 mb-4 leading-relaxed'>
                <div className='flex justify-start gap-2'>
                  <span>Buyer Name : </span>
                  <span>{trackOrderModel.address.name}</span>
                </div>
                <div className='flex justify-start gap-2'>
                  <span>Delivery Address : </span>
                  <span>{trackOrderModel.address.address}</span>
                </div>
                <div className='flex justify-start gap-2'>
                  <span>City : </span>
                  <span>{trackOrderModel.address.city}</span>
                </div>
                <div className='flex justify-start gap-2'>
                  <span>PinCode : </span>
                  <span>{trackOrderModel.address.pincode}</span>
                </div>
                <div className='flex justify-start gap-2'>
                  <span>Mobile Number : </span>
                  <span>{trackOrderModel.address.phone}</span>
                </div>
              </div>
              {renderTrackStep(trackOrderModel.orderStatus)}
              <button
                onClick={() => setTrackOrderModel(null)}
                className='px-4 py-2 bg-white/10 rounded'
              >
                Cencel
              </button>
            </motion.div>
          </div>
        )
      }
    </div>

  )
}

export default Page