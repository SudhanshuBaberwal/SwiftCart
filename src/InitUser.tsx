'use client'
import React from 'react'
import UseGetCurrentUser from './hooks/UseGetCurrentUser'
import UseGetAllVendors from './hooks/UseGetAllVendors'
import UseGetAllProductsData from './hooks/UseGetAllProductsData'

const InitUser = () => {
  UseGetCurrentUser()
  UseGetAllVendors()
  UseGetAllProductsData()
  return null
}

export default InitUser
