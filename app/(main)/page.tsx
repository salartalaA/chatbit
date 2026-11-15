import {
  Globe,
  Headphones,
  Lock,
  Mic,
  Radio,
  Sparkles,
  Users,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreateRoomDialog } from "@/components/layout/sidebar/create-room-dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Room } from "@/generated/prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";

interface LoungeFeature {
  description: string;
  icon: typeof Headphones;
  id: string;
  title: string;
}

const categoryLabels: Record<Room["category"], string> = {
  LOFI_AND_CHILL: "Lo-Fi Chill",
  SYNTHWAVE_AND_RETRO: "Synthwave",
  DEEP_AMBIENT: "Deep Ambient",
  GAMING_AND_BEATS: "Gaming & Beats",
  STUDY_AND_FOCUS: "Study & Focus",
  LATE_NIGHT_TALK: "Late Night Talk",
};

const loungeFeatures: LoungeFeature[] = [
  {
    id: "audio-sync",
    title: "Audio Synchronization",
    description:
      "Every room member listens to the exact same millisecond of music.",
    icon: Headphones,
  },
  {
    id: "voice-messages",
    title: "Voice Messages",
    description:
      "Record voice notes with microphone, preview before sending, and scrub waveforms.",
    icon: Mic,
  },
  {
    id: "upload-curate",
    title: "Upload & Curate",
    description:
      "Upload local audio files or pick curated Lo-Fi / Synthwave ambient tracks.",
    icon: Sparkles,
  },
];

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const rooms = await prisma.room.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      visibility: true,
      duration: true,
      expiresAt: true,
    },
    where: {
      visibility: "PUBLIC",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center space-y-8 overflow-y-hidden p-6 pt-16 text-center sm:pt-18 md:pt-0">
      <div className="space-y-3">
        <div className="bg-muted border-border text-foreground mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border shadow-xs">
          <Radio className="text-primary h-8 w-8" />
        </div>

        <div>
          <h2 className="text-foreground text-lg font-bold tracking-tight sm:text-2xl">
            No Lounge Selected
          </h2>
          <p className="text-muted-foreground mx-auto mt-1 max-w-md text-xs sm:text-sm">
            Choose an active sound room from the sidebar or pick one of the
            public lounges below to start listening & chatting.
          </p>
        </div>
      </div>

      <CreateRoomDialog isWide={true} />

      <div className="w-full space-y-3">
        <div className="text-muted-foreground flex items-center justify-between px-1 text-xs font-semibold tracking-wider uppercase">
          <span>Public Lounges ({rooms.length})</span>
          <span>Click any lounge to join</span>
        </div>

        <ScrollArea className="h-80">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {rooms.length === 0 ? (
              <div className="text-muted-foreground col-span-full py-10 text-sm">
                No lounges available yet.
              </div>
            ) : (
              rooms.map((room) => {
                const isPrivate = room.visibility === "PRIVATE";
                const VisibilityIcon = isPrivate ? Lock : Globe;

                return (
                  <Link
                    className="group border-border bg-card hover:bg-muted/50 hover:border-border cursor-pointer space-y-3 rounded-lg border p-4 text-left shadow-2xs transition-all hover:shadow-sm"
                    href={`/${room.id}`}
                    key={room.id}
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-md",
                          isPrivate
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-secondary text-secondary-foreground"
                        )}
                      >
                        <VisibilityIcon className="h-4 w-4" />
                      </div>

                      <Badge
                        className={cn(
                          "text-nano!",
                          isPrivate && "border-purple-400/30 text-purple-400"
                        )}
                        variant={isPrivate ? "outline" : "secondary"}
                      >
                        {isPrivate ? "Passcode" : "Public"}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-card-foreground group-hover:text-primary text-sm font-semibold transition-colors">
                        {room.title}
                      </h4>

                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs leading-relaxed">
                        {room.description || "No description provided."}
                      </p>
                    </div>

                    <div className="border-border text-muted-foreground text-micro flex items-center justify-between border-t pt-2">
                      <span className="text-foreground font-medium">
                        {categoryLabels[room.category]}
                      </span>

                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {isPrivate ? "Private" : "Public"}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="border-border hidden w-full gap-4 border-t pt-4 text-left lg:grid lg:grid-cols-3">
        {loungeFeatures.map(({ id, title, description, icon: Icon }) => (
          <div
            className="bg-card border-border flex items-start gap-3 rounded-lg border p-3"
            key={id}
          >
            <Icon className="text-primary mt-0.5 h-5 w-5 shrink-0" />

            <div className="space-y-0.5">
              <h5 className="text-foreground text-xs font-semibold">{title}</h5>

              <p className="text-muted-foreground text-micro">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
