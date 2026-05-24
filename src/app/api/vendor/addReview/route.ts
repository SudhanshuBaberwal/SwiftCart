import { auth } from "@/auth";
import uploadOnCloundinary from "@/lib/cloudinary";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized Access" },
        { status: 400 },
      );
    }

    const userId = session.user.id;
    const formData = await req.formData();
    const productId = formData.get("productId") as string;
    const rating = Number(formData.get("rating"));
    const comment = formData.get("comment") as string;
    const file = formData.get("image") as File | null;

    if (!productId) {
      return NextResponse.json(
        { message: "ProductId is required" },
        { status: 400 },
      );
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    if (!comment || comment.trim().length === 0) {
      return NextResponse.json(
        { message: "Comment is Required" },
        { status: 400 },
      );
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product Not Found" },
        { status: 400 },
      );
    }

    let imageUrl;

    if (file) {
      imageUrl = await uploadOnCloundinary(file);
    }

    product.reviews.push({
      rating,
      user: userId,
      comment,
      image: imageUrl,
    });

    await product.save();
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.log("Error in addReviews section : ", error);
    return NextResponse.json(
      { message: "error in addReviews section" },
      { status: 500 },
    );
  }
};
