import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Missing rzp webhook secret" },
      { status: 404 }
    );
  }
  //get raw body
  const body = await req.text();
  //get rzp signature
  const razorpaySignature = req.headers.get("x-razorpay-signature");
  if (!razorpaySignature) {
    return NextResponse.json(
      { error: "Missing rzp signature" },
      { status: 400 }
    );
  }
  //verify the signature
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }
  //converting raw body to json
  const event = JSON.parse(body);
  try {
    const eventType = event.event as string;
    //subscription activation
    if (eventType === "subscription.activated") {
      const subscriptionEntity = event.payload.subscription.entity;
      const notes = subscriptionEntity.notes || {};
      const userId = notes.userId as string | undefined;
      const creatorId = notes.creatorId as string | undefined;
      const subscriptionId = notes.subscriptionId as string | undefined;

      if (!userId || !creatorId || !subscriptionId) {
        return NextResponse.json(
          { error: "Missing metadata in subscription notes" },
          { status: 400 }
        );
      }
      //activate subscription
       await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: "ACTIVE",
          startDate: new Date(),
        },
      });
      //record the payment
       await prisma.payment.create({
        data: {
          userId,
          creatorId,
          amount: subscriptionEntity.amount / 100, // paise → rupees
          platformFee: 0, // calculate later if needed
          creatorEarning: subscriptionEntity.amount / 100,
          providerPaymentId: subscriptionEntity.id,
          status: "SUCCESS",
        },
      });
      console.log(`Subscription activated | user=${userId} creator=${creatorId}`)
    }
    return NextResponse.json({status:200})
  } catch (error) {
    console.error("Webhook error", error);
    return NextResponse.json(
      {
        error: "webhook handler error",
      },
      { status: 500 }
    );
  }
}
