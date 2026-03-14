import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const { role, phone } = await req.json();
    const session = await auth();
    const user = await User.findOneAndUpdate(
      { email: session?.user?.email },
      { phone, role },
      { new: true },
    );
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User Not Found" },
        { status: 400 },
      );
    }
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    console.log("Error in edit role and phone : ", error);
    return NextResponse.json(
      { success: false, message: "Error in edit role and phone" },
      { status: 500 },
    );
  }
};
