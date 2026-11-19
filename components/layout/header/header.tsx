import { LayoutGrid } from "lucide-react";
import { headers } from "next/headers";
import Invite from "@/components/layout/header/invite";
import { ProfileDialog } from "@/components/layout/header/profile-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return;
  }

  const username = session.user.name;

  return (
    <div className="border-border bg-card text-card-foreground z-20 flex h-13 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="size-6 md:hidden" />

        <LayoutGrid className="text-primary h-4 w-4" />

        <span className="text-foreground text-sm font-semibold">
          Lounge Directory
        </span>

        <span className="text-foreground border-border text-nano hidden items-center gap-1 rounded-md border px-2 py-0.5 font-semibold tracking-normal transition-colors sm:inline-flex">
          No Room Selected
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Invite />

        <ProfileDialog currentUsername={username} />
      </div>
    </div>
  );
}
