import { Hash } from "lucide-react";
import { DeleteLoungeDialog } from "@/components/lounge-page/delete-lounge-dialog";
import { Badge } from "@/components/ui/badge";
import type { Room } from "@/generated/prisma/client";
import { useSession } from "@/lib/auth-client";

const categoryLabels = {
  LOFI_AND_CHILL: "Lo-Fi Chill",
  SYNTHWAVE_AND_RETRO: "Synthwave",
  DEEP_AMBIENT: "Deep Ambient",
  GAMING_AND_BEATS: "Gaming & Beats",
  STUDY_AND_FOCUS: "Study & Focus",
  LATE_NIGHT_TALK: "Late Night Talk",
} as const;

export default function LoungeHeader({
  room,
}: {
  room: Omit<Room, "passwordEncrypted">;
}) {
  const { data } = useSession();

  if (!room) {
    return null;
  }

  const currentUserId = data?.user.id;

  const isOwner = currentUserId === room.ownerId;

  return (
    <div className="bg-card text-card-foreground border-border mb-4 h-fit w-full rounded-lg border px-4 py-4 shadow-2xs">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-secondary text-secondary-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
            <Hash className="text-primary h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-foreground truncate text-base font-semibold tracking-tight">
                {room.title}
              </h2>

              {isOwner && (
                <Badge className="text-nano! rounded-md">Your Room</Badge>
              )}
            </div>

            {room.description && (
              <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                {room.description}
              </p>
            )}
          </div>
        </div>

        {isOwner && (
          <DeleteLoungeDialog roomId={room.id} roomTitle={room.title} />
        )}
      </div>

      <div className="border-border text-muted-foreground mt-3 flex flex-wrap items-center gap-1.5 border-t pt-3 text-xs">
        <Badge className="text-nano! rounded-md" variant="secondary">
          #{categoryLabels[room.category]}
        </Badge>

        <span>·</span>
        <span>Audio Sync Active</span>

        <span>·</span>
        <span>Voice Notes Enabled</span>

        {room.tags.length > 0 && (
          <div className="mt-1 flex items-center gap-1.5">
            {room.tags.map((tag) => (
              <span className="text-muted-foreground text-micro" key={tag}>
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
