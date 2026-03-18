import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { shopName, shopAddress, gstNumber } = await req.json();
    if (!shopName || !shopAddress || !gstNumber) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 400 },
      );
    }
    const updatedVendor = await User.findOneAndUpdate(
      { email: session.user?.email },
      {
        shopName,
        shopAddress,
        gstNumber,
        verificationStatus: "pending",
        requestAt: new Date(),
        rejectedReason: null,
        isApproved: false,
      },
      { new: true },
    );
    if (!updatedVendor) {
      return NextResponse.json(
        { message: "Vendor is not found" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Verifiy Again Successfully", updatedVendor },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in verify again API : ", error);
    return NextResponse.json(
      { message: "Error in verify again API" },
      { status: 400 },
    );
  }
};
