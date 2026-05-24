import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized Access" },
        { status: 400 },
      );
    }

    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product id is required" },
        { status: 400 },
      );
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { message: "User is not found" },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product is not found" },
        { status: 400 },
      );
    }

    const existingProduct = user.cart.find(
      (item: any) => item.product.toString() === productId.toString(),
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      user.cart.push({
        product: product._id,
        quantity,
      });
    }

    await user.save();

    return NextResponse.json(
      { message: "Product added to cart" },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in cart add route : ", error);
    return NextResponse.json(
      { message: "Error in cart add route" },
      { status: 400 },
    );
  }
};
