"use client";

import {
  CircleCheck,
  Disc,
  Headphones,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type MemberFilter = "ALL" | "DJS" | "LISTENERS";
type MemberStatus = "ONLINE" | "LISTENING" | "AWAY";
type MemberRole = "DJ" | "Listener";

interface Member {
  id: number;
  image: string;
  isCurrentUser?: boolean;
  isHost?: boolean;
  name: string;
  role: MemberRole;
  status?: MemberStatus;
}

const filters: {
  label: string;
  value: MemberFilter;
}[] = [
  { label: "All (4)", value: "ALL" },
  { label: "DJs (1)", value: "DJS" },
  { label: "Listeners (3)", value: "LISTENERS" },
];

const members: Member[] = [
  {
    id: 1,
    name: "DJ Zephyr",
    image: "/man-1.jpg",
    role: "DJ",
    isHost: true,
    isCurrentUser: true,
  },
  {
    id: 2,
    name: "Maya Lin",
    image: "/woman-1.jpg",
    status: "LISTENING",
    role: "Listener",
  },
  {
    id: 3,
    name: "CyberSam",
    image: "/man-2.jpg",
    status: "ONLINE",
    role: "Listener",
  },
  {
    id: 4,
    name: "Elena V.",
    image: "/woman-2.jpg",
    status: "AWAY",
    role: "Listener",
  },
];

const statusStyles: Record<MemberStatus, string> = {
  ONLINE: "bg-emerald-400 ring-emerald-500/30",
  LISTENING: "bg-blue-400 ring-blue-500/30",
  AWAY: "bg-amber-400 ring-amber-500/30",
};

const statusTextStyles: Record<MemberStatus, string> = {
  ONLINE: "text-emerald-400",
  LISTENING: "text-blue-400",
  AWAY: "text-amber-400",
};

export function MembersSidebar() {
  const [activeFilter, setActiveFilter] = useState<MemberFilter>("ALL");

  const filteredMembers = members.filter((member) => {
    if (activeFilter === "DJS") {
      return member.role === "DJ";
    }

    if (activeFilter === "LISTENERS") {
      return member.role === "Listener";
    }

    return true;
  });

  return (
    <Sidebar
      className="fixed inset-y-0 right-0 z-40 w-72 shrink-0 translate-x-full transition-transform duration-200 xl:relative xl:w-64 xl:translate-x-0 2xl:w-72"
      collapsible="offcanvas"
      side="right"
      variant="sidebar"
    >
      {/* Header */}
      <SidebarHeader className="border-sidebar-border gap-2.5 border-b p-3.5">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-primary size-4" />

            <h3 className="text-sidebar-foreground text-xs font-semibold tracking-wider uppercase">
              Members & DJ Roles
            </h3>
          </div>

          <Badge
            className="text-nano! rounded-md font-mono tracking-normal"
            variant="secondary"
          >
            4 online
          </Badge>
        </div>

        {/* DJ Access Manager */}
        <div className="bg-secondary/60 border-border space-y-1 rounded-md border p-2.5 text-xs">
          <div className="text-foreground text-micro flex items-center gap-1.5 font-semibold">
            <SlidersHorizontal className="text-primary size-3.5" />
            <span>DJ Access Manager</span>
          </div>

          <p className="text-muted-foreground text-nano leading-relaxed">
            Use the toggle buttons below to decide who can upload and stream
            music in this room.
          </p>
        </div>

        {/* Filters */}
        <div className="border-border bg-muted/60 flex items-center gap-1 rounded-md border p-1">
          {filters.map((filter) => (
            <button
              className={cn(
                "text-micro! flex flex-1 cursor-pointer items-center justify-center gap-1 rounded py-1 font-medium transition-all",
                activeFilter === filter.value
                  ? "bg-background text-foreground font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              type="button"
            >
              {filter.value === "DJS" && (
                <Headphones className="text-primary size-3" />
              )}

              {filter.label}
            </button>
          ))}
        </div>
      </SidebarHeader>

      {/* Members */}
      <SidebarContent className="gap-0 p-2.5">
        <div className="space-y-2">
          {filteredMembers.map((member) => (
            <div
              className={cn(
                "space-y-2 rounded-lg border p-2.5 transition-all",
                member.isHost
                  ? "bg-secondary/35 border-primary/40 shadow-2xs"
                  : "bg-card border-border hover:bg-muted/30"
              )}
              key={member.id}
            >
              {/* Member Info */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="relative inline-flex shrink-0 select-none">
                    <Avatar
                      className={cn(
                        "size-10 shrink-0 rounded-full border border-white/20 shadow-md",
                        member.role === "DJ" &&
                          "animate-pulse ring-2 ring-cyan-400"
                      )}
                    >
                      <AvatarImage
                        alt={member.name}
                        className="object-cover"
                        src={member.image}
                      />

                      <AvatarFallback className="text-sm font-bold tracking-wider">
                        {member.name
                          .split(" ")
                          .map((part) => part.charAt(0))
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {member.status && (
                      <span
                        className={cn(
                          "absolute right-0 bottom-0 size-2 rounded-full ring-2",
                          statusStyles[member.status]
                        )}
                        title={`Status: ${member.status}`}
                      />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-foreground truncate text-xs font-semibold">
                        {member.name}
                      </p>

                      {member.isCurrentUser && (
                        <span className="text-muted-foreground text-nano font-normal">
                          (You)
                        </span>
                      )}
                    </div>

                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                      {member.role === "DJ" && (
                        <span className="text-primary text-nano flex items-center gap-1 font-semibold">
                          <Disc className="size-2.5 animate-spin" />
                          DJ Stage · Can Play & Upload
                        </span>
                      )}

                      {member.role === "Listener" && (
                        <span className="text-muted-foreground text-nano">
                          Listener · Listen Only
                        </span>
                      )}

                      {member.isHost && (
                        <Badge className="border-primary/30 rounded-md px-1 py-0 text-[9px]!">
                          Host
                        </Badge>
                      )}

                      {member.status && (
                        <span
                          className={cn(
                            "text-[9px] font-semibold tracking-wide capitalize",
                            statusTextStyles[member.status]
                          )}
                        >
                          {member.status.toLowerCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Music Permissions */}
              <div className="border-border flex items-center justify-between gap-2 border-t pt-2">
                <div className="text-muted-foreground text-nano font-medium">
                  Music Permissions:
                </div>

                <div className="flex items-center gap-1.5">
                  {!member.isHost && (
                    <button
                      className="bg-background text-primary hover:bg-primary/10 border-primary/30 text-micro inline-flex h-6 cursor-pointer items-center justify-center gap-1 rounded-md border px-2 font-medium shadow-xs transition-colors"
                      title="Promote to DJ - grant permission to upload and stream music"
                      type="button"
                    >
                      <CircleCheck className="size-3" />
                      <span>Grant DJ Role</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
