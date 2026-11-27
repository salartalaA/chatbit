"use client";

import { LoaderCircle, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MessageDTO } from "@/types/rooms";

interface ChatItemsProps {
  currentUserId: string;
  messages: MessageDTO[];
}

interface VoiceMessagePlayerProps {
  duration: number;
  messageId: string;
  roomId: string;
}

interface SignedUrlResponse {
  error?: string;
  url?: string;
}

const PLAYBACK_RATES = [1, 1.5, 2];

function formatMessageTime(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));
}

function formatAudioTime(seconds: number): string {
  const safeSeconds = Number.isFinite(seconds)
    ? Math.floor(Math.max(0, seconds))
    : 0;

  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function VoiceMessagePlayer({
  roomId,
  messageId,
  duration,
}: VoiceMessagePlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const shouldPlayRef = useRef(false);

  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = waveformRef.current;

    if (!container) {
      return;
    }

    const styles = getComputedStyle(container);

    const waveSurfer = WaveSurfer.create({
      container,
      height: 28,
      waveColor:
        styles.getPropertyValue("--muted-foreground").trim() || "#a1a1aa",
      progressColor: styles.getPropertyValue("--primary").trim() || "#71717a",
      cursorWidth: 0,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      normalize: true,
      interact: true,
    });

    waveSurferRef.current = waveSurfer;

    waveSurfer.on("ready", (loadedDuration) => {
      setAudioDuration(loadedDuration);
      setIsLoading(false);

      // biome-ignore lint/suspicious/noUnnecessaryConditions: Intentional
      if (shouldPlayRef.current) {
        shouldPlayRef.current = false;

        waveSurfer.play().catch(() => {
          setError("Failed to play audio");
        });
      }
    });

    waveSurfer.on("timeupdate", (time) => {
      setCurrentTime(time);
    });

    waveSurfer.on("play", () => {
      setIsPlaying(true);
    });

    waveSurfer.on("pause", () => {
      setIsPlaying(false);
    });

    waveSurfer.on("finish", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    waveSurfer.on("error", () => {
      shouldPlayRef.current = false;
      setIsLoading(false);
      setIsPlaying(false);
      setError("Failed to load audio");
    });

    return () => {
      shouldPlayRef.current = false;
      waveSurfer.destroy();
      waveSurferRef.current = null;
    };
  }, []);

  async function handleTogglePlayback() {
    const waveSurfer = waveSurferRef.current;

    if (!waveSurfer || isLoading) {
      return;
    }

    setError(null);

    if (waveSurfer.isPlaying()) {
      waveSurfer.pause();
      return;
    }

    if (signedUrl) {
      try {
        await waveSurfer.play();
      } catch {
        setError("Failed to play audio");
      }

      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/rooms/${encodeURIComponent(roomId)}/voice/${encodeURIComponent(messageId)}`
      );

      const data: SignedUrlResponse = await response.json();

      if (!(response.ok && data.url)) {
        throw new Error(data.error || "Failed to load voice message");
      }

      setSignedUrl(data.url);
      shouldPlayRef.current = true;

      await waveSurfer.load(data.url);
    } catch (playbackError) {
      shouldPlayRef.current = false;
      setIsLoading(false);

      setError(
        playbackError instanceof Error
          ? playbackError.message
          : "Failed to load audio"
      );
    }
  }

  function handlePlaybackRate() {
    const currentIndex = PLAYBACK_RATES.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % PLAYBACK_RATES.length;
    const nextRate = PLAYBACK_RATES[nextIndex];

    setPlaybackRate(nextRate);
    waveSurferRef.current?.setPlaybackRate(nextRate);
  }

  return (
    <div className="bg-card text-card-foreground border-border flex w-full max-w-[280px] items-center gap-3 rounded-lg border p-2.5 transition-colors sm:max-w-[320px]">
      <button
        aria-label={isPlaying ? "Pause voice note" : "Play voice note"}
        className="bg-primary text-primary-foreground hover:bg-primary/90 flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isLoading}
        onClick={handleTogglePlayback}
        title={isPlaying ? "Pause voice note" : "Play voice note"}
        type="button"
      >
        {isLoading && <LoaderCircle className="size-4 animate-spin" />}

        {!isLoading && isPlaying && <Pause className="size-4 fill-current" />}

        {!(isLoading || isPlaying) && (
          <Play className="ml-0.5 size-4 fill-current" />
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div
          className="h-7 w-full min-w-0 cursor-pointer overflow-hidden"
          ref={waveformRef}
        />

        <div className="text-muted-foreground text-micro flex items-center justify-between font-mono">
          <span>
            {formatAudioTime(currentTime > 0 ? currentTime : audioDuration)}
          </span>

          <button
            className="bg-muted text-foreground hover:bg-accent text-nano cursor-pointer rounded-sm px-1.5 py-0.5 font-semibold transition-colors"
            onClick={handlePlaybackRate}
            type="button"
          >
            {playbackRate}x
          </button>
        </div>

        {error && (
          <p className="text-destructive text-nano" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ChatItems({ messages, currentUserId }: ChatItemsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAutoScrollPaused = useRef(false);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastMessageId = messages.at(-1)?.id;

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const handleUserInteraction = () => {
      isAutoScrollPaused.current = true;

      if (pauseTimer.current) {
        clearTimeout(pauseTimer.current);
      }

      pauseTimer.current = setTimeout(() => {
        isAutoScrollPaused.current = false;
        pauseTimer.current = null;
      }, 2000);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Element)) {
        return;
      }

      if (event.target.closest('[data-slot="scroll-area-scrollbar"]')) {
        handleUserInteraction();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const scrollKeys = [
        "ArrowUp",
        "ArrowDown",
        "PageUp",
        "PageDown",
        "Home",
        "End",
        " ",
      ];

      if (scrollKeys.includes(event.key)) {
        handleUserInteraction();
      }
    };

    container.addEventListener("wheel", handleUserInteraction, true);
    container.addEventListener("touchmove", handleUserInteraction, true);
    container.addEventListener("pointerdown", handlePointerDown, true);
    container.addEventListener("keydown", handleKeyDown, true);

    return () => {
      container.removeEventListener("wheel", handleUserInteraction, true);
      container.removeEventListener("touchmove", handleUserInteraction, true);
      container.removeEventListener("pointerdown", handlePointerDown, true);
      container.removeEventListener("keydown", handleKeyDown, true);

      if (pauseTimer.current) {
        clearTimeout(pauseTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!lastMessageId || isAutoScrollPaused.current) {
      return;
    }

    const viewport = containerRef.current?.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]'
    );

    viewport?.scrollTo({
      top: viewport.scrollHeight,
      behavior: "smooth",
    });
  }, [lastMessageId]);

  return (
    <div className="min-h-0 flex-1" ref={containerRef}>
      <ScrollArea className="h-full">
        <div className="space-y-3">
          {messages.map((message) => {
            const isOwn = message.sender.id === currentUserId;
            const { name } = message.sender;

            return (
              <div
                className={`group border-border relative flex items-start gap-3 rounded-lg border p-3 transition-colors duration-150 ${
                  isOwn
                    ? "bg-secondary/20 ml-6 md:ml-12"
                    : "bg-card hover:bg-muted/30 mr-6 md:mr-12"
                }`}
                key={message.id}
              >
                <Avatar className="size-10 shrink-0 rounded-full border border-white/20">
                  {message.sender.image && (
                    <AvatarImage
                      alt={name}
                      className="object-cover"
                      src={message.sender.image}
                    />
                  )}

                  <AvatarFallback className="text-sm font-bold tracking-wider">
                    {name
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
                      {name}
                    </span>

                    <span className="text-muted-foreground text-micro! ml-auto font-mono">
                      {formatMessageTime(message.createdAt)}
                    </span>
                  </div>

                  {message.type === "VOICE" ? (
                    <VoiceMessagePlayer
                      duration={message.duration ?? 0}
                      messageId={message.id}
                      roomId={message.roomId}
                    />
                  ) : (
                    <p className="text-foreground/90 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
