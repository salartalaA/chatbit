"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Globe, Loader2, Lock, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createRoom } from "@/actions/room";
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
import { cn } from "@/lib/utils";
import {
  type CreateRoomInput,
  type CreateRoomType,
  createRoomSchema,
} from "@/schemas/room.schema";

const roomTypes = [
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
    description: "Auto-delete after time",
    value: "TEMPORARY",
    icon: Clock,
    iconClassName: "text-orange-400",
  },
] as const;

const categories = [
  { label: "Lo-Fi & Chill", value: "LOFI_AND_CHILL" },
  { label: "Synthwave & Retro", value: "SYNTHWAVE_AND_RETRO" },
  { label: "Deep Ambient", value: "DEEP_AMBIENT" },
  { label: "Gaming & Beats", value: "GAMING_AND_BEATS" },
  { label: "Study & Focus", value: "STUDY_AND_FOCUS" },
  { label: "Late Night Talk", value: "LATE_NIGHT_TALK" },
] as const;

const selfDestructTimers = [
  { label: "15m", value: "15" },
  { label: "1h", value: "60" },
  { label: "6h", value: "360" },
  { label: "24h", value: "1440" },
] as const;

export function CreateRoomDialog({ isWide = false }: { isWide?: boolean }) {
  const [open, setOpen] = useState(false);

  const {
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
    register,
    handleSubmit,
    getValues,
  } = useForm<CreateRoomInput, unknown, CreateRoomType>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "LOFI_AND_CHILL",
      visibility: "PUBLIC",
      duration: "PERMANENT",
      durationMinutes: undefined,
      tags: "",
    },
  });

  const visibility = watch("visibility");
  const duration = watch("duration");
  const durationMinutes = watch("durationMinutes") ?? "15";

  const onsubmit = async () => {
    const result = await createRoom(getValues());

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Room created successfully");

    setOpen(false);
    reset();
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {isWide ? (
        <DialogTrigger
          render={
            <Button className="gap-2 font-semibold shadow-xs">
              <Plus className="h-4 w-4" />
              Create New Sound Lounge
            </Button>
          }
        />
      ) : (
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
      )}

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

        <form className="space-y-4" onSubmit={handleSubmit(onsubmit)}>
          {/* Room Type */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Room Type
            </Label>

            <div className="grid grid-cols-3 gap-2">
              {roomTypes.map((type) => {
                const Icon = type.icon;
                const isSelected =
                  type.value === "TEMPORARY"
                    ? duration === "TEMPORARY"
                    : visibility === type.value;

                return (
                  <button
                    className={cn(
                      "cursor-pointer rounded-md border p-3 text-left transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground font-semibold shadow-2xs"
                        : "border-border bg-card text-muted-foreground hover:bg-muted"
                    )}
                    key={type.value}
                    onClick={() => {
                      if (type.value === "TEMPORARY") {
                        setValue("duration", "TEMPORARY", {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      } else {
                        setValue("visibility", type.value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        });
                      }
                    }}
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
          {duration === "TEMPORARY" && (
            <div className="bg-muted border-border space-y-1.5 rounded-md border p-3">
              <Label className="text-foreground block text-xs font-medium">
                Self-Destruct Timer
              </Label>

              <div className="flex gap-2">
                {selfDestructTimers.map((dur) => (
                  <button
                    className={cn(
                      "flex-1 cursor-pointer rounded border py-1 text-xs font-medium transition-colors",
                      durationMinutes === dur.value
                        ? "bg-primary text-primary-foreground border-primary font-bold"
                        : "bg-background border-border text-muted-foreground hover:bg-muted"
                    )}
                    key={dur.label}
                    onClick={() => {
                      setValue("durationMinutes", dur.value ?? "15", {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    type="button"
                  >
                    {dur.label}
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
                placeholder="e.g. Midnight Beats"
                type="text"
                {...register("title")}
              />

              {errors.title && (
                <p className="text-destructive text-xs" role="alert">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-foreground text-xs font-medium">
                Category
              </Label>

              <Select
                onValueChange={(value) =>
                  setValue("category", value as CreateRoomType["category"], {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                value={watch("category")}
              >
                <SelectTrigger className="bg-background border-border text-foreground focus-visible:ring-ring w-full cursor-pointer rounded-md border px-3 py-1.5 text-sm focus-visible:ring-1">
                  <SelectValue>
                    {
                      categories.find(
                        (item) => item.value === watch("category")
                      )?.label
                    }
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
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
              placeholder="What is this lounge about?"
              type="text"
              {...register("description")}
            />

            {errors.description && (
              <p className="text-destructive text-xs" role="alert">
                {errors.description.message}
              </p>
            )}
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
              placeholder="vibes, coding, chill"
              {...register("tags")}
            />

            {errors.tags && (
              <p className="text-destructive text-xs" role="alert">
                {errors.tags.message}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <DialogClose
              render={
                <Button
                  className="h-8 gap-1.5 rounded-md px-3 text-xs"
                  onClick={() => reset()}
                  type="button"
                  variant="outline"
                >
                  Cancel
                </Button>
              }
            />

            <Button
              className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Room
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
