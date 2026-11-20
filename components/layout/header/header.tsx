import { Sparkle } from "lucide-react";
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

        <Sparkle className="text-primary h-4 w-4" />

        <span className="text-foreground text-sm font-semibold">
          Have a nice time, partner!
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Invite />

        <ProfileDialog currentUsername={username} />
      </div>
    </div>
  );
}
