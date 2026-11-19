"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { Room } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { type CreateRoomInput, createRoomSchema } from "@/schemas/room.schema";

type CreateRoomActions =
  | {
      success: true;
      roomId: string;
    }
  | {
      success: false;
      message: string;
    };

export async function createRoom(
  newRoomData: CreateRoomInput
): Promise<CreateRoomActions> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "UNAUTHORIZED",
    };
  }

  const validateRoomData = createRoomSchema.safeParse(newRoomData);

  if (!validateRoomData.success) {
    return {
      success: false,
      message: "Invalid room data",
    };
  }
  try {
    const safeNewRoomData = validateRoomData.data;

    const expiresAt =
      safeNewRoomData.duration === "TEMPORARY"
        ? new Date(
            Date.now() +
              Number(safeNewRoomData.durationMinutes ?? "15") * 60_000
          )
        : null;

    const passwordEncrypted =
      safeNewRoomData.visibility === "PRIVATE" ? crypto.randomUUID() : null;

    const room = await prisma.room.create({
      data: {
        category: safeNewRoomData.category,
        duration: safeNewRoomData.duration,
        title: safeNewRoomData.title,
        visibility: safeNewRoomData.visibility,
        description: safeNewRoomData.description || null,
        expiresAt,
        tags: safeNewRoomData.tags,
        djs: {
          connect: {
            id: session.user.id,
          },
        },
        passwordEncrypted,
        ownerId: session.user.id,
      },
    });

    revalidatePath("/(main)", "layout");

    return {
      success: true,
      roomId: room.id,
    };
  } catch (error) {
    console.error("Failed to create room:", error);

    return {
      success: false,
      message: "Failed to create room. Please try again.",
    };
  }
}

type GetRoomsResult =
  | {
      success: false;
      message: string;
    }
  | {
      success: true;
      rooms: Omit<Room, "passwordEncrypted">[];
    };

export async function getRooms(): Promise<GetRoomsResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "UNAUTHORIZED",
    };
  }

  try {
    const rooms = await prisma.room.findMany({
      orderBy: {
        createdAt: "desc",
      },
      omit: {
        passwordEncrypted: true,
      },
    });

    return {
      success: true,
      rooms,
    };
  } catch (error) {
    console.error("Failed to fetch rooms:", error);

    return {
      success: false,
      message: "Failed to fetch rooms. Please try again.",
    };
  }
}

type GetRoomPasswordResult =
  | {
      success: true;
      password: string;
    }
  | {
      success: false;
      message: string;
    };

export async function getRoomPassword(
  roomId: string
): Promise<GetRoomPasswordResult> {
  if (!roomId) {
    return {
      success: false,
      message: "Room ID is required.",
    };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "Unauthorized.",
    };
  }

  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    select: {
      ownerId: true,
      passwordEncrypted: true,
    },
  });

  if (!room) {
    return {
      success: false,
      message: "Room not found.",
    };
  }

  if (room.ownerId !== session.user.id) {
    return {
      success: false,
      message: "You are not authorized to access this password.",
    };
  }

  if (!room.passwordEncrypted) {
    return {
      success: false,
      message: "This room does not have a password.",
    };
  }

  return {
    success: true,
    password: room.passwordEncrypted,
  };
}

export async function deleteMyRoom(roomId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false as const,
        message: "You must be logged in.",
      };
    }

    const result = await prisma.room.deleteMany({
      where: {
        id: roomId,
        ownerId: session.user.id,
      },
    });

    if (result.count === 0) {
      return {
        success: false as const,
        message: "Room not found or you are not the owner.",
      };
    }

    revalidatePath("/(main)", "layout");

    return {
      success: true as const,
      message: "Room deleted successfully.",
    };
  } catch {
    return {
      success: false as const,
      message: "Failed to delete room.",
    };
  }
}

export async function deleteExpiredRooms() {
  await prisma.room.deleteMany({
    where: {
      expiresAt: {
        lte: new Date(),
      },
    },
  });

  return {
    success: true,
  };
}

export async function expireRoom(roomId: string) {
  const result = await prisma.room.deleteMany({
    where: {
      id: roomId,
      expiresAt: {
        lte: new Date(),
      },
    },
  });

  return {
    success: result.count > 0,
  };
}
