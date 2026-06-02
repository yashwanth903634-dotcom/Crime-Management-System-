import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, delta, icon: Icon, accent = "neon",
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  accent?: "neon" | "primary" | "success" | "warning" | "destructive";
}) {
  const accentMap: Record<string, string> = {
    neon: "text-neon bg-neon/10 ring-neon/30",
    primary: "text-primary-foreground bg-primary/30 ring-primary/40",
    success: "text-success bg-success/10 ring-success/30",
    warning: "text-warning bg-warning/10 ring-warning/30",
    destructive: "text-destructive bg-destructive/10 ring-destructive/30",
  };
  return (
    <div className="group relative overflow-hidden rounded-2xl glass p-5 transition hover:-translate-y-0.5 hover:shadow-elev">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-neon/5 blur-3xl transition group-hover:bg-neon/10" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {delta && (
            <p className="mt-1 text-xs text-success">{delta}</p>
          )}
        </div>
        <div className={cn("grid h-11 w-11 place-items-center rounded-xl ring-1", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
