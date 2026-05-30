import connectDB from "@/lib/connectDB";
import Order from "@/model/order.mode";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { otp, orderId } = await req.json();
    if (!orderId || !otp) {
      return NextResponse.json(
        { success: false, message: "OrderId and otp is required" },
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

    if (
      order.deliveryOtp !== otp ||
      !order.otpExpiresAt ||
      order.otpExpiresAt < new Date()
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid or expires otp" },
        { status: 400 },
      );
    }

    order.orderStatus = "delivered";
    order.isPaid = true;
    order.deliveryDate = new Date();
    order.deliveryOtp = undefined;
    order.otpExpiresAt = undefined;
    await order.save();

    return NextResponse.json(
      { success: true, message: "Order Delivered" },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in verify delivery otp API : ", error);
    return NextResponse.json(
      { success: false, message: "Error in verify delivery otp API" },
      { status: 500 },
    );
  }
};
