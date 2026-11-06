import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@/components/ui/dialog";

interface CreateRoomTriggerProps {
  isWide?: boolean;
}

export function CreateRoomTrigger({ isWide = false }: CreateRoomTriggerProps) {
  if (isWide) {
    return (
      <DialogTrigger
        render={
          <Button className="gap-2 font-semibold shadow-xs">
            <Plus className="h-4 w-4" />
            Create New Sound Lounge
          </Button>
        }
      />
    );
  }

  return (
    <DialogTrigger
      render={
        <Button className="h-7 gap-1 px-2 text-xs" size="sm" variant="outline">
          <Plus className="size-3.5" />
          New
        </Button>
      }
    />
  );
}
