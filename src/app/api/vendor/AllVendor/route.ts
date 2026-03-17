import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    const vendors = await User.find({ role: "vendor" }).sort({ createdAt: -1 });
    if (!vendors) {
      return NextResponse.json(
        { success: false, message: "Vendors Not Found" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { vendors },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error in Get All vendor API" },
      { status: 500 },
    );
  }
};
