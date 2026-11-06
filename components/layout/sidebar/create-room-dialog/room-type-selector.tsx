import { Clock, Globe, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { CreateRoomType } from "@/schemas/room.schema";

const roomTypes = [
  {
    label: "Public",
    description: "Open to all listeners",
    value: "PUBLIC",
    icon: Globe,
    iconClassName: "text-primary",
  },
  {
    label: "Private",
    description: "Passcode protected",
    value: "PRIVATE",
    icon: Lock,
    iconClassName: "text-purple-400",
  },
  {
    label: "Temporary",
    description: "Auto-delete after time",
    value: "TEMPORARY",
    icon: Clock,
    iconClassName: "text-orange-400",
  },
] as const;

interface RoomTypeSelectorProps {
  duration?: CreateRoomType["duration"];
  onSelectTemporary: () => void;
  onSelectVisibility: (visibility: "PUBLIC" | "PRIVATE") => void;
  visibility?: CreateRoomType["visibility"];
}

export function RoomTypeSelector({
  duration,
  visibility,
  onSelectTemporary,
  onSelectVisibility,
}: RoomTypeSelectorProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
        Room Type
      </Label>

      <div className="grid grid-cols-3 gap-2">
        {roomTypes.map((type) => {
          const Icon = type.icon;
          const isSelected =
            type.value === "TEMPORARY"
              ? duration === "TEMPORARY"
              : visibility === type.value;

          return (
            <button
              className={cn(
                "cursor-pointer rounded-md border p-3 text-left transition-colors",
                isSelected
                  ? "border-primary bg-primary/10 text-foreground font-semibold shadow-2xs"
                  : "border-border bg-card text-muted-foreground hover:bg-muted"
              )}
              key={type.value}
              onClick={() => {
                if (type.value === "TEMPORARY") {
                  onSelectTemporary();
                } else {
                  onSelectVisibility(type.value);
                }
              }}
              type="button"
            >
              <Icon className={`mb-1 h-4 w-4 ${type.iconClassName}`} />

              <div className="text-foreground text-xs font-bold">
                {type.label}
              </div>

              <div className="text-muted-foreground text-nano mt-0.5">
                {type.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
