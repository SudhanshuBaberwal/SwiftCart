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
        { success: false, message: "Unauthorized access" },
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
        { success: false, message: "Order not found" },
        { status: 400 },
      );
    }

    if (order.orderStatus === "cencelled") {
      return NextResponse.json(
        { success: false, message: "Cencelled order cannot be returned" },
        { status: 400 },
      );
    }

    if (order.orderStatus === "returned") {
      return NextResponse.json(
        { success: false, message: "Order already returned" },
        { status: 400 },
      );
    }

    if (order.orderStatus !== "delivered") {
      return NextResponse.json(
        { success: false, message: "Only delivered orders can be returned" },
        { status: 400 },
      );
    }

    let returnAmount = 0;
    for (const item of order.prodcuts) {
      returnAmount += item.price * item.quantity;
    }

    order.orderStatus = "returned";
    order.returnedAmount = returnAmount;
    await order.save();

    return NextResponse.json(
      { success: true, message: "Order returned successfully" , order },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in return order API : ", error);
    return NextResponse.json(
      { success: false, message: "Error in return order API" },
      { status: 500 },
    );
  }
};
