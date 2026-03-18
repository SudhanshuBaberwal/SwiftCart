import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User, { IUser } from "@/model/user.model";
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
    const { vendorId, status, rejectReason } = await req.json();
    if (!vendorId || !status) {
      return NextResponse.json(
        { success: false, message: "All Fields Are Required" },
        { status: 400 },
      );
    }
    const vendor = await User.findById(vendorId);
    if (!vendor) {
      return NextResponse.json(
        { success: false, message: "NO Vendor Found" },
        { status: 400 },
      );
    }
    if (status === "approved") {
      vendor.verificationStatus = "approved";
      vendor.isApproved = true;
      ((vendor.approvedAt = new Date()), (vendor.rejectedReason = undefined));
    }
    if (status === "rejected") {
      vendor.verificationStatus = "rejected";
      vendor.isApproved = false;
      vendor.rejectedReason =
        rejectReason || "Rejected By Admin. Contect Admin";
    }
    await vendor.save();
    return NextResponse.json(
      { success: true, message: "Vendor Status Updated" },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in update vendor status API : ", error);
    return NextResponse.json(
      { success: false, message: "Server Error in Update Vendor Status" },
      { status: 500 },
    );
  }
};
