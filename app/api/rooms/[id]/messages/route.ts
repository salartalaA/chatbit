import { timingSafeEqual } from "node:crypto";
import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const MAX_MESSAGE_LENGTH = 5000;
const MAX_HISTORY_LIMIT = 50;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.SOCKET_SERVER_SECRET;
  const receivedSecret = request.headers.get("x-socket-server-secret");

  if (!(secret && receivedSecret)) {
    return false;
  }

  const expected = Buffer.from(secret);
  const received = Buffer.from(receivedSecret);

  if (expected.length !== received.length) {
    return false;
  }

  return timingSafeEqual(expected, received);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: roomId } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("content" in body) ||
    !("userId" in body)
  ) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { content, userId } = body;

  if (
    typeof content !== "string" ||
    typeof userId !== "string" ||
    !roomId ||
    !userId.trim() ||
    !content.trim() ||
    content.length > MAX_MESSAGE_LENGTH
  ) {
    return NextResponse.json(
      { error: "Invalid message data" },
      { status: 400 }
    );
  }

  try {
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        roomId,
        senderId: userId,
      },
      select: {
        id: true,
        content: true,
        roomId: true,
        type: true,
        audioKey: true,
        duration: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: {
        ...message,
        createdAt: message.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Failed to create message:", error);

    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: roomId } = await params;

  if (!roomId) {
    return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: "desc" },
      take: MAX_HISTORY_LIMIT,
      select: {
        id: true,
        content: true,
        roomId: true,
        duration: true,
        audioKey: true,
        type: true,
        createdAt: true,
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      messages: messages.reverse().map((message) => ({
        ...message,
        createdAt: message.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Failed to fetch messages:", error);

    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
