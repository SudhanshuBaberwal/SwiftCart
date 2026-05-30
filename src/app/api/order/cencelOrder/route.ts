import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import Order from "@/model/order.mode";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized Access" },
        { status: 400 },
      );
    }

    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId is not found" },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order Not Found" },
        { status: 400 },
      );
    }
    order.orderStatus = "cencelled";
    order.cencelledAt = new Date();
    await order.save();

    return NextResponse.json(
      { success: true, message: "order cencelled successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in cencel order API : ", error);
    return NextResponse.json(
      { success: false, message: "Error in cencel order API" },
      { status: 500 },
    );
  }
};
