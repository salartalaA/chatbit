"use client";

import { Clock, Globe, Lock, Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RoomType = "PUBLIC" | "PRIVATE" | "TEMPORARY";

type RoomCategory =
  | "Lo-Fi & Chill"
  | "Synthwave & Retro"
  | "Deep Ambient"
  | "Gaming & Beats"
  | "Study & Focus"
  | "Late Night Talk";

type SelfDestructTimer = "15m" | "1h" | "6h" | "24h";

const roomTypes: {
  label: string;
  description: string;
  value: RoomType;
  icon: typeof Globe;
  iconClassName: string;
}[] = [
  {
    label: "Public",
    description: "Open to all listeners",
    value: "PUBLIC",
    icon: Globe,
    iconClassName: "text-primary",
  },
  {
    label: "Private",
    description: "Passcode protected",
    value: "PRIVATE",
    icon: Lock,
    iconClassName: "text-purple-400",
  },
  {
    label: "Temporary",
    description: "Auto-destruct timer",
    value: "TEMPORARY",
    icon: Clock,
    iconClassName: "text-amber-500",
  },
];

const categories: RoomCategory[] = [
  "Lo-Fi & Chill",
  "Synthwave & Retro",
  "Deep Ambient",
  "Gaming & Beats",
  "Study & Focus",
  "Late Night Talk",
];

const selfDestructTimers: SelfDestructTimer[] = ["15m", "1h", "6h", "24h"];

export function CreateRoomDialog() {
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("PUBLIC");
  const [category, setCategory] = useState<RoomCategory>("Lo-Fi & Chill");
  const [tags, setTags] = useState("chill, music, beats");
  const [selfDestructTimer, setSelfDestructTimer] =
    useState<SelfDestructTimer>("1h");

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button
            className="h-7 gap-1 px-2 text-xs"
            size="sm"
            variant="outline"
          >
            <Plus className="size-3.5" />
            New
          </Button>
        }
      />

      <DialogContent className="border-border bg-card text-card-foreground p-6">
        <DialogHeader className="border-border flex flex-row items-start justify-between border-b pb-3 text-left">
          <div className="space-y-1">
            <DialogTitle className="text-foreground text-base leading-none font-semibold tracking-tight">
              Create Sound Lounge
            </DialogTitle>

            <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
              Choose your room type, musical vibe, and access permissions.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form className="space-y-4">
          {/* Room Type */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Room Type
            </Label>

            <div className="grid grid-cols-3 gap-2">
              {roomTypes.map((type) => {
                const Icon = type.icon;

                return (
                  <button
                    className={`cursor-pointer rounded-md border p-3 text-left transition-colors ${
                      roomType === type.value
                        ? "border-primary bg-primary/10 text-foreground font-semibold shadow-2xs"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    }`}
                    key={type.value}
                    onClick={() => setRoomType(type.value)}
                    type="button"
                  >
                    <Icon className={`mb-1 h-4 w-4 ${type.iconClassName}`} />

                    <div className="text-foreground text-xs font-bold">
                      {type.label}
                    </div>

                    <div className="text-muted-foreground text-nano mt-0.5">
                      {type.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Self-Destruct Timer */}
          {roomType === "TEMPORARY" && (
            <div className="bg-muted border-border space-y-1.5 rounded-md border p-3">
              <Label className="text-foreground block text-xs font-medium">
                Self-Destruct Timer
              </Label>

              <div className="flex gap-2">
                {selfDestructTimers.map((timer) => (
                  <button
                    className={`flex-1 cursor-pointer rounded border py-1 text-xs font-medium transition-colors ${
                      selfDestructTimer === timer
                        ? "bg-primary text-primary-foreground border-primary font-bold"
                        : "bg-background border-border text-muted-foreground hover:bg-muted"
                    }`}
                    key={timer}
                    onClick={() => setSelfDestructTimer(timer)}
                    type="button"
                  >
                    {timer}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Room Name & Category */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label
                className="text-foreground text-xs font-medium"
                htmlFor="room-name"
              >
                Room Name
              </Label>

              <Input
                className="bg-background border-border text-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-1.5 text-sm focus-visible:ring-1"
                id="room-name"
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Midnight Beats"
                required
                type="text"
                value={name}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-foreground text-xs font-medium">
                Category
              </Label>

              <Select
                onValueChange={(value) => setCategory(value as RoomCategory)}
                value={category}
              >
                <SelectTrigger className="bg-background border-border text-foreground focus-visible:ring-ring w-full cursor-pointer rounded-md border px-3 py-1.5 text-sm focus-visible:ring-1">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label
              className="text-foreground text-xs font-medium"
              htmlFor="room-description"
            >
              Short Description
            </Label>

            <Input
              className="bg-background border-border text-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-1.5 text-sm focus-visible:ring-1"
              id="room-description"
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this lounge about?"
              type="text"
              value={description}
            />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <Label
              className="text-foreground text-xs font-medium"
              htmlFor="room-tags"
            >
              Tags (comma separated)
            </Label>

            <Input
              className="bg-background border-border text-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-1.5 text-sm focus-visible:ring-1"
              id="room-tags"
              onChange={(event) => setTags(event.target.value)}
              placeholder="vibes, coding, chill"
              type="text"
              value={tags}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose
              render={
                <Button
                  className="h-8 gap-1.5 rounded-md px-3 text-xs"
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              }
            />

            <Button
              className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold"
              disabled={!name.trim()}
              type="submit"
            >
              <Plus className="h-4 w-4" />
              Create Room
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
