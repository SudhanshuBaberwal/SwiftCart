// import { auth } from "@/auth";
// import connectDB from "@/lib/connectDB";
// import { sendDeliveryOtpEmail } from "@/lib/mailer";
// import Order from "@/model/order.mode";
// import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import connectDB from "@/lib/connectDB";
import { sendDeliveryOtpEmail } from "@/lib/mailer";
import Order from "@/model/order.mode";
import { NextRequest, NextResponse } from "next/server";

// export const POST = async (req: NextRequest) => {
//   try {
//     await connectDB();
//     const session = await auth();

//     if (!session || !session.user || !session.user.id) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized Access" },
//         { status: 400 },
//       );
//     }

//     const { orderId, status } = await req.json();
//     const order = await Order.findById(orderId).populate("buyer");

//     if (!order) {
//       return NextResponse.json(
//         { success: false, message: "Order Not found" },
//         { status: 400 },
//       );
//     }

//     if (status === "confirmed" || status === "shipped") {
//       order.orderStatus = status;
//       order.save();
//       return NextResponse.json(
//         { message: "Order status updated successfully" },
//         { status: 200 },
//       );
//     }

//     if (status === "confirmed") {
//       const otp = Math.floor(1000 + Math.random() * 9000).toString();
//       console.log(otp)
//       order.deliveryOtp = otp;
//       order.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
//       await order.save();

//       const email = order.buyer?.email;
//       if (!email) {
//         return NextResponse.json(
//           { success: false, message: "Buyer email is not found" },
//           { status: 400 },
//         );
//       }

//       await sendDeliveryOtpEmail(email, otp);
//       return NextResponse.json(otp)
//     }

//     return NextResponse.json(
//       { success: false, message: "Invalid Status" },
//       { status: 400 },
//     );
//   } catch (error) {
//     console.log("Error in update-status API : ", error);
//     return NextResponse.json(
//       { success: false, message: "Error in update-status API" },
//       { status: 500 },
//     );
//   }
// };

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized Access" },
        { status: 401 },
      );
    }

    const { orderId, status } = await req.json();

    const order = await Order.findById(orderId).populate("buyer");

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order Not Found" },
        { status: 404 },
      );
    }

    // CONFIRMED
    if (status === "confirmed") {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();

      order.orderStatus = "confirmed";
      order.deliveryOtp = otp;
      order.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await order.save();

      const email = order.buyer?.email;

      if (!email) {
        return NextResponse.json(
          {
            success: false,
            message: "Buyer email not found",
          },
          { status: 400 },
        );
      }

      await sendDeliveryOtpEmail(email, otp);

      return NextResponse.json(
        {
          success: true,
          message: "Confirmed + OTP sent",
        },
        { status: 200 },
      );
    }

    // SHIPPED
    if (status === "shipped") {
      order.orderStatus = "shipped";

      await order.save();

      return NextResponse.json(
        {
          success: true,
          message: "Order shipped",
        },
        { status: 200 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid status",
      },
      { status: 400 },
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Error in update-status API",
      },
      { status: 500 },
    );
  }
};
