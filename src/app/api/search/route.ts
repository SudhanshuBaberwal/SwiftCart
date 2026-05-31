import connectDB from "@/lib/connectDB";
import Product from "@/model/product.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();
    const category = searchParams.get("category")?.trim();
    const shop = searchParams.get("shop")?.trim();

    // 1. Establish core baseline constraints
    const filter: any = {
      isActive: true,
      verificationStatus: "approved",
    };

    // 2. Direct filter drop-down selections
    if (category && category !== "all") {
      filter.category = category;
    }

    if (shop && shop !== "all") {
      filter.vendor = new mongoose.Types.ObjectId(shop);
    }

    // 3. GLOBAL SEARCH QUERY LOGIC (FIXED)
    if (query) {
      let matchingVendorIds: mongoose.Types.ObjectId[] = [];

      try {
        // Safe access to your registered Mongoose model
        const VendorModel = mongoose.models.User || mongoose.model("User");
        
        const matchingVendors = await VendorModel.find(
          { shopName: { $regex: query, $options: "i" } },
          "_id"
        );
        
        matchingVendorIds = matchingVendors.map((v) => v._id as mongoose.Types.ObjectId);
      } catch (vendorError) {
        console.error("Vendor pre-query subsearch failed:", vendorError);
      }

      // Build out the match array safely
      const orConditions: any[] = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } }
      ];

      // If matching vendors were found by shopName, append them to the match list
      if (matchingVendorIds.length > 0) {
        orConditions.push({ vendor: { $in: matchingVendorIds } });
      }

      // CRITICAL FIX: Attach conditions only if the array contains search fields.
      // If none match, force an impossible query condition so it safely returns 0 items
      if (orConditions.length > 0) {
        filter.$or = orConditions;
      } else {
        filter._id = null; 
      }
    }

    // 4. Query the database natively
    const products = await Product.find(filter).populate(
      "vendor",
      "shopName email"
    );

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Critical Search Routine Mismatch:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Search Route Query Error",
      },
      { status: 500 },
    );
  }
};