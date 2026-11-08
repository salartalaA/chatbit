import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { RoomAuthorizationResult } from "@/types/rooms";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<RoomAuthorizationResult>> {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      {
        authorized: false,
        code: "UNAUTHORIZED",
        message: "UNAUTHORIZED",
      },
      { status: 401 }
    );
  }

  const existingRoom = await prisma.room.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      ownerId: true,
      passwordEncrypted: true,
      visibility: true,
    },
  });

  if (!existingRoom) {
    return NextResponse.json(
      {
        authorized: false,
        code: "ROOM_NOT_FOUND",
        message: "ROOM NOT FOUND",
      },
      { status: 404 }
    );
  }

  const isOwner = existingRoom.ownerId === session.user.id;

  if (existingRoom.visibility === "PUBLIC" || isOwner) {
    return NextResponse.json(
      {
        authorized: true,
      },
      { status: 200 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        authorized: false,
        code: "INVALID_REQUEST",
        message: "Invalid request body",
      },
      { status: 400 }
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body) ||
    ("password" in body &&
      body.password !== null &&
      typeof body.password !== "string")
  ) {
    return NextResponse.json(
      {
        authorized: false,
        code: "INVALID_REQUEST",
        message: "Invalid password",
      },
      { status: 400 }
    );
  }

  const password =
    "password" in body && typeof body.password === "string"
      ? body.password
      : null;

  if (!(existingRoom.passwordEncrypted && password)) {
    return NextResponse.json(
      {
        authorized: false,
        code: "ACCESS_DENIED",
        message: "Incorrect room password",
      },
      { status: 403 }
    );
  }

  const isPasswordCorrect = password === existingRoom.passwordEncrypted;

  if (!isPasswordCorrect) {
    return NextResponse.json(
      {
        authorized: false,
        code: "ACCESS_DENIED",
        message: "Incorrect room password",
      },
      { status: 403 }
    );
  }

  return NextResponse.json(
    {
      authorized: true,
    },
    { status: 200 }
  );
}
