"use client";

import {
  CircleCheck,
  Disc,
  Headphones,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import type { RoomMember } from "@/types/rooms";

type MemberFilter = "ALL" | "DJS" | "LISTENERS";

interface MembersSidebarProps {
  currentUserId: string;
  members: RoomMember[];
  ownerId: string;
}

export function MembersSidebar({
  members,
  currentUserId,
  ownerId,
}: MembersSidebarProps) {
  const [activeFilter, setActiveFilter] = useState<MemberFilter>("ALL");

  const filters: {
    label: string;
    value: MemberFilter;
  }[] = [
    { label: `All (${members.length})`, value: "ALL" },
    {
      label: `DJs (${members.filter((member) => member.id === ownerId).length})`,
      value: "DJS",
    },
    {
      label: `Listeners (${members.filter((member) => member.id !== ownerId).length})`,
      value: "LISTENERS",
    },
  ];

  const filteredMembers = members.filter((member) => {
    if (activeFilter === "DJS") {
      return member.id === ownerId;
    }

    if (activeFilter === "LISTENERS") {
      return member.id !== ownerId;
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
      <SidebarHeader className="border-sidebar-border gap-2.5 border-b p-3.5">
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
            {members.length} online
          </Badge>
        </div>

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

      <SidebarContent className="gap-0 p-2.5">
        <div className="space-y-2">
          {filteredMembers.map((member) => {
            const isCurrentUser = member.id === currentUserId;
            const isHost = member.id === ownerId;
            const isDJ = isHost;

            return (
              <div
                className={cn(
                  "space-y-2 rounded-lg border p-2.5 transition-all",
                  isHost
                    ? "bg-secondary/35 border-primary/40 shadow-2xs"
                    : "bg-card border-border hover:bg-muted/30"
                )}
                key={member.id}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar
                      className={cn(
                        "size-10 shrink-0 rounded-full border border-white/20 shadow-md",
                        isDJ && "animate-pulse ring-2 ring-cyan-400"
                      )}
                    >
                      <AvatarImage
                        alt={member.name}
                        className="object-cover"
                        src={member.image ?? undefined}
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

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-foreground truncate text-xs font-semibold">
                          {member.name}
                        </p>

                        {isCurrentUser && (
                          <span className="text-muted-foreground text-nano font-normal">
                            (You)
                          </span>
                        )}
                      </div>

                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        {isDJ && (
                          <span className="text-primary text-nano flex items-center gap-1 font-semibold">
                            <Disc className="size-2.5 animate-spin" />
                            DJ Stage · Can Play & Upload
                          </span>
                        )}

                        {!isDJ && (
                          <span className="text-muted-foreground text-nano">
                            Listener · Listen Only
                          </span>
                        )}

                        {isHost && (
                          <Badge className="border-primary/30 rounded-md px-1 py-0 text-[9px]!">
                            Host
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {!isHost && currentUserId === ownerId && (
                  <div className="border-border flex items-center justify-between gap-2 border-t pt-2">
                    <div className="text-muted-foreground text-nano font-medium">
                      Music Permissions:
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        className="bg-background text-primary hover:bg-primary/10 border-primary/30 text-micro inline-flex h-6 cursor-pointer items-center justify-center gap-1 rounded-md border px-2 font-medium shadow-xs transition-colors"
                        title="Promote to DJ - grant permission to upload and stream music"
                        type="button"
                      >
                        <CircleCheck className="size-3" />
                        <span>Grant DJ Role</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
