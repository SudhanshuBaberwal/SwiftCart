import { auth } from "@/auth";
import uploadOnCloundinary from "@/lib/cloudinary";
import connectDB from "@/lib/connectDB";
import Product from "@/model/product.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized User" },
        { status: 400 },
      );
    }

    const formdata = await req.formData();
    const productId = formdata.get("productId");

    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json(
        { message: "Product Not Found" },
        { status: 400 },
      );
    }

    if (String(product.vendor) !== String(session.user.id)) {
      return NextResponse.json(
        { message: "Not allowed to edit this product" },
        { status: 400 },
      );
    }

    //  const formdata = await req.formData();
    const title = formdata.get("title") as string;
    const description = formdata.get("description") as string;
    const price = Number(formdata.get("price"));
    const stock = Number(formdata.get("stock"));
    const category = formdata.get("category") as string;
    const isWearable = formdata.get("isWearable") === "true";
    const sizes = formdata.getAll("sizes") as string[];         // updated 
    const replacementDays = Number(formdata.get("replacementDays") || 0);
    const freeDelivery = formdata.get("freeDelivery") === "true";
    const warranty = (formdata.get("warranty") as string) || "No Warranty";
    const payOnDelivery = formdata.get("payOnDelivery") === "true";
    const detailsPoints = formdata.getAll("detailsPoints");
    const img1 = formdata.get("image1") as Blob | null;
    const img3 = formdata.get("image3") as Blob | null;
    const img4 = formdata.get("image4") as Blob | null;
    const img2 = formdata.get("image2") as Blob | null;
    const status = formdata.get("")

    let image1 = product.image1;
    let image2 = product.image2;
    let image3 = product.image3;
    let image4 = product.image4;

    if (img1) {
      image1 = await uploadOnCloundinary(img1);
    }
    if (img2) {
      image2 = await uploadOnCloundinary(img2);
    }
    if (img3) {
      image3 = await uploadOnCloundinary(img3);
    }
    if (img4) {
      image4 = await uploadOnCloundinary(img4);
    }

    if (isWearable && sizes.length === 0) {
      return NextResponse.json(
        { success: false, message: "Sizes Are Required For Wearable products" },
        { status: 400 },
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
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
        
        
      },
      { new: true },
    );

    return NextResponse.json(updatedProduct, { status: 201 });
  } catch (error) {
    console.log("Error i8n Update Product Route");
    return NextResponse.json({ message: "update product error" });
  }
};