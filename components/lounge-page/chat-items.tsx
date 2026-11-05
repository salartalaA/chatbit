import { Music, Play, SmilePlus } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";

interface Message {
  content?: string;
  id: number;
  image: string;
  isOwn: boolean;
  name: string;
  reactions: {
    emoji: string;
    count: number;
  }[];
  role?: string;
  time: string;
  track?: {
    artist: string;
    image: string;
    title: string;
  };
  type: "text" | "voice" | "track";
}

const messages: Message[] = [
  {
    id: 1,
    type: "text",
    isOwn: true,
    name: "DJ Zephyr",
    image: "/man-1.jpg",
    role: "dj",
    time: "11:08 PM",
    content:
      "Welcome everyone to the Midnight Lo-Fi Lounge! 🎧 Feel free to queue your favorite tracks or record voice notes anytime.",
    reactions: [
      { emoji: "❤️", count: 2 },
      { emoji: "✨", count: 1 },
    ],
  },
  {
    id: 2,
    type: "text",
    isOwn: false,
    name: "Maya Lin",
    image: "/woman-1.jpg",
    time: "12:03 AM",
    content:
      "Loving the synchronized vibe! Audio sounds crisp across both tabs.",
    reactions: [{ emoji: "🔥", count: 2 }],
  },
  {
    id: 3,
    type: "voice",
    isOwn: false,
    name: "CyberSam",
    image: "/man-2.jpg",
    time: "12:34 AM",
    reactions: [{ emoji: "🎧", count: 1 }],
  },
  {
    id: 4,
    type: "track",
    isOwn: true,
    name: "DJ Zephyr",
    image: "/man-1.jpg",
    role: "dj",
    time: "01:25 AM",
    track: {
      image: "/music-02.jpg",
      title: "Evin Aghasi-Che Shod -musicdel.ir",
      artist: "DJ Zephyr",
    },
    reactions: [],
  },
];

const waveform = [20, 40, 70, 90, 50, 30, 80, 60, 40, 30, 70, 80, 50, 20];

export default function ChatItems() {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="space-y-3">
        {messages.map((message) => (
          <div
            className={`group border-border relative flex items-start gap-3 rounded-lg border p-3 transition-all duration-150 ${
              message.isOwn
                ? "bg-secondary/20 ml-6 md:ml-12"
                : "bg-card hover:bg-muted/30 mr-6 md:mr-12"
            }`}
            key={message.id}
          >
            <Avatar className="size-10 shrink-0 rounded-full border border-white/20 shadow-md">
              <AvatarImage
                alt={message.name}
                className="object-cover"
                src={message.image}
              />

              <AvatarFallback className="text-sm font-bold tracking-wider">
                {message.name
                  .split(" ")
                  .map((part) => part.charAt(0))
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-foreground truncate text-xs font-semibold">
                  {message.name}
                </span>

                {message.role && (
                  <Badge
                    className={
                      message.isOwn
                        ? "bg-primary text-primary-foreground hover:bg-primary/80 text-micro! rounded-md px-2 py-0.5 leading-none font-semibold tracking-normal shadow-2xs"
                        : "text-micro! rounded-md px-2 py-0.5 leading-none font-semibold tracking-normal"
                    }
                    variant={message.isOwn ? "default" : "secondary"}
                  >
                    {message.role}
                  </Badge>
                )}

                <span className="text-muted-foreground text-micro! ml-auto font-mono">
                  {message.time}
                </span>
              </div>

              {message.type === "text" && (
                <p className="text-foreground/90 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
                  {message.content}
                </p>
              )}

              {message.type === "voice" && (
                <div className="mt-1">
                  <div className="bg-card text-card-foreground border-border flex max-w-[280px] items-center gap-3 rounded-lg border p-2.5 shadow-2xs transition-all sm:max-w-[320px]">
                    <button
                      className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full shadow-2xs transition-transform active:scale-95"
                      title="Play voice note"
                      type="button"
                    >
                      <Play className="ml-0.5 h-4 w-4 fill-current" />
                    </button>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex h-6 cursor-pointer items-center gap-[3px]">
                        {waveform.map((height, index) => (
                          <div
                            className="flex-1 rounded-full transition-all duration-150"
                            // biome-ignore lint/suspicious/noArrayIndexKey: Need for waves
                            key={index}
                            style={{
                              height: `${height}%`,
                              backgroundColor:
                                index < 6 ? "var(--primary)" : "var(--muted)",
                            }}
                          />
                        ))}
                      </div>

                      <div className="text-muted-foreground text-micro flex items-center justify-between font-mono">
                        <span>0:03</span>

                        <button
                          className="bg-muted text-foreground hover:bg-accent text-nano cursor-pointer rounded-sm px-1.5 py-0.5 font-semibold transition-colors"
                          type="button"
                        >
                          1x
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {message.type === "track" && (
                <div className="bg-muted/70 border-border mt-2 flex max-w-sm items-center justify-between rounded-lg border p-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Image
                      alt={message.track?.title ?? "Track cover"}
                      className="border-border h-9 w-9 rounded-md border object-cover"
                      height={150}
                      src={message.track?.image ?? message.image}
                      width={150}
                    />

                    <div className="min-w-0">
                      <p className="text-muted-foreground text-nano font-semibold tracking-wide uppercase">
                        Shared track
                      </p>
                      <p className="text-foreground truncate text-xs font-semibold">
                        {message.track?.title}
                      </p>
                      <p className="text-muted-foreground text-micro truncate">
                        {message.track?.artist}
                      </p>
                    </div>
                  </div>

                  <button
                    className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-md p-1.5 transition-colors"
                    title="Play track"
                    type="button"
                  >
                    <Music className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {message.reactions.map((reaction) => (
                  <button
                    className={`flex cursor-pointer items-center gap-1 rounded-md border px-2 py-0.5 text-xs transition-colors ${
                      message.isOwn
                        ? "border-border bg-muted text-muted-foreground hover:text-foreground"
                        : "border-primary bg-primary/10 text-foreground font-semibold"
                    }`}
                    key={reaction.emoji}
                    type="button"
                  >
                    <span>{reaction.emoji}</span>
                    <span className="text-nano font-mono">
                      {reaction.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ring-foreground/10 bg-card absolute top-2 right-2 flex items-center gap-0.5 rounded-md p-1 opacity-0 shadow-xs ring transition-opacity group-hover:opacity-100">
              {["❤️", "🔥", "✨"].map((emoji) => (
                <button
                  className="hover:bg-muted flex h-6 w-6 cursor-pointer items-center justify-center rounded text-xs transition-colors"
                  key={emoji}
                  type="button"
                >
                  {emoji}
                </button>
              ))}

              <Popover>
                <PopoverTrigger
                  render={
                    <button
                      className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-6 w-6 cursor-pointer items-center justify-center rounded transition-colors"
                      type="button"
                    >
                      <SmilePlus className="h-3.5 w-3.5" />
                    </button>
                  }
                />

                <PopoverContent
                  align="end"
                  className="flex w-fit flex-row items-center gap-1 p-1"
                  side="bottom"
                  sideOffset={8}
                >
                  {["❤️", "🔥", "✨", "🎧", "⚡", "👏"].map((emoji) => (
                    <button
                      className="hover:bg-muted flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-sm"
                      key={emoji}
                      type="button"
                    >
                      {emoji}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
