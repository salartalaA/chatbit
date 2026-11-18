export type RoomAuthorizationResult =
  | {
      authorized: true;
    }
  | {
      authorized: false;
      code:
        | "ACCESS_DENIED"
        | "ROOM_NOT_FOUND"
        | "INVALID_REQUEST"
        | "UNAUTHORIZED";
      message: string;
    };

export type SendMessageResponse =
  | {
      success: true;
    }
  | {
      success: false;
      code: "INVALID_REQUEST" | "NOT_IN_ROOM" | "MESSAGE_FAILED";
      message: string;
    };

export interface MessageDTO {
  content: string;
  createdAt: string;
  id: string;
  roomId: string;
  sender: {
    id: string;
    name: string;
    image: string | null;
  };
}

export type MessageHistoryResponse =
  | {
      success: true;
      messages: MessageDTO[];
    }
  | {
      success: false;
      code: "INVALID_REQUEST" | "NOT_IN_ROOM" | "HISTORY_FAILED";
      message: string;
    };

export type JoinRoomResponse =
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

export interface TypingUser {
  id: string;
  name: string;
}
