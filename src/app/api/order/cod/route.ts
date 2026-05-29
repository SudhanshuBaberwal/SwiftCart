import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import Order from "@/model/order.mode";
import Product from "@/model/product.model";
import User from "@/model/user.model";
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

    const userId = session.user.id;

    const {
      productId,
      quantity,
      address,
      amount,
      deliveryCharge,
      serviceCharge,
    } = await req.json();

    if (!productId || !quantity) {
      return NextResponse.json(
        { success: false, message: "ProductId or quantity required" },
        { status: 400 },
      );
    }

    if (
      !address.name ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.pincode
    ) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    if (
      typeof amount !== "number" ||
      typeof deliveryCharge !== "number" ||
      typeof serviceCharge !== "number"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid amount , delivery or service charge",
        },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);
    if (!user || !user.cart) {
      return NextResponse.json(
        { success: false, message: "User or cart not found" },
        { status: 400 },
      );
    }

    const cartItem = user.cart.find(
      (item: any) => item.product._id.toString() === productId.toString(),
    );
    if (!cartItem) {
      return NextResponse.json(
        { success: false, message: "Product not found in cart" },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product Not Found" },
        { status: 400 },
      );
    }

    if (product.stock < quantity) {
      return NextResponse.json(
        { success: false, message: `Insufficient stock for ${product.title}` },
        { status: 400 },
      );
    }

    const productsTotal = product.price * quantity;

    const order = await Order.create({
      buyer: userId,
      products: [
        {
          product: product._id,
          quantity,
          price: product.price,
        },
      ],
      productVendor: product.vendor,
      productTotal : productsTotal,
      deliveryCharge,
      serviceCharge,
      totalAmount: amount,

      paymentMethod: "cod",
      isPaid: false,
      orderStatus: "pending",
      returnedAmount: 0,

      address,
    });

    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: -quantity },
    });

    user.cart = user.cart.filter(
      (item: any) => item.product._id.toString() !== productId.toString(),
    );

    user.orders.push(order._id);
    await user.save();

    return NextResponse.json(
      { success: true, message: "Order Placed Successfully" , order },
      { status: 201 },
    );
  } catch (error) {
    console.log("Error in order cod API : ", error);
    return NextResponse.json(
      { success: false, message: "Error in order cod API" },
      { status: 500 },
    );
  }
};
