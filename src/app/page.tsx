import { auth } from '@/auth'
import EditRoleAndPhone from '@/components/EditRoleAndPhone'
import connectDB from '@/lib/connectDB'
import User from '@/model/user.model'
import { redirect } from 'next/navigation'
import React from 'react'

const Home = async () => {
  await connectDB()
  const session = await auth()
  const user = await User.findById(session?.user?.id)
  if (!user){
    redirect("/login")
  }
  const inComplete = !user.role || !user.phone || (!user.phone && user.role == "user")
  if (inComplete){
    return (
      <EditRoleAndPhone />
    )
  }
  return (
    <div>
      
    </div>
  )
}

export default Home
