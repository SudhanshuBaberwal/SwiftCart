'use client'
import { AppDispatch } from '@/redux/store'
import { setAllOrdersData } from '@/redux/userSlice'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const UseGetAllOrdersData = () => {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        const fetchAllOrders = async () => {
            try {
                const result = await axios.get("/api/order/allOrders")
                console.log(result.data)
                dispatch(setAllOrdersData(result.data))
            } catch (error) {
                console.log(error)
                dispatch(setAllOrdersData([]))
            }
        }
        fetchAllOrders()
    }, [])
}

export default UseGetAllOrdersData
