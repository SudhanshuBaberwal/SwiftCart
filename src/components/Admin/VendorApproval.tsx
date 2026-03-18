'use client'
import UseGetAllVendors from '@/hooks/UseGetAllVendors'
import { IUser } from '@/model/user.model'
import { AppDispatch, RootState } from '@/redux/store'
import { setAllVendorsData } from '@/redux/vendorSlice'
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'
import toast from 'react-hot-toast'
import {
  LuStore, LuUser, LuPhone, LuMail, LuMapPin,
  LuFileText, LuCheck, LuCircle, LuInbox, LuArrowLeft, LuLoaderCircle
} from 'react-icons/lu'

const VendorApproval = () => {
  UseGetAllVendors()
  const dispatch = useDispatch<AppDispatch>()

  // State
  const allVendorData: IUser[] = useSelector((state: RootState) => state.vendor.allVendorData)
  const pendingVendors = Array.isArray(allVendorData) ? allVendorData.filter((v) => v.verificationStatus === "pending") : []

  const [selectedVendor, setSelectedVendor] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [rejectLoading, setRejectLoading] = useState(false)

  // Rejection State
  const [rejectedModel, setRejectedModel] = useState(false)
  const [rejectedReason, setRejectedReason] = useState("")

  // --- Handlers ---
  const closeModel = () => {
    setSelectedVendor(null)
    setTimeout(() => {
      setRejectedModel(false)
      setRejectedReason("")
    }, 300) // Reset after animation finishes
  }

  const openRejectReasonArea = () => {
    setRejectedModel(true)
    setRejectedReason("")
  }

  const handleApproved = async () => {
    if (!selectedVendor) return
    setLoading(true)
    try {
      await axios.post("/api/admin/update-vendor-status", { vendorId: selectedVendor._id, status: "approved" })
      const updated = allVendorData.filter((v) => v._id !== selectedVendor._id)
      dispatch(setAllVendorsData(updated))

      toast.success(`${selectedVendor.shopName} Approved Successfully!`, {
        style: { background: '#1c1c1e', color: '#10b981', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' },
        iconTheme: { primary: '#10b981', secondary: '#fff' }
      });

      closeModel()
    } catch (error) {
      console.log(error)
      toast.error("Failed to approve vendor.", {
        style: { background: '#1c1c1e', color: '#ef4444', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }
      });
    } finally {
      setLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedVendor) return
    if (!rejectedReason.trim()) {
      toast.error("Please provide a reason for rejection.", {
        style: { background: '#1c1c1e', color: '#ef4444', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }
      });
      return;
    }

    setRejectLoading(true)
    try {
      await axios.post("/api/admin/update-vendor-status", {
        vendorId: selectedVendor._id,
        status: "rejected",
        rejectReason: rejectedReason
      })

      const updated = allVendorData.filter((v) => v._id !== selectedVendor._id)
      dispatch(setAllVendorsData(updated))

      toast.success(`${selectedVendor.shopName} has been rejected.`, {
        style: { background: '#1c1c1e', color: '#ef4444', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' },
        iconTheme: { primary: '#ef4444', secondary: '#fff' }
      });

      closeModel()
    } catch (error) {
      console.log(error)
      toast.error("Failed to reject vendor.", {
        style: { background: '#1c1c1e', color: '#ef4444', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }
      });
    } finally {
      setRejectLoading(false)
    }
  }

  return (
    <div className='relative w-full min-h-screen px-4 sm:px-6 lg:px-10 py-8 text-white font-sans overflow-hidden'>
      {/* Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[40%] h-[30%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="mb-8 relative z-10">
        <h1 className='text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400 tracking-tight'>
          Vendor Approvals
        </h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">Review and manage pending vendor applications.</p>
      </div>

      {/* --- Desktop Table --- */}
      <div className='hidden md:block relative z-10 w-full overflow-hidden bg-white/2 border border-white/5 rounded-4xl shadow-2xl backdrop-blur-xl'>
        {/* ... (Your exact existing table code goes here, it remains unchanged) ... */}
        <table className='w-full text-left border-collapse'>
          <thead className='bg-black/40 border-b border-white/5'>
            <tr className="text-xs uppercase tracking-wider text-gray-500">
              <th className='p-6 font-medium'>Vendor</th>
              <th className='p-6 font-medium'>Shop Details</th>
              <th className='p-6 font-medium'>Contact</th>
              <th className='p-6 font-medium'>Status</th>
              <th className='p-6 font-medium text-right'>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/2">
            {pendingVendors.length === 0 ? (
              <tr>
                <td colSpan={5} className='p-16 text-center'>
                  <div className="flex flex-col items-center justify-center text-gray-500 gap-3">
                    <div className="w-16 h-16 rounded-full bg-white/2 flex items-center justify-center mb-2">
                      <LuInbox size={32} className="opacity-50" />
                    </div>
                    <p className="text-lg font-medium text-gray-400">All caught up!</p>
                    <p className="text-sm">No pending vendor requests at the moment.</p>
                  </div>
                </td>
              </tr>
            ) : (
              pendingVendors.map((vendor, index) => (
                <tr className='hover:bg-white/2 transition-colors group' key={index}>
                  <td className='p-6'>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-violet-500/20 text-violet-400 font-bold">
                        {vendor?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-200">{vendor?.name}</span>
                    </div>
                  </td>
                  <td className='p-6 text-gray-300 flex items-center gap-2'>
                    <LuStore className="text-gray-500" /> {vendor?.shopName}
                  </td>
                  <td className='p-6 text-gray-400 text-sm'>{vendor?.phone}</td>
                  <td className='p-6'>
                    <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20'>
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                      {vendor?.verificationStatus}
                    </span>
                  </td>
                  <td className='p-6 text-right'>
                    <button
                      onClick={() => setSelectedVendor(vendor)}
                      className='px-5 py-2 rounded-xl bg-white/5 hover:bg-violet-600 border border-white/5 hover:border-violet-500 hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] text-sm font-medium transition-all duration-300'
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- Mobile Cards --- */}
      <div className='md:hidden flex flex-col gap-4 relative z-10'>
        {/* ... (Your exact existing mobile code goes here) ... */}
        {pendingVendors.length === 0 ? (
          <div className='bg-white/2 border border-white/5 rounded-4xl p-10 flex flex-col items-center justify-center text-center text-gray-500 mt-4'>
            <LuInbox size={40} className="mb-4 opacity-50" />
            <p className="text-lg font-medium text-gray-300">All caught up!</p>
            <p className="text-sm mt-1">No pending vendor requests.</p>
          </div>
        ) : (
          pendingVendors.map((vendor, index) => (
            <div className='bg-white/2 border border-white/5 rounded-3xl p-5 space-y-4 backdrop-blur-md shadow-lg' key={index}>
              <div className='flex justify-between items-start'>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30 text-violet-400 font-bold">
                    {vendor?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-200'>{vendor?.name}</h3>
                    <p className="text-xs text-gray-500">{vendor?.shopName}</p>
                  </div>
                </div>
                <span className='px-2.5 py-1 rounded-full text-[10px] font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20 uppercase tracking-wider'>
                  {vendor.verificationStatus}
                </span>
              </div>
              <button
                className='w-full bg-white/5 hover:bg-violet-600 border border-white/5 text-white text-sm py-3 rounded-xl transition-all duration-300 font-medium'
                onClick={() => setSelectedVendor(vendor)}
              >
                Review Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* --- Interactive Review Modal --- */}
      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4'
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className='bg-[#0a0a0c] border border-white/10 shadow-2xl rounded-[2.5rem] w-full max-w-md overflow-hidden relative flex flex-col'
            >
              {/* Dynamic Header Glow based on state */}
              <div className={`absolute top-0 inset-x-0 h-32 pointer-events-none transition-colors duration-500 ${rejectedModel ? 'bg-linear-to-b from-red-600/20 to-transparent' : 'bg-linear-to-b from-violet-600/20 to-transparent'}`} />

              <div className="p-8 relative z-10">
                <AnimatePresence mode="wait">

                  {/* VIEW 2: REJECTION REASON FORM */}
                  {rejectedModel ? (
                    <motion.div
                      key="reject-view"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col h-full"
                    >
                      <button
                        onClick={() => setRejectedModel(false)}
                        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-4 w-fit"
                      >
                        <LuArrowLeft size={16} /> Back to details
                      </button>

                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-400"><LuLoaderCircle size={20} /></div>
                        <h3 className='text-2xl font-bold text-white'>Reject Application</h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-6">Please provide a reason. This will be sent to <span className="text-white font-medium">{selectedVendor.name}</span>.</p>

                      <textarea
                        value={rejectedReason}
                        onChange={(e) => setRejectedReason(e.target.value)}
                        placeholder="e.g., GST number is invalid or blurry documents..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all resize-none min-h-35"
                      />

                      <div className='flex gap-3 mt-6'>
                        <button
                          disabled={rejectLoading || !rejectedReason.trim()}
                          onClick={handleReject}
                          className='flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                        >
                          {rejectLoading ? <ClipLoader size={18} color='#fff' /> : 'Confirm Rejection'}
                        </button>
                      </div>
                    </motion.div>
                  ) : (

                    /* VIEW 1: VENDOR DETAILS */
                    <motion.div
                      key="details-view"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className='text-2xl font-bold mb-6 text-white'>Vendor Review</h3>

                      <div className='space-y-4 text-sm'>
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/2 border border-white/2">
                          <div className="p-2 bg-white/5 rounded-xl text-gray-400"><LuUser size={18} /></div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Owner Name</p>
                            <p className="font-medium text-gray-200">{selectedVendor.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/2 border border-white/2">
                          <div className="p-2 bg-white/5 rounded-xl text-gray-400"><LuStore size={18} /></div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Shop Name</p>
                            <p className="font-medium text-gray-200">{selectedVendor.shopName}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/2 border border-white/2">
                          <div className="p-2 bg-white/5 rounded-xl text-gray-400"><LuMail size={18} /></div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Email Address</p>
                            <p className="font-medium text-gray-200">{selectedVendor.email}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/2 border border-white/2">
                            <div className="p-2 bg-white/5 rounded-xl text-gray-400"><LuPhone size={18} /></div>
                            <div className="overflow-hidden">
                              <p className="text-xs text-gray-500 mb-0.5">Phone</p>
                              <p className="font-medium text-gray-200 truncate">{selectedVendor.phone}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/2 border border-white/2">
                            <div className="p-2 bg-white/5 rounded-xl text-gray-400"><LuFileText size={18} /></div>
                            <div className="overflow-hidden">
                              <p className="text-xs text-gray-500 mb-0.5">GST No.</p>
                              <p className="font-medium text-gray-200 truncate uppercase">{selectedVendor.gstNumber}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/2 border border-white/2">
                          <div className="p-2 bg-white/5 rounded-xl text-gray-400 shrink-0"><LuMapPin size={18} /></div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Business Address</p>
                            <p className="font-medium text-gray-200 leading-relaxed">{selectedVendor.shopAddress}</p>
                          </div>
                        </div>
                      </div>

                      {/* Modal Actions */}
                      <div className='flex flex-col sm:flex-row gap-3 mt-8'>
                        <button
                          disabled={loading || rejectLoading}
                          onClick={handleApproved}
                          className='flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 py-3 rounded-xl text-sm font-semibold transition-colors'
                        >
                          {loading ? <ClipLoader size={18} color='#10b981' /> : <><LuCheck size={18} /> Approve</>}
                        </button>

                        <button
                          disabled={loading || rejectLoading}
                          onClick={openRejectReasonArea}
                          className='flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 py-3 rounded-xl text-sm font-semibold transition-colors'
                        >
                          <LuCircle size={18} /> Reject
                        </button>
                      </div>

                      <button
                        onClick={closeModel}
                        disabled={loading || rejectLoading}
                        className='w-full mt-3 bg-white/5 hover:bg-white/10 text-gray-300 py-3 rounded-xl text-sm font-medium transition-colors border border-white/5'
                      >
                        Cancel & Close
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VendorApproval
