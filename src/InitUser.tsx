'use client'
import React from 'react'
import UseGetCurrentUser from './hooks/UseGetCurrentUser'
import UseGetAllVendors from './hooks/UseGetAllVendors'

const InitUser = () => {
  UseGetCurrentUser()
  UseGetAllVendors()
  return null
}

export default InitUser
