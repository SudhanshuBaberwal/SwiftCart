import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import Order from "@/model/order.mode";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 400 },
      );
    }
    const orders = await Order.find()
      .populate("buyer", "name email phone image")
      .populate("productVendor", "name shopName email")
      .populate({
        path: "products.product",
        model: "Product",
        select: "title image1 price category stock vendor replacementDays",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, orders }, { status: 201 });
  } catch (error) {
    console.log("Error in allorders cod API : ", error);
    return NextResponse.json(
      { success: false, message: "Error in allorder cod API" },
      { status: 500 },
    );
  }
};
