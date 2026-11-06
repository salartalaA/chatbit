"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { type CreateRoomInput, createRoomSchema } from "@/schemas/room.schema";

type CreateRoomActions =
  | {
      success: true;
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

    await prisma.room.create({
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

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to create room:", error);

    return {
      success: false,
      message: "Failed to create room. Please try again.",
    };
  }
}
