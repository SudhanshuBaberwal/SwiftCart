'use client'
import { AppDispatch } from '@/redux/store'
import { setAllProductsData } from '@/redux/vendorSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const UseGetAllProductsData = () => {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(()=> {
        const fetchAllProduct = async () => {
            try {
                const result = await axios.get("/api/vendor/allProducts")
                // console.log(result.data)
                dispatch(setAllProductsData(result.data))
            } catch (error) {
                console.log(error)
                dispatch(setAllProductsData([]))
            }
        }
        fetchAllProduct()
    } , [])
}

export default UseGetAllProductsData
