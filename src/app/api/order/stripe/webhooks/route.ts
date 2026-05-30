import connectDB from "@/lib/connectDB";
import Order from "@/model/order.mode";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = async (req: NextRequest) => {
  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig!,
      process.env.STRIPE_WEBHOOKS_KEY!,
    );
  } catch (error) {
    console.log("Signature verification failed : ", error);
  }
  if (event?.type === "checkout.session.completed") {
    const session = event.data.object;
    await connectDB();
    await Order.findById(session?.metadata?.orderId, {
      isPaid: true,
    });
    return NextResponse.json(
      { success: true, message: "Payment Done Successfully", revived: true },
      { status: 200 },
    );
  }
};
