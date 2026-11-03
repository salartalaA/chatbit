"use client";

import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { PlaylistDialog } from "@/components/layout/footer/playlist-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export default function MusicPlayer() {
  const [currentTime, setCurrentTime] = useState([0]);
  const [volume, setVolume] = useState([80]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(80);

  const duration = 184;
  const isMuted = volume[0] === 0;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume([previousVolume]);
    } else {
      setPreviousVolume(volume[0]);
      setVolume([0]);
    }
  };

  return (
    <div className="border-border bg-card text-card-foreground border-t px-3 py-2 shadow-xs transition-all sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2.5 md:flex-row">
        <div className="flex w-full min-w-0 items-center gap-3 md:w-1/3">
          <div className="group relative shrink-0">
            <Image
              alt="Rainy Night In Shibuya"
              className="border-border h-10 w-10 rounded-md border object-cover shadow-2xs"
              height={10}
              src="/music-01.jpg"
              width={10}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-foreground truncate text-xs font-semibold">
                Rainy Night In Shibuya
              </p>

              <Badge
                className="rounded-md text-[9px]! uppercase"
                variant="secondary"
              >
                lofi
              </Badge>
            </div>

            <p className="text-muted-foreground text-micro truncate">
              Aura Collective · Added by DJ Zephyr
            </p>
          </div>
        </div>

        <div className="flex w-full max-w-md flex-col items-center gap-1 md:w-1/3">
          <div className="flex items-center gap-2">
            <Button
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1.5"
              size="icon"
              title="Previous Track"
              variant="ghost"
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              className="h-8 w-8 rounded-full"
              onClick={() => setIsPlaying((previous) => !previous)}
              size="icon"
              title={
                isPlaying
                  ? "Pause synchronized audio"
                  : "Play synchronized audio"
              }
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 fill-current" />
              ) : (
                <Play className="ml-0.5 h-4 w-4 fill-current" />
              )}
            </Button>

            <Button
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1.5"
              size="icon"
              title="Next Track"
              variant="ghost"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-muted-foreground text-nano flex w-full items-center gap-2 font-mono">
            <span>{formatTime(currentTime[0])}</span>

            <div className="flex-1">
              <Slider
                className="cursor-pointer"
                max={duration}
                min={0}
                onValueChange={(value) => {
                  const newTime = Array.isArray(value) ? value[0] : value;

                  setCurrentTime([newTime]);
                }}
                step={1}
                value={currentTime}
              />
            </div>

            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* TODO: ADD VISUALIZER */}

        <div className="flex w-full items-center justify-end gap-3 md:w-1/3">
          <div className="flex w-26 items-center">
            <Button
              className="text-muted-foreground hover:text-foreground"
              onClick={toggleMute}
              size="icon"
              title={isMuted ? "Unmute" : "Mute"}
              variant="ghost"
            >
              {isMuted ? (
                <VolumeX className="text-destructive size-3.5" />
              ) : (
                <Volume2 className="size-3.5" />
              )}
            </Button>

            <div className="flex-1">
              <Slider
                className="cursor-pointer"
                max={100}
                min={0}
                onValueChange={(value) => {
                  const newVolume = Array.isArray(value) ? value[0] : value;

                  setVolume([newVolume]);

                  if (newVolume > 0) {
                    setPreviousVolume(newVolume);
                  }
                }}
                step={1}
                value={volume}
              />
            </div>
          </div>

          <PlaylistDialog />
        </div>
      </div>
    </div>
  );
}
