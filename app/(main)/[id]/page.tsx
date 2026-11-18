import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoungePage from "@/app/(main)/[id]/_lounge-page";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: roomId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null;
  }

  const currentUserId = session.user.id;

  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
    omit: {
      passwordEncrypted: true,
    },
  });

  if (!room) {
    redirect("/");
  }

  return <LoungePage currentUserId={currentUserId} room={room} />;
}
