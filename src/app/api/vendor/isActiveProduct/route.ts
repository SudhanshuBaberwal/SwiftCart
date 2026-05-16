import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.id || !session.user.email) {
      return NextResponse.json(
        { message: "Unauthorized Access" },
        { status: 400 },
      );
    }

    const { productId, isActive } = await req.json();
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        isActive,
      },
      { new: true },
    );

    if (!product) {
      return NextResponse.json(
        { message: "Product Not Found" },
        { status: 400 },
      );
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log("Error in isActive Route");
    return NextResponse.json(
      { message: "Error in isActive Controller : ", error },
      { status: 500 },
    );
  }
};
