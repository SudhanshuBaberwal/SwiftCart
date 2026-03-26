import connectDB from "@/lib/connectDB"
import Product from "@/model/product.model"
import { NextResponse } from "next/server"

export const GET = async () => {
    try {
        await connectDB()
        const product = await Product.find().populate("vendor" , "name email shopName").sort({createdAt : -1})
        if (!product){
            return NextResponse.json({success : false , message : "Product Not Found"} , {status : 400})
        }
        return NextResponse.json({product} , {status : 201})
    } catch (error) {
        console.log("Error in get all products")
        return NextResponse.json({success : false , message : "Error in Get All Products API"} , {status : 201})
    }
}