"use client";

import { Clock, Compass, Globe, LayoutGrid, Radio, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { Room } from "@/generated/prisma/client";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { CreateRoomDialog } from "./create-room-dialog";
import { PrivateRoomDialog } from "./private-room-dialog";

type RoomFilter = "ALL" | "PUBLIC" | "PRIVATE" | "TEMP";

type SidebarRoom = Omit<Room, "passwordEncrypted">[];
const filters: { label: string; value: RoomFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Public", value: "PUBLIC" },
  { label: "Private", value: "PRIVATE" },
  { label: "Temp", value: "TEMP" },
];

const categoryLabels: Record<Room["category"], string> = {
  LOFI_AND_CHILL: "Lo-Fi Chill",
  SYNTHWAVE_AND_RETRO: "Synthwave",
  DEEP_AMBIENT: "Deep Ambient",
  GAMING_AND_BEATS: "Gaming & Beats",
  STUDY_AND_FOCUS: "Study & Focus",
  LATE_NIGHT_TALK: "Late Night Talk",
};

export function AppSidebar({ rooms }: { rooms: SidebarRoom }) {
  const router = useRouter();
  const pathname = usePathname();

  const currentUserId = useSession().data?.user.id;

  const [activeFilter, setActiveFilter] = useState<RoomFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredRooms = rooms.filter((room) => {
    const matchesFilter = (() => {
      switch (activeFilter) {
        case "PUBLIC":
          return room.visibility === "PUBLIC";

        case "PRIVATE":
          return room.visibility === "PRIVATE";

        case "TEMP":
          return room.duration === "TEMPORARY";

        default:
          return true;
      }
    })();

    const searchableContent = [room.title, categoryLabels[room.category]]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      !normalizedSearchQuery ||
      searchableContent.includes(normalizedSearchQuery);

    return matchesFilter && matchesSearch;
  });

  const handleJoinPublicRoom = (roomId: string) => {
    sessionStorage.removeItem("pending-room-password");
    router.push(`/${roomId}`);
  };

  return (
    <Sidebar
      className="fixed inset-y-0 left-0 z-40 w-64 shrink-0 -translate-x-full transition-transform duration-200 md:relative md:inset-y-auto md:h-full md:w-64 md:translate-x-0 lg:w-72"
      collapsible="offcanvas"
      side="left"
      variant="sidebar"
    >
      {/* Header */}
      <SidebarHeader className="border-sidebar-border gap-2.5 border-b p-3.5">
        {/* Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md shadow-2xs">
              <Radio className="size-4" />
            </div>

            <div>
              <h1 className="text-sidebar-foreground text-sm font-semibold tracking-tight transition-colors">
                Chatbit
              </h1>
              <p className="text-muted-foreground text-nano">
                Sound & Chat Lounges
              </p>
            </div>
          </div>

          <CreateRoomDialog />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-3.5" />

          <Input
            className="border-border bg-background placeholder:text-muted-foreground h-8 pl-8 text-xs! focus-visible:ring-1"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search lounges..."
            type="text"
            value={searchQuery}
          />
        </div>

        {/* Filters */}
        <div className="border-border bg-muted/60 flex items-center gap-1 rounded-md border p-1">
          {filters.map((filter) => (
            <button
              className={cn(
                "text-micro! flex-1 rounded py-1 transition-colors",
                activeFilter === filter.value
                  ? "text-foreground bg-background font-semibold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground font-medium"
              )}
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </SidebarHeader>

      {/* Scrollable Content */}
      <SidebarContent className="gap-0">
        {/* Lounge Directory */}
        <SidebarGroup className="p-2 pb-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={cn(
                    "h-auto min-h-10 gap-2.5 px-2 py-2 font-semibold shadow-2xs",
                    pathname === "/" &&
                      "border-sidebar-border bg-sidebar-accent border"
                  )}
                  isActive={pathname === "/"}
                >
                  <Link className="flex items-center gap-2.5" href="/">
                    <div className="bg-secondary text-secondary-foreground flex size-7 shrink-0 items-center justify-center rounded-md">
                      <LayoutGrid className="size-3.5!" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs">Lounge Directory</p>
                      <p className="text-muted-foreground text-nano truncate font-semibold">
                        View all sound spaces
                      </p>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Rooms */}
        <SidebarGroup className="p-2">
          <SidebarGroupLabel className="text-muted-foreground! text-nano h-auto gap-1 px-2 pt-2 pb-1 font-semibold tracking-wider uppercase">
            <Compass className="size-3!" />
            Rooms ({filteredRooms.length})
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {filteredRooms.length === 0 && (
                <p className="text-muted-foreground px-2 py-3 text-xs">
                  {normalizedSearchQuery
                    ? "No matching rooms found."
                    : "No rooms found."}
                </p>
              )}

              {filteredRooms.map((room) => {
                const isMine = room.ownerId === currentUserId;

                return room.visibility === "PRIVATE" ? (
                  <PrivateRoomDialog
                    categoryLabel={categoryLabels[room.category]}
                    key={room.id}
                    room={room}
                  />
                ) : (
                  <SidebarMenuItem key={room.id}>
                    <SidebarMenuButton
                      className="h-auto min-h-10 items-start gap-2.5 border border-transparent px-2 py-2"
                      isActive={pathname === `/${room.id}`}
                      onClick={() => handleJoinPublicRoom(room.id)}
                    >
                      <div className="bg-secondary text-secondary-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md">
                        {room.duration === "TEMPORARY" ? (
                          <Clock className="bg-sidebar-accent! text-sidebar-accent-foreground! size-3.5!" />
                        ) : (
                          <Globe className="size-3.5!" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs">{room.title}</p>

                        <div className="text-muted-foreground text-nano mt-0.5 flex items-center gap-1.5 truncate">
                          <span>{categoryLabels[room.category]}</span>

                          {room.duration === "TEMPORARY" && (
                            <>
                              <span>·</span>
                              <span>Temp</span>
                            </>
                          )}

                          {isMine && (
                            <>
                              <span>·</span>
                              <span>Your room</span>
                            </>
                          )}
                        </div>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
