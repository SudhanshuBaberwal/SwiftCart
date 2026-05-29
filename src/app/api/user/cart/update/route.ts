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

    const { productId, quantity } = await req.json();
    if (!productId || quantity < 1) {
      return NextResponse.json({ message: "Invalid Data" }, { status: 400 });
    }

    const user = await User.findById(session.user.id);
    if (!user || !user.cart) {
      return NextResponse.json(
        { message: "User's cart is not found" },
        { status: 400 },
      );
    }

    const item = user.cart.find(
      (i: any) => i.product.toString() === productId.toString(),
    );

    if (!item) {
      return NextResponse.json(
        { message: "Product Not Found" },
        { status: 400 },
      );
    }

    item.quantity = quantity;
    await user.save();

    return NextResponse.json({ message: "Quantity Updated" }, { status: 201 });
  } catch (error) {
    console.log("Error in update quantity API : ", error);
    return NextResponse.json(
      { message: "Error in updated quantity" },
      { status: 500 },
    );
  }
};
