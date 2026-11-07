import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

type RoomAuthorizationResult =
  | {
      authorized: true;
    }
  | {
      authorized: false;
      code: "ROOM_NOT_FOUND" | "FORBIDDEN";
      message: string;
    };

export async function GET(
  _: Request,
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
        code: "FORBIDDEN",
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

  if (existingRoom.ownerId !== session.user.id) {
    return NextResponse.json(
      {
        authorized: false,
        code: "FORBIDDEN",
        message: "FORBIDDEN",
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
