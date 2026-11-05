"use client";

import { Mic, Send, Smile } from "lucide-react";
import { PlaylistDialog } from "@/components/layout/footer/playlist-dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

export default function ChatInput() {
  return (
    <div className="border-border bg-card relative border-t p-3">
      <form className="flex items-center gap-2">
        <div className="relative flex flex-1 items-center">
          <Input
            autoComplete="off"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-ring w-full rounded-md border py-2 pr-20 pl-10 text-sm focus:ring-1 focus:outline-none"
            placeholder="Message #Midnight Lo-Fi Cafe..."
            type="text"
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
            <PlaylistDialog />

            <button
              className="hover:bg-muted hover:text-foreground cursor-pointer rounded p-1 transition-colors"
              title="Record voice note"
              type="button"
            >
              <Mic className="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-2xs transition-colors select-none disabled:pointer-events-none disabled:opacity-50"
          disabled
          type="submit"
        >
          <Send className="mr-1 h-3.5 w-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
