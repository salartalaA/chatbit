"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { UpdateUsernameResponse } from "@/types/rooms";

export async function updateUsername(
  name: string
): Promise<UpdateUsernameResponse> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      code: "UNAUTHORIZED",
      message: "UNAUTHORIZED",
    };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2 || trimmedName.length > 30) {
    return {
      success: false,
      code: "INVALID_NAME",
      message: "Name must be between 2 and 30 characters.",
    };
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: trimmedName,
      },
      select: {
        name: true,
      },
    });

    return {
      success: true,
      message: "Username updated successfully.",
      name: user.name,
    };
  } catch (error) {
    console.error("Failed to update username:", error);

    return {
      success: false,
      code: "UPDATE_FAILED",
      message: "Failed to update username.",
    };
  }
}
