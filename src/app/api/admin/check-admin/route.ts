import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectDB();
    const admin = await User.findOne({ role: "admin" });
    return NextResponse.json({ success: true, exists: !!admin });
  } catch (error) {
    console.log("Error in check admin : ", error);
    return NextResponse.json(
      { success: false, message: "check admin error" },
      { status: 500 },
    );
  }
};
