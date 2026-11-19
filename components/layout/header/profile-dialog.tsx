"use client";

import { Loader2, LogOut, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";
import { updateUsername } from "@/actions/user";
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
import { socket } from "@/lib/socket";

interface ProfileDialogProps {
  currentUsername: string;
}

export function ProfileDialog({ currentUsername }: ProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState(currentUsername);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const trimmedUsername = username.trim();

  const initials =
    currentUsername
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleUpdateUsername = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !trimmedUsername ||
      trimmedUsername === currentUsername ||
      isSubmitting
    ) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await updateUsername(trimmedUsername);

      if (!result.success) {
        setError(result.message);
        return;
      }

      socket.emit(
        "user:name-updated",
        { name: result.name },
        (response: { success: boolean; message?: string }) => {
          if (!response.success) {
            console.error("Username broadcast failed:", response.message);
          }
        }
      );

      setUsername(result.name);
      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Failed to update username:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogOut = async () => {
    await signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (nextOpen) {
          setUsername(currentUsername);
          setError("");
        }
      }}
      open={open}
    >
      <DialogTrigger
        render={
          <button
            className="hover:bg-muted flex cursor-pointer items-center gap-1.5 rounded-md p-1 transition-colors"
            title="Profile & Settings"
            type="button"
          >
            <Avatar>
              <AvatarImage
                alt={currentUsername}
                className="h-full w-full object-cover"
                src="/man-1.jpg"
              />
              <AvatarFallback>{initials}</AvatarFallback>
              <AvatarBadge className="bg-emerald-400" />
            </Avatar>

            <span className="text-foreground hidden max-w-[100px] truncate text-xs font-medium lg:inline">
              {currentUsername}
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
              Manage your profile information.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-4">
          <form className="space-y-4" onSubmit={handleUpdateUsername}>
            <div className="space-y-1">
              <Label
                className="text-foreground text-xs font-medium"
                htmlFor="name"
              >
                Display Name
              </Label>

              <Input
                className="bg-background border-border text-foreground focus-visible:ring-ring h-auto rounded-md border px-3 py-1.5 text-sm shadow-none focus-visible:ring-1"
                id="name"
                maxLength={30}
                minLength={2}
                onChange={(e) => setUsername(e.target.value)}
                required
                type="text"
                value={username}
              />
            </div>

            {error && (
              <p className="text-destructive text-xs" role="alert">
                {error}
              </p>
            )}

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
                  disabled={
                    !trimmedUsername ||
                    trimmedUsername === currentUsername ||
                    isSubmitting
                  }
                  type="submit"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <UserCheck className="mr-1 h-3.5 w-3.5" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
