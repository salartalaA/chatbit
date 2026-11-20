"use client";

import { Share2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function Invite() {
  const pathname = usePathname();

  const handleShare = async () => {
    const pageURL = window.location.href;

    if (navigator.share) {
      await navigator.share({
        url: pageURL,
      });
    } else {
      await navigator.clipboard.writeText(pageURL);

      toast.success("Url copied to clipboard!");
    }
  };

  if (pathname === "/") {
    return null;
  }

  return (
    <Button
      className={"gap-1.5 p-2.5"}
      onClick={handleShare}
      size={"xs"}
      variant={"outline"}
    >
      <Share2 className="size-3.5" />
      <span className="hidden md:inline">Invite</span>
    </Button>
  );
}
