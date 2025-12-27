//same route as billing checkout as in ai saas
import Razorpay from "razorpay"
import { getCreatorContext } from "@/lib/creator-context";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // getting auth creator and membership
    const { user, creator } = await getCreatorContext(params.slug);

    // preventing duplicate active subscriptions
    const existing = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        creatorId: creator.id,
        status: "ACTIVE",
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already subscribed" },
        { status: 400 }
      );
    }

    // at start we create status to pending bcz in prisma we set default to active when created but when creating we are making it pending and after payment succes we make it to active
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        creatorId: creator.id,
        planName: "PRO",
        status: "PENDING",
        usageLimit: 100,
      },
    });

    // creating rzp subscription
    const rzpSubscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID!,
      customer_notify: 1,
      notes: {
        userId: user.id,
        creatorId: creator.id,
        subscriptionId: subscription.id,
      },
    });

    // data to frontend returning
    return NextResponse.json({
      key: process.env.RAZORPAY_KEY_ID,
      razorpaySubscriptionId: rzpSubscription.id,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Subscribe failed" },
      { status: 500 }
    );
  }
}
