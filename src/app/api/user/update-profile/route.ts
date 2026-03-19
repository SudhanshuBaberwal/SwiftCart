import { auth } from "@/auth";
import uploadOnCloundinary from "@/lib/cloudinary";
import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.email || !session.user.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized User" },
        { status: 400 },
      );
    }
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const file = formData.get("image") as File | null;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "Name or Phone Are Required" },
        { status: 400 },
      );
    }
    let imageUrl;
    if (file) {
      imageUrl = await uploadOnCloundinary(file);
    }
    const updatedUser = await User.findOneAndUpdate(
      { email: session?.user.email },
      {
        name,
        phone,
        image: imageUrl,
      },
      { new: true },
    );
    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User Not Found" },
        { status: 400 },
      );
    }
    return NextResponse.json({ success: true, updatedUser }, { status: 201 });
  } catch (error) {
    console.log("Error in Update User Profile API : " , error)
    return NextResponse.json({success : false , message : "Error in Update Profile API "})
  }
};