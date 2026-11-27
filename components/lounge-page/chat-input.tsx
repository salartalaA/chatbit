"use client";

import { Mic, Send, Smile, Trash2 } from "lucide-react";
import { type SubmitEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { VoiceRecorder } from "@/components/layout/footer/voice-recorder";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { socket } from "@/lib/socket";
import type { SendMessageResponse } from "@/types/rooms";

const emojis = [
  "✨",
  "🔥",
  "❤️",
  "🎧",
  "⚡",
  "☕",
  "🚀",
  "🎶",
  "✌️",
  "🎉",
  "🪐",
  "💫",
];

const TYPING_STOP_DELAY = 2000;

interface RecordedVoice {
  blob: Blob;
  duration: number;
}

interface VoiceMessage {
  audioKey: string;
  content: null;
  createdAt: string;
  duration: number;
  id: string;
  roomId: string;
  sender: {
    id: string;
    name: string;
    image: string | null;
  };
  type: "VOICE";
}

type UploadVoiceResponse = { message: VoiceMessage } | { error: string };

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export default function ChatInput({ roomId }: { roomId: string }) {
  const [msg, setMsg] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [recordedVoice, setRecordedVoice] = useState<RecordedVoice | null>(
    null
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTyping = useRef(false);

  const trimmedMsg = msg.trim();

  useEffect(() => {
    if (!recordedVoice) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(recordedVoice.blob);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [recordedVoice]);

  const stopTyping = () => {
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
    }

    // biome-ignore lint/suspicious/noUnnecessaryConditions: Intentional
    if (!isTyping.current) {
      return;
    }

    isTyping.current = false;
    socket.emit("typing:stop", roomId);
  };

  const handleMessageChange = (value: string) => {
    setMsg(value);

    if (value.trim() === "") {
      stopTyping();
      return;
    }

    // biome-ignore lint/suspicious/noUnnecessaryConditions: Intentional
    if (!isTyping.current) {
      isTyping.current = true;
      socket.emit("typing:start", roomId);
    }

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      stopTyping();
    }, TYPING_STOP_DELAY);
  };

  const handleSendMessage = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (trimmedMsg === "") {
      return;
    }

    stopTyping();
    setMsg("");

    socket.emit(
      "message:send",
      { roomId, content: msg },
      (response: SendMessageResponse) => {
        if (response.success) {
          console.log("Message sent successfully");
          return;
        }

        switch (response.code) {
          case "INVALID_REQUEST":
            console.error("Invalid message:", response.message);
            break;

          case "NOT_IN_ROOM":
            console.error("You are not a member of this room");
            break;

          case "MESSAGE_FAILED":
            toast.error("Failed to send message");
            console.error("Failed to send message:", response.message);
            break;

          default:
            console.error("An unexpected error occurred");
            break;
        }
      }
    );
  };

  const handleStartRecording = () => {
    stopTyping();
    setRecordedVoice(null);
    setIsRecording(true);
  };

  const handleRecordingComplete = (blob: Blob, duration: number) => {
    setRecordedVoice({ blob, duration });
    setIsRecording(false);

    console.log("Voice recording completed:", {
      type: blob.type,
      size: blob.size,
      duration,
    });
  };

  const handleSendVoice = async () => {
    if (!recordedVoice || isUploading) {
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", recordedVoice.blob, "voice-message.webm");
    formData.append("duration", String(recordedVoice.duration));

    try {
      const response = await fetch(`/api/rooms/${roomId}/voice`, {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as UploadVoiceResponse;

      if (!response.ok) {
        throw new Error(
          "error" in data ? data.error : "Failed to upload voice message"
        );
      }

      if (!("message" in data)) {
        throw new Error("Invalid server response");
      }

      if (!socket.connected) {
        throw new Error("Socket connection is unavailable");
      }

      socket.emit("voice:created", data.message);

      console.log("Voice message uploaded:", data.message);

      setRecordedVoice(null);
      toast.success("Voice message uploaded successfully");
    } catch (error) {
      console.error("Voice upload failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload voice message"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleDiscardVoice = () => {
    if (isUploading) {
      return;
    }

    setRecordedVoice(null);
  };

  useEffect(
    () => () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }

      // biome-ignore lint/suspicious/noUnnecessaryConditions: Intentional
      if (isTyping.current) {
        socket.emit("typing:stop", roomId);
      }
    },
    [roomId]
  );

  const voicePreview =
    recordedVoice && previewUrl ? (
      <div className="bg-card text-card-foreground animate-in fade-in flex w-full items-center gap-3 rounded-lg border p-2.5 px-4 shadow-sm duration-150">
        <span className="text-muted-foreground font-mono text-xs font-semibold tabular-nums">
          {formatDuration(recordedVoice.duration)}
        </span>

        <audio
          className="h-8 min-w-0 flex-1"
          controls
          preload="metadata"
          src={previewUrl}
        >
          <track kind="captions" />
        </audio>

        <button
          className="text-muted-foreground hover:bg-accent hover:text-destructive inline-flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-md px-2 transition-colors disabled:pointer-events-none disabled:opacity-50"
          disabled={isUploading}
          onClick={handleDiscardVoice}
          title="Discard Voice Note"
          type="button"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-8 shrink-0 cursor-pointer items-center justify-center rounded-md px-3 transition-colors disabled:pointer-events-none disabled:opacity-50"
          disabled={isUploading}
          onClick={handleSendVoice}
          title="Send Voice Note"
          type="button"
        >
          {isUploading ? (
            <span className="text-xs">Uploading...</span>
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    ) : null;

  const chatForm = (
    <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
      <div className="relative flex flex-1 items-center">
        <Input
          autoComplete="off"
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border py-2 pr-20 pl-10 text-sm focus:ring-1 focus:outline-none"
          onChange={(e) => handleMessageChange(e.target.value)}
          placeholder="Message #Midnight Lo-Fi Cafe..."
          type="text"
          value={msg}
        />

        <Popover>
          <PopoverTrigger
            render={
              <button
                className="text-muted-foreground hover:text-foreground absolute left-3 cursor-pointer transition-colors"
                title="Add emoji"
                type="button"
              >
                <Smile className="h-4 w-4" />
              </button>
            }
          />

          <PopoverContent
            align="start"
            className="bg-popover text-popover-foreground border-border z-30 w-fit rounded-lg border p-1.5 shadow-md"
            side="top"
            sideOffset={8}
          >
            <div className="flex items-center gap-1">
              {emojis.map((emoji) => (
                <button
                  className="hover:bg-muted flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-base"
                  key={emoji}
                  type="button"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="text-muted-foreground absolute right-2.5 flex items-center gap-1">
          <button
            className="hover:bg-muted hover:text-foreground cursor-pointer rounded p-1 transition-colors"
            onClick={handleStartRecording}
            title="Record voice note"
            type="button"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-2xs transition-colors select-none disabled:pointer-events-none disabled:opacity-50"
        disabled={!trimmedMsg || trimmedMsg.length >= 5000}
        type="submit"
      >
        <Send className="mr-1 h-3.5 w-3.5" />
        <span>Send</span>
      </button>
    </form>
  );

  return (
    <div className="border-border bg-card relative border-t p-3">
      {isRecording && (
        <VoiceRecorder
          onCancel={() => setIsRecording(false)}
          onRecordingComplete={handleRecordingComplete}
        />
      )}

      {!isRecording && voicePreview}

      {!(isRecording || voicePreview) && chatForm}
    </div>
  );
}
