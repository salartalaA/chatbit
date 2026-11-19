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
import type {
  JoinRoomResponse,
  MessageDTO,
  RoomMember,
  TypingUser,
} from "@/types/rooms";

interface LoungePageProps {
  currentUserId: string;
  room: Omit<Room, "passwordEncrypted">;
}

function getTypingText(users: TypingUser[]) {
  if (users.length === 0) {
    return "";
  }

  if (users.length === 1) {
    return `${users[0].name} is typing...`;
  }

  if (users.length === 2) {
    return `${users[0].name} and ${users[1].name} are typing...`;
  }

  if (users.length === 3) {
    return `${users[0].name}, ${users[1].name} and ${users[2].name} are typing...`;
  }

  return `${users.length} people are typing...`;
}

export default function LoungePage({ room, currentUserId }: LoungePageProps) {
  const { id: roomId } = useParams<{ id: string }>();
  const router = useRouter();

  const [pendingPassword, setPendingPassword] = useState<string | null>(null);
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [members, setMembers] = useState<RoomMember[]>([]);

  const hasConsumedAccess = useRef(false);
  const hasAttemptedJoin = useRef(false);

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

    const handleNewMessage = (message: MessageDTO) => {
      if (message.roomId !== roomId) {
        return;
      }

      setMessages((previousMessages) => {
        if (previousMessages.some((item) => item.id === message.id)) {
          return previousMessages;
        }

        return [...previousMessages, message];
      });
    };

    const handleJoinedUser = (member: RoomMember) => {
      setMembers((prev) => {
        const existingUser = prev.some(
          (existingMember) => existingMember.id === member.id
        );

        if (existingUser) {
          return prev;
        }

        return [...prev, member];
      });
    };

    const handleTypingUpdate = (payload: { users: TypingUser[] }) => {
      setTypingUsers(payload.users.filter((user) => user.id !== currentUserId));
    };

    const handleLeftUser = ({ userId }: { userId: string }) => {
      setMembers((prev) => prev.filter((member) => member.id !== userId));
    };

    const handleNameUpdated = (payload: { userId: string; name: string }) => {
      setMembers((prev) =>
        prev.map((member) =>
          member.id === payload.userId
            ? { ...member, name: payload.name }
            : member
        )
      );

      setMessages((prev) =>
        prev.map((message) =>
          message.sender.id === payload.userId
            ? {
                ...message,
                sender: {
                  ...message.sender,
                  name: payload.name,
                },
              }
            : message
        )
      );

      setTypingUsers((prev) =>
        prev.map((user) =>
          user.id === payload.userId ? { ...user, name: payload.name } : user
        )
      );
    };

    const handleConnect = () => {
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
          (joinError: Error | null, joinResponse: JoinRoomResponse) => {
            if (joinError) {
              toast.error("Unable to join room.");
              router.replace("/");
              return;
            }

            if (!joinResponse.success) {
              toast.error(joinResponse.message);
              router.replace("/");
              return;
            }

            setMembers(joinResponse.members);
            setMessages(joinResponse.messages);

            setIsJoined(true);
            toast.success("Joined room successfully");
          }
        );
    };

    const handleDeleteRoom = () => {
      router.push("/");
    };

    socket.on("connect_error", handleConnectError);
    socket.on("connect", handleConnect);
    socket.on("message:new", handleNewMessage);
    socket.on("typing:update", handleTypingUpdate);
    socket.on("member:joined", handleJoinedUser);
    socket.on("member:left", handleLeftUser);
    socket.on("user:name-updated", handleNameUpdated);
    socket.on("room:deleted", handleDeleteRoom);

    socket.connect();

    return () => {
      socket.off("connect_error", handleConnectError);
      socket.off("connect", handleConnect);
      socket.off("message:new", handleNewMessage);
      socket.off("typing:update", handleTypingUpdate);
      socket.off("member:joined", handleJoinedUser);
      socket.off("member:left", handleLeftUser);
      socket.off("user:name-updated", handleNameUpdated);
      socket.off("room:deleted", handleDeleteRoom);
      socket.disconnect();
    };
  }, [isCheckingAccess, pendingPassword, roomId, router, currentUserId]);

  if (isCheckingAccess || !isJoined) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <p className="text-muted-foreground text-sm">
          {isCheckingAccess ? "Checking access..." : "Joining room..."}
        </p>
      </div>
    );
  }

  const typingText = getTypingText(typingUsers);

  return (
    <>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="bg-background relative m-4 flex min-h-0 flex-1 flex-col">
          <LoungeHeader room={room} />

          <ChatItem currentUserId={currentUserId} messages={messages} />
        </div>

        {typingText && (
          <div className="text-muted-foreground min-h-6 px-4 pb-1 text-xs">
            {typingText}
          </div>
        )}

        <ChatInput roomId={roomId} />
      </div>

      <MembersSidebar
        currentUserId={currentUserId}
        members={members}
        ownerId={room.ownerId}
      />
    </>
  );
}
