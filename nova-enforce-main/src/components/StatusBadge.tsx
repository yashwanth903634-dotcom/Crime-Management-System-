import { CriminalStatus } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: CriminalStatus }) {
  const map: Record<CriminalStatus, string> = {
    Wanted: "bg-destructive/15 text-destructive ring-destructive/30",
    Arrested: "bg-warning/15 text-warning ring-warning/30",
    Released: "bg-muted text-muted-foreground ring-border",
    "In Custody": "bg-neon/15 text-neon ring-neon/30",
  };
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1",
      map[status],
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
