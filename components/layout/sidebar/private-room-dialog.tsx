"use client";

import { KeyRound, Lock, Users, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import { toast } from "sonner";
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
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { RoomAuthorizationResult } from "@/types/rooms";

export function PrivateRoomDialog() {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const trimmedPassword = password.trim();

  const handleOpenChange = (value: boolean) => {
    if (value && pathname !== "/") {
      sessionStorage.removeItem("pending-room-password");
      setOpen(true);
      router.replace("/");
      return;
    }

    setOpen(value);

    if (!value) {
      setPassword("");
    }
  };

  const handleJoinRoom = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/rooms/cmw84er1q0001fohuzwy14fxh/authorize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: trimmedPassword,
          }),
        }
      );

      const result: RoomAuthorizationResult = await response.json();

      if (!(response.ok && result.authorized)) {
        toast.error(
          result.authorized
            ? "Unable to authorize room access."
            : result.message
        );
        return;
      }

      sessionStorage.setItem("pending-room-password", trimmedPassword);

      setOpen(false);
      router.push("/cmw84er1q0001fohuzwy14fxh");
    } catch {
      toast.error("Unable to verify room password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger
        nativeButton={false}
        render={
          <SidebarMenuItem>
            <SidebarMenuButton className="h-auto min-h-10 items-start gap-2.5 border border-transparent px-2 py-2">
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-purple-500/10 text-purple-400">
                <Lock className="size-3.5!" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate text-xs">VIP Private Studio Lounge</p>

                  <span className="text-nano shrink-0 font-semibold text-purple-400">
                    Locked
                  </span>
                </div>

                <div className="text-muted-foreground text-nano mt-0.5 flex items-center gap-1.5 truncate">
                  <span>Exclusive</span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    <Users className="size-2.5!" />3
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        }
      />

      <DialogContent
        className="border-border bg-card text-card-foreground data-[state=open]:animate-in data-[state=open]:zoom-in-95 max-w-md gap-0 rounded-lg p-6 shadow-lg duration-150"
        showCloseButton={false}
      >
        <DialogHeader className="border-border flex-row items-start justify-between border-b pb-3 text-left">
          <div className="space-y-1">
            <DialogTitle className="text-foreground text-base leading-none font-semibold tracking-tight">
              Private Lounge Access
            </DialogTitle>

            <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
              "VIP Private Studio Lounge" is restricted to authorized guests.
              Please enter the passcode to enter.
            </DialogDescription>
          </div>

          <DialogTrigger
            render={
              <button
                aria-label="Close dialog"
                className="text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer rounded-md p-1.5 transition-colors"
                type="button"
              >
                <X className="size-4" />
              </button>
            }
          />
        </DialogHeader>

        <div className="mt-4">
          <form className="space-y-4" onSubmit={handleJoinRoom}>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Room Passcode
              </Label>

              <div className="relative">
                <KeyRound className="text-muted-foreground absolute top-2.5 left-3 size-4" />

                <Input
                  className="border-border bg-background h-auto rounded-md py-2 pr-3 pl-9 text-sm focus-visible:ring-1"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter passcode..."
                  type="password"
                  value={password}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <DialogClose
                render={
                  <Button
                    className="border-border bg-background hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs shadow-xs"
                    type="button"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                }
              />

              <Button
                className="h-8 rounded-md px-3 text-xs font-semibold"
                disabled={isSubmitting || !trimmedPassword}
                type="submit"
              >
                {isSubmitting ? "Checking..." : "Join"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
