import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    const session = await auth();
    const email = session?.user?.email;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "user not found" },
        { status: 400 },
      );
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) { 
    return NextResponse.json(
      { success: false, message: "Get Current User Error" },
      { status: 400 },
    );
  }
};
