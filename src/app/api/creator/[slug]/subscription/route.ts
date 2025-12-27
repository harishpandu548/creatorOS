import { getCreatorContext } from "@/lib/creator-context";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { user, creator } = await getCreatorContext(params.slug);
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        creatorId: creator.id,
        status: "ACTIVE",
      },
      select: {
        id: true,
        creatorId: true,
        planName: true,
        status: true,
        usageLimit: true,
      },
    });
    // return the subscription
    return NextResponse.json(subscription ?? null);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
