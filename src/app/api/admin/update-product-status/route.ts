import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product.model";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const session = await auth();
    const adminUser = await User.findById(session?.user?.id);
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Only Admin Can Approve Vendor or Admin Not Found",
        },
        { status: 403 },
      );
    }
    const { productId, status, rejectReason } = await req.json();
    if (!productId || !status) {
      return NextResponse.json(
        { success: false, message: "All Fields Are Required" },
        { status: 400 },
      );
    }
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "NO Product Found" },
        { status: 400 },
      );
    }
    if (status === "approved") {
      product.verificationStatus = "approved";
      //   product.isApproved = true;
      ((product.approvedAt = new Date()), (product.rejectedReason = undefined));
    }
    if (status === "rejected") {
      product.verificationStatus = "rejected";
      //   vendor.isApproved = false;
      product.rejectedReason =
        rejectReason || "Rejected By Admin. Contect Admin";
    }
    await product.save();
    return NextResponse.json(
      { success: true, message: "Product Status Updated" },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in update product status API : ", error);
    return NextResponse.json(
      { success: false, message: "Server Error in Update product Status" },
      { status: 500 },
    );
  }
};
