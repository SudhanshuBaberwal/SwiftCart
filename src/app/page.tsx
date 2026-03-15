import { auth } from '@/auth'
import AdminDashBoard from '@/components/Admin/AdminDashBoard'
import EditRoleAndPhone from '@/components/EditRoleAndPhone'
import Navbar from '@/components/Navbar'
import UserDashBoard from '@/components/User/UserDashBoard'
import VendorDashboard from '@/components/Vendor/VendorDashboard'
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
  const plainUsre = JSON.parse(JSON.stringify(user))
  return (
    <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900 font-sans flex-col'>
      <Navbar user={plainUsre} />
      {user?.role === "user" ? (<UserDashBoard />) : user?.role === "vendor" ? (<VendorDashboard />) : (<AdminDashBoard />)}
    </div>
  )
}

export default Home
