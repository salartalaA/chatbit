import { redirect } from "next/navigation";
import LoungePage from "@/app/(main)/[id]/_lounge-page";
import prisma from "@/lib/prisma";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: roomId } = await params;

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

  return <LoungePage room={room} />;
}
