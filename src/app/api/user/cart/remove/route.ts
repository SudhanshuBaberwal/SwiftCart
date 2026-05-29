import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unathorized " }, { status: 400 });
    }

    const { productId } = await req.json();
    if (!productId ) {
      return NextResponse.json({ message: "Invalid Data" }, { status: 400 });
    }

    const user = await User.findById(session.user.id);
    if (!user || !user.cart) {
      return NextResponse.json(
        { message: "User's cart is not found" },
        { status: 400 },
      );
    }

    user.cart = user.cart.filter(
      (i: any) => i.product.toString() !== productId.toString(),
    );

    await user.save();

    return NextResponse.json({ message: "Cart item removed" }, { status: 201 });
  } catch (error) {
    console.log("Error in remove quantity API : ", error);
    return NextResponse.json(
      { message: "Error in remove API" },
      { status: 500 },
    );
  }
};
