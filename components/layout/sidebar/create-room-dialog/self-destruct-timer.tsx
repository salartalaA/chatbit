import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const selfDestructTimers = [
  { label: "15m", value: "15" },
  { label: "1h", value: "60" },
  { label: "6h", value: "360" },
  { label: "24h", value: "1440" },
] as const;

interface SelfDestructTimerProps {
  durationMinutes: string;
  onSelectDuration: (value: "15" | "60" | "360" | "1440") => void;
}

export function SelfDestructTimer({
  durationMinutes,
  onSelectDuration,
}: SelfDestructTimerProps) {
  return (
    <div className="bg-muted border-border space-y-1.5 rounded-md border p-3">
      <Label className="text-foreground block text-xs font-medium">
        Self-Destruct Timer
      </Label>

      <div className="flex gap-2">
        {selfDestructTimers.map((dur) => (
          <button
            className={cn(
              "flex-1 cursor-pointer rounded border py-1 text-xs font-medium transition-colors",
              durationMinutes === dur.value
                ? "bg-primary text-primary-foreground border-primary font-bold"
                : "bg-background border-border text-muted-foreground hover:bg-muted"
            )}
            key={dur.label}
            onClick={() => onSelectDuration(dur.value)}
            type="button"
          >
            {dur.label}
          </button>
        ))}
      </div>
    </div>
  );
}
