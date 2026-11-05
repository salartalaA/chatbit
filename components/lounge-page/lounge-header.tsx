import { Hash } from "lucide-react";
import { DeleteLoungeDialog } from "@/components/lounge-page/delete-lounge-dialog";
import { Badge } from "@/components/ui/badge";

export default function LoungeHeader() {
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
                Midnight Lo-Fi Cafe
              </h2>

              <Badge className="text-nano! rounded-md">Your Room</Badge>
            </div>

            <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
              Cozy beats to relax, study, and chat together. Warm vinyl
              chillhop.
            </p>
          </div>
        </div>

        <DeleteLoungeDialog />
      </div>

      <div className="border-border text-muted-foreground mt-3 flex flex-wrap items-center gap-1.5 border-t pt-3 text-xs">
        <Badge className="text-nano! rounded-md" variant="secondary">
          #Lo-Fi Chill
        </Badge>

        <span>·</span>
        <span>Audio Sync Active</span>

        <span>·</span>
        <span>Voice Notes Enabled</span>

        <div className="mt-1 flex items-center gap-1.5">
          <span className="text-muted-foreground text-micro">#Study</span>
          <span className="text-muted-foreground text-micro">#Chill</span>
          <span className="text-muted-foreground text-micro">#Lo-Fi</span>
          <span className="text-muted-foreground text-micro">#Warm</span>
        </div>
      </div>
    </div>
  );
}
