import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    const session = await auth();

    if (!session || !session.user?.email || !session.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized User" },
        { status: 400 },
      );
    }

    const user = await User.findById(session.user.id).populate("cart.product");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User Not Found" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: true, cart: user.cart },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in Cart Get API");
    return NextResponse.json(
      { success: false, message: "Error in Cart Get API" },
      { status: 500 },
    );
  }
};
