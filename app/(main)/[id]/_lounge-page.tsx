"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ChatInput from "@/components/lounge-page/chat-input";
import ChatItem from "@/components/lounge-page/chat-items";
import LoungeHeader from "@/components/lounge-page/lounge-header";
import { MembersSidebar } from "@/components/lounge-page/members-sidebar";
import type { Room } from "@/generated/prisma/client";
import { socket } from "@/lib/socket";

type JoinRoomResponse =
  | {
      success: false;
      message: string;
      code: "ROOM_NOT_FOUND" | "FORBIDDEN" | "AUTHORIZATION_FAILED";
    }
  | {
      success: true;
      message: string;
      roomId: string;
    };

export default function LoungePage({
  room,
}: {
  room: Omit<Room, "passwordEncrypted">;
}) {
  const { id: roomId } = useParams<{ id: string }>();
  const router = useRouter();

  const [pendingPassword, setPendingPassword] = useState<string | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  const hasConsumedAccess = useRef(false);
  const hasAttemptedJoin = useRef(false);

  // Consume the one-time password from sessionStorage.
  useEffect(() => {
    // biome-ignore lint/suspicious/noUnnecessaryConditions: Intentional
    if (hasConsumedAccess.current) {
      return;
    }

    hasConsumedAccess.current = true;

    const password = sessionStorage.getItem("pending-room-password");

    sessionStorage.removeItem("pending-room-password");

    setPendingPassword(password);
    setIsCheckingAccess(false);
  }, []);

  // Connect to Socket.IO and attempt to join the room.
  useEffect(() => {
    if (isCheckingAccess) {
      return;
    }

    const handleConnectError = (error: Error) => {
      toast.error(
        error.message === "UNAUTHORIZED"
          ? "You must log in to join this room."
          : "Unable to connect to the server."
      );

      router.replace("/");
    };

    const handleConnect = () => {
      // Prevent duplicate join attempts, including Socket.IO reconnections.

      // biome-ignore lint/suspicious/noUnnecessaryConditions: Intentional
      if (hasAttemptedJoin.current) {
        return;
      }

      hasAttemptedJoin.current = true;

      socket
        .timeout(5000)
        .emit(
          "room:join",
          roomId,
          pendingPassword ?? "",
          (error: Error | null, response: JoinRoomResponse) => {
            if (error) {
              toast.error("Unable to join room.");
              router.replace("/");
              return;
            }

            if (!response.success) {
              toast.error(response.message);
              router.replace("/");
              return;
            }

            setIsJoined(true);
            toast.success("Joined room successfully");
          }
        );
    };

    socket.on("connect_error", handleConnectError);
    socket.on("connect", handleConnect);

    socket.connect();

    return () => {
      socket.off("connect_error", handleConnectError);
      socket.off("connect", handleConnect);
      socket.disconnect();
    };
  }, [isCheckingAccess, pendingPassword, roomId, router]);

  if (isCheckingAccess || !isJoined) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <p className="text-muted-foreground text-sm">
          {isCheckingAccess ? "Checking access..." : "Joining room..."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="bg-background relative m-4 flex min-h-0 flex-1 flex-col">
          <LoungeHeader room={room} />
          <ChatItem />
        </div>

        <ChatInput />
      </div>

      <MembersSidebar />
    </>
  );
}
