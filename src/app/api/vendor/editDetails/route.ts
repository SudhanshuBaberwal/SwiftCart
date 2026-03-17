import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { shopName, shopAddress, gstNumber } = await req.json();
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Anauthorized access" },
        { status: 400 },
      );
    }
    const user = await User.findOneAndUpdate(
      { email: session.user?.email },
      {
        shopName,
        shopAddress,
        gstNumber,
        verificationStatus: "pending",
        requestAt: new Date(),
      },
      { new: true },
    );
    if (!user) {
      return NextResponse.json(
        { message: "User is not found" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Vendor Details Submitted", user },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in Edit vendor details API : ", error);
    return NextResponse.json(
      { message: "Error in Edit vendor details API" },
      { status: 400 },
    );
  }
};
