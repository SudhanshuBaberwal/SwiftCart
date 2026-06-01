import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "UnAuthorized Access" },
        { status: 400 },
      );
    }

    const { withUserId } = await req.json();

    if (!withUserId) {
      return NextResponse.json(
        { success: false, message: "UserId is required" },
        { status: 400 },
      );
    }
    const user = await User.findById(session.user.id).populate(
      "chats.with",
      "name image role shopName",
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 400 },
      );
    }

    const chat = user.chats?.find(
      (c: any) => String(c.with?._id) === String(withUserId),
    );
    return NextResponse.json({
      success: true,
      messages: chat?.messages || [],
    });
  } catch (error) {
    console.log("Error in get chat API : ", error);
    return NextResponse.json(
      { message: "Error in get chat API : " },
      { status: 500 },
    );
  }
};
