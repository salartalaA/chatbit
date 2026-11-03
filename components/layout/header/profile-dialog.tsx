"use client";

import { LogOut, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type Status = "ONLINE" | "LISTENING" | "AWAY";

const statuses: Status[] = ["ONLINE", "LISTENING", "AWAY"];

export function ProfileDialog() {
  const [open, setOpen] = useState(false);

  const [status, setStatus] = useState<Status>("LISTENING");

  const router = useRouter();

  const handleLogOut = async () => {
    await signOut();

    router.push("/auth/login");
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <button
            className="hover:bg-muted flex cursor-pointer items-center gap-1.5 rounded-md p-1 transition-colors"
            title="Profile & Settings"
            type="button"
          >
            <Avatar>
              <AvatarImage
                alt="SoundSeeker"
                className="h-full w-full object-cover"
                src="/man-1.jpg"
              />
              <AvatarFallback>SS</AvatarFallback>
              <AvatarBadge className="bg-emerald-400" />
            </Avatar>

            <span className="text-foreground hidden max-w-[100px] truncate text-xs font-medium lg:inline">
              SoundSeeker
            </span>
          </button>
        }
      />

      <DialogContent className="gap-0 p-6">
        <DialogHeader className="border-border flex flex-row items-start justify-between space-y-1 border-b pb-3 text-left">
          <div className="space-y-1">
            <DialogTitle className="text-foreground text-base leading-none font-semibold tracking-tight">
              User Profile
            </DialogTitle>

            <DialogDescription className="text-muted-foreground text-xs leading-relaxed">
              Manage your sound persona and lounge status.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <form className="space-y-4">
            {/* Display Name */}
            <div className="space-y-1">
              <Label
                className="text-foreground text-xs font-medium"
                htmlFor="name"
              >
                Display Name
              </Label>

              <Input
                className="bg-background border-border text-foreground focus-visible:ring-ring h-auto rounded-md border px-3 py-1.5 text-sm shadow-none focus-visible:ring-1"
                defaultValue="SoundSeeker"
                id="name"
                required
                type="text"
              />
            </div>

            {/* Current Status */}
            <div className="space-y-1">
              <Label className="text-foreground text-xs font-medium">
                Current Status
              </Label>

              <div className="grid grid-cols-3 gap-2">
                {statuses.map((item) => (
                  <button
                    className={cn(
                      "cursor-pointer rounded-md border py-1.5 text-xs font-medium capitalize transition-colors",
                      status === item
                        ? "border-primary bg-primary/10 text-foreground font-semibold"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                    key={item}
                    onClick={() => setStatus(item)}
                    type="button"
                  >
                    {item.toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Bio */}
            <div className="space-y-1">
              <Label
                className="text-foreground text-xs font-medium"
                htmlFor="bio"
              >
                Custom Bio
              </Label>

              <Input
                className="bg-background border-border text-foreground focus-visible:ring-ring h-auto rounded-md border px-3 py-1.5 text-sm shadow-none focus-visible:ring-1"
                defaultValue="Enjoying good beats and friendly conversations."
                id="bio"
                placeholder="e.g. Ambient explorer & synth crafter"
                type="text"
              />
            </div>

            {/* Actions */}
            <div className="border-border flex items-center justify-between border-t pt-2">
              <Button
                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 gap-1.5 rounded-md text-xs"
                onClick={handleLogOut}
                type="button"
                variant="ghost"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Button>
              <div className="flex gap-2">
                <DialogClose
                  render={() => (
                    <Button
                      className="h-8 gap-1.5 rounded-md px-3 text-xs"
                      onClick={() => setOpen(false)}
                      type="button"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  )}
                />

                <Button
                  className="h-8 gap-1.5 rounded-md px-3 text-xs font-semibold"
                  type="submit"
                >
                  <UserCheck className="mr-1 h-3.5 w-3.5" />
                  Save
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
