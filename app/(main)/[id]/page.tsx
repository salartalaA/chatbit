"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import ChatInput from "@/components/lounge-page/chat-input";
import ChatItem from "@/components/lounge-page/chat-items";
import LoungeHeader from "@/components/lounge-page/lounge-header";
import { MembersSidebar } from "@/components/lounge-page/members-sidebar";
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

export default function LoungePage() {
  const { id: roomId } = useParams<{ id: string }>();

  useEffect(() => {
    const handleConnect = () => {
      socket
        .timeout(5000)
        .emit(
          "room:join",
          roomId,
          (error: unknown, response: JoinRoomResponse) => {
            if (error) {
              toast.error("Room join request timed out.");
              return;
            }

            if (!response.success) {
              toast.error(response.message);
              return;
            }

            toast.success("Joined room successfully");
          }
        );
    };

    const handleConnectError = (error: Error) => {
      if (error.message === "UNAUTHORIZED") {
        toast.error("You must log in to join this room.");
        return;
      }

      toast.error("Unable to connect to the server.");
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);

    socket.connect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.disconnect();
    };
  }, [roomId]);

  return (
    <>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="bg-background relative m-4 flex min-h-0 flex-1 flex-col">
          <LoungeHeader />
          <ChatItem />
        </div>

        <ChatInput />
      </div>

      <MembersSidebar />
    </>
  );
}
