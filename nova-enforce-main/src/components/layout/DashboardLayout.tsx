import { ReactNode, useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, BarChart3, Shield, Bell, Search,
  LogOut, Menu, X, Settings, FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/criminals", label: "Criminal Records", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/dashboard", label: "Cases", icon: FileText },
  { to: "/dashboard", label: "Settings", icon: Settings },
];

export function DashboardLayout({ children, title }: { children: ReactNode; title?: string }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen w-full bg-background text-foreground bg-grid">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-neon/10 ring-1 ring-neon/40 animate-glow">
            <Shield className="h-5 w-5 text-neon" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">CRMS</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Police Suite</p>
          </div>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item, i) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={i}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-neon/10 text-neon shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--neon)_30%,transparent)]"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-neon shadow-neon" />}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-4 left-3 right-3">
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 h-16 border-b border-border glass-strong">
          <div className="flex h-full items-center gap-3 px-4 lg:px-8">
            <button
              className="lg:hidden rounded-md p-2 hover:bg-accent"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-base font-semibold tracking-tight">{title ?? "Overview"}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Secure command center · Real-time intelligence
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search records, cases, IDs…"
                  className="h-9 w-72 rounded-lg bg-secondary/60 pl-9 pr-3 text-sm outline-none ring-1 ring-border focus:ring-neon/60 transition"
                />
              </div>
              <button className="relative rounded-lg p-2 hover:bg-accent">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-neon shadow-neon" />
              </button>
              <div className="flex items-center gap-2 rounded-lg bg-secondary/60 px-2 py-1.5 ring-1 ring-border">
                <div className="grid h-7 w-7 place-items-center rounded-md bg-neon/15 text-xs font-semibold text-neon">
                  AD
                </div>
                <div className="hidden sm:block text-xs leading-tight">
                  <p className="font-medium">Admin</p>
                  <p className="text-muted-foreground">Chief Officer</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8 animate-fade-up">{children}</main>
      </div>
    </div>
  );
}
