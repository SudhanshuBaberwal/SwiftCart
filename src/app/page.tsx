import { auth } from '@/auth'
import AdminDashBoard from '@/components/Admin/AdminDashBoard'
import EditRoleAndPhone from '@/components/EditRoleAndPhone'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import UserDashBoard from '@/components/User/UserDashBoard'
import EditVendorDetails from '@/components/Vendor/EditVendorDetails'
import VendorPage from '@/components/Vendor/VendorPage'
import connectDB from '@/lib/connectDB'
import User from '@/model/user.model'
import { redirect } from 'next/navigation'
import React from 'react'

const Home = async () => {
  await connectDB()
  const session = await auth()
  const user = await User.findById(session?.user?.id)
  if (!user) {
    redirect("/login")
  }
  const inComplete = !user.role || !user.phone || (!user.phone && user.role == "user")
  if (inComplete) {
    return (
      <EditRoleAndPhone />
    )
  }
  if (user?.role == "vendor"){
    const inCompleteDetains = !user.shopName || !user.shopAddress || !user.gstNumber
    if (inCompleteDetains){
      return <EditVendorDetails />
    }
  }
  const plainUsre = JSON.parse(JSON.stringify(user))
  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 font-sans flex-col'>
      <Navbar user={plainUsre} />
      {user?.role === "user" ? (<UserDashBoard />) : user?.role === "vendor" ? (<VendorPage user={plainUsre} />) : (<AdminDashBoard />)}
      <Footer user={plainUsre} />
    </div>
  )
}

export default Home
