import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, FileText, AlertTriangle, CheckCircle2, ArrowRight, Activity, MapPin } from "lucide-react";
import { ResponsiveContainer, Tooltip, CartesianGrid, Area, AreaChart, XAxis, YAxis } from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { stats, crimesByMonth, Criminal } from "@/lib/mockData";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CRMS" },
      { name: "description", content: "Real-time crime statistics, active cases and criminal records overview." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const [recent, setRecent] = useState<Criminal[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/criminals")
      .then(res => res.json())
      .then(data => {
        const mapped = data.slice(0, 5).map((item: any) => ({
          ...item,
          caseId: item.case_id || "",
          name: item.criminal_name || "",
          crimeType: item.crime_type || "",
          status: item.status || "Wanted",
        }));
        setRecent(mapped);
      })
      .catch(console.error);
  }, []);

  return (
    <DashboardLayout title="Command Dashboard">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Criminals" value={stats.totalCriminals.toLocaleString()} delta="+12 this week" icon={Users} accent="neon" />
        <StatCard label="Active Cases" value={stats.activeCases} delta="+5.2% vs last month" icon={FileText} accent="warning" />
        <StatCard label="Wanted Criminals" value={stats.wantedCriminals} delta="3 high priority" icon={AlertTriangle} accent="destructive" />
        <StatCard label="Solved Cases" value={stats.solvedCases.toLocaleString()} delta="+74% resolution rate" icon={CheckCircle2} accent="success" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl glass p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold tracking-wide">Case Activity</h3>
              <p className="text-xs text-muted-foreground">Reported vs. solved · last 8 months</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-neon" /> Reported</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Solved</span>
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={crimesByMonth}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--neon)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--neon)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="cases" stroke="var(--neon)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="solved" stroke="var(--primary)" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl glass p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold tracking-wide">Live Activity</h3>
            <Activity className="h-4 w-4 text-neon" />
          </div>
          <ul className="mt-4 space-y-3">
            {[
              { t: "New case opened", s: "CS-01284 · Cyber Fraud", time: "2m ago", c: "bg-warning" },
              { t: "Suspect apprehended", s: "Marcus Vega · Robbery", time: "14m ago", c: "bg-success" },
              { t: "Evidence uploaded", s: "Case CS-01270", time: "1h ago", c: "bg-neon" },
              { t: "BOLO issued", s: "Elena Rios", time: "3h ago", c: "bg-destructive" },
              { t: "Case closed", s: "CS-01199 · Theft", time: "5h ago", c: "bg-success" },
            ].map((e, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card/40 p-3">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${e.c}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{e.t}</p>
                  <p className="truncate text-xs text-muted-foreground">{e.s}</p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{e.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl glass p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold tracking-wide">Recent Records</h3>
              <p className="text-xs text-muted-foreground">Latest entries in the database</p>
            </div>
            <Link to="/criminals" className="inline-flex items-center gap-1 text-xs text-neon hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-4 overflow-x-auto scrollbar-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="py-2 pr-4">Case</th>
                  <th className="pr-4">Name</th>
                  <th className="pr-4">Crime</th>
                  <th className="pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((c) => (
                  <tr key={c.caseId} className="border-t border-border/60">
                    <td className="py-3 pr-4 font-mono text-xs text-neon">{c.caseId}</td>
                    <td className="pr-4">{c.name}</td>
                    <td className="pr-4 text-muted-foreground">{c.crimeType}</td>
                    <td className="pr-4"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl glass p-5">
          <h3 className="text-sm font-semibold tracking-wide">Crime Hotspots</h3>
          <p className="text-xs text-muted-foreground">Top districts this week</p>
          <ul className="mt-4 space-y-3">
            {[
              { n: "Downtown", v: 84, c: "bg-destructive" },
              { n: "Eastside", v: 61, c: "bg-warning" },
              { n: "Harbor", v: 47, c: "bg-neon" },
              { n: "Northridge", v: 32, c: "bg-primary" },
            ].map((d) => (
              <li key={d.n}>
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3 text-muted-foreground" />{d.n}</span>
                  <span className="text-muted-foreground">{d.v} cases</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className={`h-full ${d.c}`} style={{ width: `${d.v}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
