"use client";

import { Loader2, Trash2, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteMyRoom } from "@/actions/room";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { socket } from "@/lib/socket";

export function DeleteLoungeDialog({
  roomTitle,
  roomId,
}: {
  roomTitle: string;
  roomId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRoom = async () => {
    setIsDeleting(true);

    const result = await deleteMyRoom(roomId);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    socket.emit("room:deleted");
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button
            className="h-7 shrink-0 gap-1 px-2.5 text-xs"
            size="sm"
            title="Delete this room permanently"
            variant="destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Delete Lounge</span>
          </Button>
        }
      />

      <DialogContent className="p-6">
        <DialogHeader className="border-border border-b pb-3 text-left">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-base">
                Delete Sound Lounge?
              </DialogTitle>

              <DialogDescription className="text-xs leading-relaxed">
                Are you sure you want to delete "{roomTitle}"? This will
                permanently close the lounge for all members.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-1 space-y-4">
          <div className="border-destructive/20 bg-destructive/10 text-destructive flex items-center gap-3 rounded-md border p-3 text-xs">
            <TriangleAlert className="h-5 w-5 shrink-0" />

            <span>
              This action cannot be undone. All active listeners will be safely
              returned to the Lounge Directory.
            </span>
          </div>

          <DialogFooter className="flex-row justify-end gap-2 pt-2">
            <DialogClose
              render={() => (
                <Button
                  className="h-8 gap-1.5 px-3 text-xs"
                  disabled={isDeleting}
                  onClick={() => setOpen(false)}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              )}
            />

            <Button
              className="h-8 gap-1.5 px-3 text-xs font-semibold"
              disabled={isDeleting}
              onClick={handleDeleteRoom}
              size="sm"
              variant="destructive"
            >
              {isDeleting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Yes, Delete Lounge"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
