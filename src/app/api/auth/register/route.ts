import connectDB from "@/lib/connectDB";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await connectDB();
  try {
    const { name, email, password } = await req.json();
    const existUser = await User.findOne({ email });
    if (existUser) {
      return NextResponse.json(
        { success: false, message: "User is already exist" },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be atleast 6 characters" },
        { status: 400 },
      );
    }
    const hashedPassword = await bcrypt.hash(password, 20);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return NextResponse.json(
      { success: true, message: "User created successfully", user },
      { status: 201 },
    );
  } catch (error) {
    console.log("register error : ", error);
    return NextResponse.json(
      { success: false, message: "error in registeration", error },
      { status: 400 },
    );
  }
};
