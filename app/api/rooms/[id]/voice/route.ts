import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteObject, uploadObject } from "@/lib/storage";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_DURATION = 180;
const ALLOWED_MIME_TYPES = ["audio/webm"];
const DURATION_REGEX = /^\d+$/u;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(
  request: Request,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: roomId } = await params;

    if (!roomId) {
      return NextResponse.json({ error: "Invalid room ID" }, { status: 400 });
    }

    const room = await prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const durationValue = formData.get("duration");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Audio file is required" },
        { status: 400 }
      );
    }

    if (
      typeof durationValue !== "string" ||
      !DURATION_REGEX.test(durationValue)
    ) {
      return NextResponse.json(
        { error: "Invalid audio duration" },
        { status: 400 }
      );
    }

    const duration = Number(durationValue);

    if (
      !Number.isSafeInteger(duration) ||
      duration <= 0 ||
      duration > MAX_DURATION
    ) {
      return NextResponse.json(
        { error: "Audio duration must be between 1 and 180 seconds" },
        { status: 400 }
      );
    }

    const mimeType = file.type.split(";")[0].trim().toLowerCase();

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        { error: "Unsupported audio format" },
        { status: 415 }
      );
    }

    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Audio file must be between 1 byte and 5 MB" },
        { status: 400 }
      );
    }

    const audioKey = `rooms/${roomId}/${randomUUID()}.webm`;

    const audioBuffer = new Uint8Array(await file.arrayBuffer());

    await uploadObject({
      key: audioKey,
      body: audioBuffer,
      contentType: mimeType,
    });

    try {
      const message = await prisma.message.create({
        data: {
          type: "VOICE",
          content: null,
          audioKey,
          duration,
          roomId,
          senderId: session.user.id,
        },
        select: {
          id: true,
          type: true,
          content: true,
          audioKey: true,
          duration: true,
          roomId: true,
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

      return NextResponse.json(
        {
          message: {
            ...message,
            createdAt: message.createdAt.toISOString(),
          },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error("Failed to create voice message:", error);

      try {
        await deleteObject({ key: audioKey });
      } catch (cleanupError) {
        console.error("Failed to delete orphaned audio:", cleanupError);
      }

      return NextResponse.json(
        { error: "Failed to create voice message" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Voice upload failed:", error);

    return NextResponse.json(
      { error: "Failed to upload voice message" },
      { status: 500 }
    );
  }
}
