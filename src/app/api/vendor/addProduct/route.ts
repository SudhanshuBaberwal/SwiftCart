import { auth } from "@/auth";
import VendorProduct from "@/components/Vendor/VendorProduct";
import uploadOnCloundinary from "@/lib/cloudinary";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product.model";
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

    const formdata = await req.formData();
    const title = formdata.get("title") as string;
    const description = formdata.get("description") as string;
    const price = Number(formdata.get("price"));
    const stock = Number(formdata.get("stock"));
    const category = formdata.get("category") as string;
    const isWearable = formdata.get("isWearable") === "true";
    const sizes = formdata.get("sizes") as string;
    const replacementDays = Number(formdata.get("replacementDays") || 0);
    const freeDelivery = formdata.get("freeDelivery") === "true";
    const warranty = (formdata.get("warranty") as string) || "No Warranty";
    const payOnDelivery = formdata.get("payOnDelivery") === "true";
    const detailsPoints = formdata.getAll("detailsPoints");
    const img1 = formdata.get("image1") as Blob;
    const img2 = formdata.get("image2") as Blob;
    const img3 = formdata.get("image3") as Blob;
    const img4 = formdata.get("image4") as Blob;

    if (!(img1 instanceof Blob) || !(img2 instanceof Blob) || !(img3 instanceof Blob) || !(img4 instanceof Blob)){
      return NextResponse.json({ success: false, message: "Invalid image1" }, { status: 400 });
    }

    if (
      !title ||
      !description ||
      !price ||
      !stock ||
      !category ||
      !img1 ||
      !img2 ||
      !img3 ||
      !img4
    ) {
      return NextResponse.json(
        { success: false, message: "All Fields Are Required" },
        { status: 400 },
      );
    }

    if (isWearable && sizes.length === 0) {
      return NextResponse.json(
        { success: false, message: "Sizes Are Required For Wearable products" },
        { status: 400 },
      );
    }

    const image1 = await uploadOnCloundinary(img1);
    const image2 = await uploadOnCloundinary(img2);
    const image3 = await uploadOnCloundinary(img3);
    const image4 = await uploadOnCloundinary(img4);

    const product = await Product.create({
      title,
      description,
      price,
      stock,
      isStockAvailable: stock > 0,
      image1,
      image2,
      image3,
      image4,
      category,
      vendor: session.user.id,
      isWearable,
      sizes: isWearable ? sizes : [],
      replacementDays,
      warranty,
      payOnDelivery,
      freeDelivery,
      detailsPoints,
      verificationStatus: "pending",
      isActive: false,
    });

    const p = await User.findByIdAndUpdate(
      session.user.id,
      {
        $push: { VendorProduct: product._id },
      },
      { new: true },
    );

    if (!p) {
      return NextResponse.json(
        { success: false, message: "Product Can't Added" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Product Added", product },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error in Product added API");
    return NextResponse.json(
      { success: false, message: "Error Occures in Product Occurs API" },
      { status: 500 },
    );
  }
};
