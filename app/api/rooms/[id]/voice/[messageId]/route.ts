import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getSignedObjectUrl } from "@/lib/storage";

interface RouteContext {
  params: Promise<{
    id: string;
    messageId: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId, messageId } = await params;

    if (!(roomId && messageId)) {
      return NextResponse.json(
        { error: "Invalid room or message ID" },
        { status: 400 }
      );
    }

    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        roomId,
        type: "VOICE",
        isDeleted: false,
        audioKey: {
          not: null,
        },
      },
      select: {
        audioKey: true,
      },
    });

    if (!message?.audioKey) {
      return NextResponse.json(
        { error: "Voice message not found" },
        { status: 404 }
      );
    }

    const url = await getSignedObjectUrl({
      key: message.audioKey,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Failed to generate voice URL:", error);

    return NextResponse.json(
      { error: "Failed to generate voice URL" },
      { status: 500 }
    );
  }
}
