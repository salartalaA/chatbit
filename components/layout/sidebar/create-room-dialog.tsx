"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createRoom } from "@/actions/room";
import { CategorySelect } from "@/components/layout/sidebar/create-room-dialog/category-select";
import { CreateRoomTrigger } from "@/components/layout/sidebar/create-room-dialog/create-room-trigger";
import { RoomTypeSelector } from "@/components/layout/sidebar/create-room-dialog/room-type-selector";
import { SelfDestructTimer } from "@/components/layout/sidebar/create-room-dialog/self-destruct-timer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type CreateRoomInput,
  type CreateRoomType,
  createRoomSchema,
} from "@/schemas/room.schema";

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
      <CreateRoomTrigger isWide={isWide} />

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
          <RoomTypeSelector
            duration={duration}
            onSelectTemporary={() => {
              setValue("duration", "TEMPORARY", {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            onSelectVisibility={(newVisibility) => {
              setValue("visibility", newVisibility, {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
            visibility={visibility}
          />

          {duration === "TEMPORARY" && (
            <SelfDestructTimer
              durationMinutes={durationMinutes}
              onSelectDuration={(minutes) => {
                setValue("durationMinutes", minutes, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
            />
          )}

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

            <CategorySelect
              onValueChange={(newCategory) => {
                setValue("category", newCategory, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              value={watch("category")}
            />
          </div>

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
