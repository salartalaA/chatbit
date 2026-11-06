import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreateRoomType } from "@/schemas/room.schema";

const categories = [
  { label: "Lo-Fi & Chill", value: "LOFI_AND_CHILL" },
  { label: "Synthwave & Retro", value: "SYNTHWAVE_AND_RETRO" },
  { label: "Deep Ambient", value: "DEEP_AMBIENT" },
  { label: "Gaming & Beats", value: "GAMING_AND_BEATS" },
  { label: "Study & Focus", value: "STUDY_AND_FOCUS" },
  { label: "Late Night Talk", value: "LATE_NIGHT_TALK" },
] as const;

interface CategorySelectProps {
  onValueChange: (value: CreateRoomType["category"]) => void;
  value: CreateRoomType["category"];
}

export function CategorySelect({ value, onValueChange }: CategorySelectProps) {
  const currentCategory = categories.find((item) => item.value === value);

  return (
    <div className="space-y-1">
      <Label className="text-foreground text-xs font-medium">Category</Label>

      <Select
        onValueChange={(val) =>
          onValueChange(val as CreateRoomType["category"])
        }
        value={value}
      >
        <SelectTrigger className="bg-background border-border text-foreground focus-visible:ring-ring w-full cursor-pointer rounded-md border px-3 py-1.5 text-sm focus-visible:ring-1">
          <SelectValue>{currentCategory?.label}</SelectValue>
        </SelectTrigger>

        <SelectContent>
          {categories.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
