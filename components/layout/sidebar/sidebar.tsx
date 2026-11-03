"use client";

import {
  Compass,
  Globe,
  LayoutGrid,
  Lock,
  Radio,
  Search,
  Users,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { CreateRoomDialog } from "./create-room-dialog";

type RoomFilter = "ALL" | "PUBLIC" | "PRIVATE" | "TEMP";

const filters: { label: string; value: RoomFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Public", value: "PUBLIC" },
  { label: "Private", value: "PRIVATE" },
  { label: "Temp", value: "TEMP" },
];

export function AppSidebar() {
  const [activeFilter, setActiveFilter] = useState<RoomFilter>("ALL");

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

          {/* <Button
            className="h-7 gap-1 px-2 text-xs"
            size="sm"
            variant="outline"
          >
            <Plus className="size-3.5" />
            New
          </Button> */}

          <CreateRoomDialog />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-3.5" />

          <Input
            className="border-border bg-background placeholder:text-muted-foreground h-8 pl-8 text-xs! focus-visible:ring-1"
            placeholder="Search lounges..."
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
                  className="border-sidebar-border bg-sidebar-accent h-auto min-h-10 gap-2.5 border px-2 py-2 font-semibold shadow-2xs"
                  isActive
                >
                  <div className="bg-secondary text-secondary-foreground flex size-7 shrink-0 items-center justify-center rounded-md">
                    <LayoutGrid className="size-3.5!" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs">Lounge Directory</p>
                    <p className="text-muted-foreground text-nano truncate font-semibold">
                      View all sound spaces
                    </p>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Rooms */}
        <SidebarGroup className="p-2">
          <SidebarGroupLabel className="text-muted-foreground! text-nano h-auto gap-1 px-2 pt-2 pb-1 font-semibold tracking-wider uppercase">
            <Compass className="size-3!" />
            Rooms (4)
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {/* Room 1 */}
              <SidebarMenuItem>
                <SidebarMenuButton className="h-auto min-h-10 items-start gap-2.5 border border-transparent px-2 py-2">
                  <div className="bg-secondary text-secondary-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md">
                    <Globe className="size-3.5!" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs">Midnight Lo-Fi Cafe</p>

                    <div className="text-muted-foreground text-nano mt-0.5 flex items-center gap-1.5 truncate">
                      <span>Lo-Fi Chill</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Users className="size-2.5!" />8
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Room 2 */}
              <SidebarMenuItem>
                <SidebarMenuButton className="h-auto min-h-10 items-start gap-2.5 border border-transparent px-2 py-2">
                  <div className="bg-secondary text-secondary-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md">
                    <Globe className="size-3.5!" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs">Cyberpunk Synthwave 2099</p>

                    <div className="text-muted-foreground text-nano mt-0.5 flex items-center gap-1.5 truncate">
                      <span>Synthwave</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Users className="size-2.5!" />6
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Room 3 */}
              <SidebarMenuItem>
                <SidebarMenuButton className="h-auto min-h-10 items-start gap-2.5 border border-transparent px-2 py-2">
                  <div className="bg-secondary text-secondary-foreground mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md">
                    <Globe className="size-3.5!" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs">Deep Space Ambient Oasis</p>

                    <div className="text-muted-foreground text-nano mt-0.5 flex items-center gap-1.5 truncate">
                      <span>Ambient</span>
                      <span>·</span>
                      <span className="flex items-center gap-0.5">
                        <Users className="size-2.5!" />4
                      </span>
                    </div>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Room 4 */}
              <SidebarMenuItem>
                <SidebarMenuButton className="h-auto min-h-10 items-start gap-2.5 border border-transparent px-2 py-2">
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-purple-500/10 text-purple-400">
                    <Lock className="size-3.5!" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="truncate text-xs">
                        VIP Private Studio Lounge
                      </p>

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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
