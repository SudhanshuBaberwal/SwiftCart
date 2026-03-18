'use client'
import { AppDispatch } from '@/redux/store'
import { setAllVendorsData } from '@/redux/vendorSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const UseGetAllVendors = () => {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        const getAllVendorsData = async () => {
            try {
                const result = await axios.get("/api/vendor/AllVendor")
                console.log(result.data.vendors)
                dispatch(setAllVendorsData(result.data.vendors))

            } catch (error) {
                console.log(error)
                dispatch(setAllVendorsData([]))
            }
        }
        getAllVendorsData()
    }, [])
}

export default UseGetAllVendors
