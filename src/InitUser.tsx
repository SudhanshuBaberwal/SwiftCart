'use client'
import React from 'react'
import UseGetCurrentUser from './hooks/UseGetCurrentUser'
import UseGetAllVendors from './hooks/UseGetAllVendors'
import UseGetAllProductsData from './hooks/UseGetAllProductsData'
import UseGetAllOrdersData from './hooks/UseGetAllOrdersData'

const InitUser = () => {
  UseGetCurrentUser()
  UseGetAllVendors()
  UseGetAllProductsData()
  UseGetAllOrdersData()
  return null
}

export default InitUser
