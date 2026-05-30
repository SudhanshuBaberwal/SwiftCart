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

  const isCancelDisabled = (order: any) => order.isPaid === true && order.paymentMethod === "stripe"

  const status = ["pending", "confirmed", "shipped", "delivered"]

  const renderTrackStep = (currentStatus: string) => {
    return (
      <div className='relative pl-6 my-4'>
        <div className='absolute top-0 left-2 w-px h-full bg-gray-700'></div>
        {status.map((s, i) => {
          const active = currentStatus === s
          return (
            <div key={i} className='relative mb-6 flex items-center'>
              <div className={`absolute left-0 w-4 h-4 rounded-full border-2 border-gray-900 transition-colors ${active ? "bg-blue-500 shadow-md shadow-blue-500/50" : "bg-gray-600"}`}></div>
              <div className={`ml-8 text-xs font-semibold uppercase tracking-wider ${active ? "text-blue-400" : "text-gray-400"}`}>{s}</div>
            </div>
          )
        })}
      </div>
    )
  }

  const handleCancel = async (orderId: string) => {
    try {
      await axios.post("/api/order/cancelOrder", { orderId })
      toast.success("Order Cancelled Successfully")

      const updatedOrders = allOrdersData.orders.map((o: any) =>
        o._id === orderId ? { ...o, orderStatus: "cancelled" } : o
      )

      dispatch(setAllOrdersData({ ...allOrdersData, orders: updatedOrders }))
      setSelectedOrder(null)
    }
    catch (error) {
      toast.error("Failed to cancel order")
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
    if (!deliveryDate || !replacementDay) return null;
    const deliveredAt = new Date(deliveryDate)
    deliveredAt.setDate(deliveredAt.getDate() + replacementDay)
    return deliveredAt;
  }

  const returnOrder = async (orderId: string) => {
    try {
      const result = await axios.post("/api/order/return", { orderId })
      toast.success("Order returned successfully")
      
      const refundVal = result.data?.data?.refundAmount || selectdOrder?.totalAmount || 0

      const updatedOrders = allOrdersData.orders.map((o: any) =>
        o._id === orderId ? { ...o, orderStatus: "returned", returnedAmount: refundVal } : o
      )
      
      dispatch(setAllOrdersData({ ...allOrdersData, orders: updatedOrders }))
      
      if (selectdOrder?._id === orderId) {
        setSelectedOrder({ ...selectdOrder, orderStatus: "returned", returnedAmount: refundVal })
      }
    } catch (error) {
      console.log(error)
      toast.error("Order return failed")
    }
  }

  if (!userData || !allOrdersData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-lg font-medium text-gray-400">
        Loading Orders...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 p-4 sm:p-6 md:p-8">
      <div className='max-w-6xl mx-auto'>

        {/* Header Section */}
        <div className='mb-8 flex items-center justify-between border-b border-white/5 pb-5'>
          <div>
            <h1 className='text-2xl font-bold text-white tracking-tight'>My Orders</h1>
            <p className='text-xs text-gray-400 mt-1'>Manage your orders and return status</p>
          </div>
          <div className='text-xs font-semibold text-gray-300 bg-white/5 px-3 py-1.5 rounded-md border border-white/5'>
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE DEVICES LAYOUT CARDS */}
        {/* ========================================================= */}
        <div className='block lg:hidden space-y-4'>
          {orders.length !== 0 ? (
            orders.map((order: any, index: number) => (
              <div
                key={index}
                className="bg-[#121214] border border-white/[0.06] p-5 rounded-xl shadow-lg flex flex-col justify-between relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-gray-500">
                      #{String(order._id).slice(-8).toUpperCase()}
                    </span>
                    <p className="text-sm font-semibold text-gray-200">
                      {order?.createdAt ? formateDate(order.createdAt.toString()) : "N/A"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.productVendor?.shopName || 'Vendor Shop'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-emerald-400 font-bold text-lg">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                <div className="my-3 space-y-1.5 border-t border-b border-white/[0.04] py-3 text-xs">
                  <div className="text-gray-400">
                    Payment Method: <span className="text-gray-200 uppercase font-medium">{order.paymentMethod}</span>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className={`font-semibold capitalize tracking-wide ${order.isPaid ? "text-emerald-500" : "text-amber-500"}`}>
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-gray-500 block font-semibold">Status</span>
                      <span className={`font-bold text-sm tracking-wide uppercase ${
                        order.orderStatus === "cancelled" ? "text-red-400" : order.orderStatus === "returned" ? "text-orange-400" : "text-gray-200"
                      }`}>
                        {order.orderStatus || 'PENDING'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-300 space-y-1 my-2">
                  {order.products?.map((p: any, i: number) => (
                    <div key={i} className="truncate max-w-md">
                      {p.product?.title} <span className="text-gray-500 font-mono">*</span> {p.quantity}
                    </div>
                  ))}
                </div>

                {order.orderStatus === "returned" && (
                  <div className="text-xs text-orange-400 font-medium mt-1 bg-orange-500/5 p-2 rounded border border-orange-500/10 flex justify-between">
                    <span>Returned</span>
                    <span className="font-bold">₹{order.returnedAmount || 0}</span>
                  </div>
                )}
                {order.orderStatus === "cancelled" && (
                  <div className="text-xs text-red-400 font-medium mt-1 bg-red-500/5 p-2 rounded border border-red-500/10">
                    Cancelled
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button onClick={() => setSelectedOrder(order)}
                    className="w-full py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-medium text-gray-200 transition-all text-center">
                    Check Details
                  </button>
                  <button
                    disabled={order.orderStatus === "delivered" || order.orderStatus === "cancelled" || order.orderStatus === "returned"}
                    onClick={() => setTrackOrderModel(order)}
                    className={`px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-medium transition ${
                      order.orderStatus === "delivered" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-not-allowed" : 
                      (order.orderStatus === "cancelled" || order.orderStatus === "returned") ? "bg-white/5 text-gray-600 cursor-not-allowed" : 
                      "bg-white/10 hover:bg-white/20 text-white"
                    }`}>
                    <FiTruck /> {order.orderStatus === "delivered" ? "Delivered" : "Track Order"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-xs text-gray-500 py-12 bg-white/[0.02] border border-dashed border-white/10 rounded-xl">
              No Orders Found
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* DESKTOP TABLE CODES */}
        {/* ========================================================= */}
        <div className='hidden lg:block bg-[#121214] border border-white/10 rounded-xl overflow-hidden shadow-xl'>
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
                  <tr key={index} className='hover:bg-white/[0.02] transition-colors'>
                    <td className='px-5 py-4 text-xs font-mono text-gray-400'>#{String(order._id).slice(-8).toUpperCase()}</td>
                    <td className='px-5 py-4 text-xs font-medium'>
                      {order?.createdAt ? formateDate(order.createdAt.toString()) : "N/A"}
                    </td>
                    <td className='px-5 py-4 text-xs text-gray-300 max-w-xs'>
                      {order.products?.map((p: any, i: number) => (
                        <div className="truncate" key={i}>
                          {p.product?.title} <span className="text-gray-500 text-xs">*</span> {p.quantity}
                        </div>
                      ))}
                    </td>
                    <td className='px-5 py-4 text-xs text-gray-400'>
                      {order.productVendor?.shopName}
                    </td>
                    <td className='px-5 py-4 text-xs'>
                      <span className="font-semibold block text-gray-200 uppercase tracking-wide text-[10px]">{order.paymentMethod}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${order.isPaid ? "text-emerald-500" : "text-amber-500"}`}>
                        {order.isPaid ? "paid" : "pending"}
                      </span>
                    </td>
                    <td className='px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-200'>
                      {order.orderStatus || 'PENDING'}
                    </td>
                    <td className='px-5 py-4 text-right text-emerald-400 font-bold'>
                      ₹{order.totalAmount}
                    </td>
                    <td className='px-5 py-4 text-xs'>
                      {order.orderStatus === "returned" ? (
                        <div className="text-center bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2 py-1 rounded text-[11px] font-semibold">
                          Returned (₹{order.returnedAmount || 0})
                        </div>
                      ) : order.orderStatus === "cancelled" ? (
                        <div className='flex justify-center'>
                          <span className='px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold uppercase tracking-wider text-[10px]'>
                            Cancelled
                          </span>
                        </div>
                      ) : (
                        <div className='flex gap-2 justify-center items-center'>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className='px-3 py-1.5 bg-white/5 border border-white/5 text-xs font-medium rounded hover:bg-white/10 transition-colors'
                          >
                            Check Details
                          </button>
                          <button
                            disabled={order.orderStatus === "delivered"}
                            onClick={() => setTrackOrderModel(order)}
                            className={`px-3 py-1.5 rounded flex items-center gap-2 transition text-xs ${
                              order.orderStatus === "delivered" ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-not-allowed" : "bg-white/10 hover:bg-white/20"
                            }`}
                          >
                            <FiTruck /> {order.orderStatus === "delivered" ? "Delivered" : "Track"}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className='text-center text-gray-500 p-8 text-xs' colSpan={8}>
                    No Orders Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DETAILED VIEW EXPANDED MODAL */}
      {/* ========================================================= */}
      {selectdOrder && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs'>
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className='relative w-full max-w-2xl bg-[#0e1118] border border-white/10 p-6 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto'
          >
            <div className="flex justify-between items-start border-b border-white/10 pb-3 mb-4">
              <div>
                <h2 className='text-md font-mono font-bold text-gray-300'>ORDER #{String(selectdOrder._id).toUpperCase()}</h2>
                <p className='text-xs text-gray-400 mt-0.5'>{formateDate(selectdOrder.createdAt)}</p>
              </div>
              <span className="text-xs bg-white/5 px-2.5 py-1 rounded border border-white/10 font-bold uppercase tracking-wider text-gray-300">
                {selectdOrder.orderStatus}
              </span>
            </div>

            <h3 className='text-xs font-bold uppercase tracking-wider text-gray-400 mb-2'>Items Manifest</h3>
            <div className="space-y-2 mb-4">
              {selectdOrder.products.map((p: any, i: any) => (
                <div key={i} className='flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-lg'>
                  <div>
                    <div className='font-medium text-sm text-gray-200'>{p.product?.title}</div>
                    <div className='text-xs text-gray-400 mt-0.5'>Qty: {p.quantity} × Price: ₹{p.price}</div>
                  </div>
                  <div className='text-sm font-semibold text-gray-300'>₹{p.quantity * p.price}</div>
                </div>
              ))}
            </div>

            <h3 className='text-xs font-bold uppercase tracking-wider text-gray-400 mb-2'>Invoice Breakdown</h3>
            <div className='text-xs space-y-2 bg-white/[0.01] border border-white/5 p-3 rounded-lg text-gray-400 mb-4'>
              <div className='flex justify-between'><span>Product Subtotal</span><span>₹{selectdOrder.productTotal}</span></div>
              <div className='flex justify-between'><span>Delivery Fees</span><span>₹{selectdOrder.deliveryCharge}</span></div>
              <div className='flex justify-between'><span>Service Charge</span><span>₹{selectdOrder.serviceCharge}</span></div>
              <div className='flex justify-between border-t border-white/5 pt-2 font-semibold text-emerald-400 text-sm'>
                <span>Grand Total</span><span>₹{selectdOrder.totalAmount}</span>
              </div>
            </div>

            {selectdOrder.orderStatus === "returned" && (
              <div className="mb-4 p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg text-xs text-orange-400 flex justify-between font-medium">
                <span>Refunded Amount Issued:</span>
                <span className="font-bold">₹{selectdOrder.returnedAmount || 0}</span>
              </div>
            )}

            {selectdOrder.orderStatus === "delivered" && selectdOrder.deliveryDate && (
              <div className='text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg mb-4'>
                Delivered On: {new Date(selectdOrder.deliveryDate).toLocaleDateString("en-IN")}
              </div>
            )}

            {selectdOrder.isPaid === true && selectdOrder.paymentMethod === "stripe" && (
              <div className='bg-amber-500/5 border border-amber-500/10 text-amber-300 text-xs rounded-lg p-3.5 mb-4'>
                <p className='font-bold text-amber-400 uppercase tracking-wider text-[10px] mb-1'>Stripe Gateway Policies</p>
                <ul className='list-disc pl-4 space-y-1 text-gray-400 text-[11px]'>
                  <li>Cancellations are locked once an online deployment payment captures.</li>
                  <li>Returns open directly after successful courier handoff delivery.</li>
                  <li>Platform processing charges and logistical transport fees are non-refundable.</li>
                </ul>
              </div>
            )}

            {/* RETURN ITEMS FOOTER INTERFACE SECTION */}
            {selectdOrder.orderStatus === "delivered" && (
              <div className="border-t border-white/5 pt-4 mt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Manage Item Window Returns</h4>
                {selectdOrder.products.map((p: any, i: number) => {
                  const replacementDays = p.product?.replacementDay || 0
                  const eligible = isEligibleReturn(selectdOrder.deliveryDate, replacementDays)
                  const remaining = remainingDays(selectdOrder.deliveryDate, replacementDays)
                  const returnEndDate = ReturnEndDate(selectdOrder.deliveryDate, replacementDays)

                  return (
                    <div key={i} className='flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5'>
                      <div className="max-w-[70%]">
                        <p className='text-xs font-medium text-gray-200 truncate'>{p.product?.title}</p>
                        {eligible ? (
                          <div className="text-[11px] mt-1 space-x-2">
                            <span className="text-amber-400 font-medium">{remaining} Day{remaining > 1 ? "s" : ""} active return</span>
                            {returnEndDate && <span className="text-gray-500">Till: {returnEndDate.toLocaleDateString("en-IN")}</span>}
                          </div>
                        ) : (
                          <p className='text-[11px] text-red-400 mt-1'>Return Window Has Closed</p>
                        )}
                      </div>
                      {eligible && (
                        <button 
                          onClick={() => returnOrder(selectdOrder._id)} 
                          className='px-3 py-1.5 bg-amber-600 hover:bg-amber-500 transition-colors text-white text-xs font-semibold rounded'
                        >
                          Return
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* ACTION FOOTER */}
            <div className='mt-6 pt-4 border-t border-white/5 flex justify-end gap-3'>
              <button className='px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors' onClick={() => setSelectedOrder(null)}>
                Cancel
              </button>
              
              <button
                disabled={selectdOrder.orderStatus === "delivered" || selectdOrder.orderStatus === "cancelled" || selectdOrder.orderStatus === "returned"}
                onClick={() => setTrackOrderModel(selectdOrder)}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition text-xs font-medium ${
                  selectdOrder.orderStatus === "delivered" ? "bg-green-500/10 text-green-400 border border-green-500/20 cursor-not-allowed" : 
                  (selectdOrder.orderStatus === "cancelled" || selectdOrder.orderStatus === "returned") ? "bg-white/5 text-gray-600 cursor-not-allowed" : 
                  "bg-white/10 hover:bg-white/20"
                }`}
              >
                <FiTruck /> {selectdOrder.orderStatus === "delivered" ? "Delivered" : "Track Order"}
              </button>

              {selectdOrder.orderStatus !== "delivered" && selectdOrder.orderStatus !== "cancelled" && selectdOrder.orderStatus !== "returned" && (
                <button
                  onClick={() => handleCancel(selectdOrder._id)}
                  disabled={isCancelDisabled(selectdOrder)}
                  className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isCancelDisabled(selectdOrder) ? "bg-white/5 text-gray-500 cursor-not-allowed border border-white/5" : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LOGISTICS TRACKING STATUS STEPPER PANEL */}
      {/* ========================================================= */}
      {trackOrderModel && (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs'>
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className='relative w-full max-w-md bg-[#0e1118] border border-white/10 p-6 rounded-xl shadow-2xl'
          >
            <h2 className='text-md font-bold text-gray-200 mb-3'>Track Shipment Journey</h2>
            <div className='text-xs text-gray-400 mb-4 space-y-1.5 bg-white/[0.01] border border-white/5 p-3 rounded-lg'>
              <div className='flex justify-between'><span className="text-gray-500">Recipient Name:</span><span className="text-gray-200 font-medium">{trackOrderModel.address?.name}</span></div>
              <div className='flex justify-between'><span className="text-gray-500">Address Base:</span><span className="text-gray-200 font-medium text-right max-w-[70%] truncate">{trackOrderModel.address?.address}</span></div>
              <div className='flex justify-between'><span className="text-gray-500">City / Postal Code:</span><span className="text-gray-200 font-medium">{trackOrderModel.address?.city} ({trackOrderModel.address?.pincode})</span></div>
              <div className='flex justify-between'><span className="text-gray-500">Contact Number:</span><span className="text-gray-200 font-mono">{trackOrderModel.address?.phone}</span></div>
            </div>

            {renderTrackStep(trackOrderModel.orderStatus)}

            <div className="mt-5 pt-3 border-t border-white/5 flex justify-end">
              <button onClick={() => setTrackOrderModel(null)} className='px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-medium transition-colors'>
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Page