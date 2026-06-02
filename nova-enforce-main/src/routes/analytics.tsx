import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, Activity, ShieldAlert, Users } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { crimesByMonth, crimeDistribution } from "@/lib/mockData";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — CRMS" },
      { name: "description", content: "Crime statistics, distribution and trend analytics." },
    ],
  }),
  component: AnalyticsPage,
});

const COLORS = ["var(--neon)", "var(--primary)", "var(--success)", "var(--warning)", "var(--destructive)", "var(--muted-foreground)"];

function AnalyticsPage() {
  return (
    <DashboardLayout title="Analytics & Insights">
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Resolution Rate" value="74%" delta="+3.2% vs Q2" icon={TrendingUp} accent="success" />
        <StatCard label="Avg. Response" value="6m 12s" delta="-18s improvement" icon={Activity} accent="neon" />
        <StatCard label="High-Risk Zones" value="9" delta="2 new this month" icon={ShieldAlert} accent="destructive" />
        <StatCard label="Officers On Duty" value="142" delta="Across 4 stations" icon={Users} accent="primary" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-2xl glass p-5">
          <h3 className="text-sm font-semibold tracking-wide">Cases by Month</h3>
          <p className="text-xs text-muted-foreground">Reported vs. solved</p>
          <div className="mt-4 h-80">
            <ResponsiveContainer>
              <BarChart data={crimesByMonth} barGap={6}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} cursor={{ fill: "var(--secondary)", opacity: 0.4 }} />
                <Bar dataKey="cases" fill="var(--neon)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="solved" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-2xl glass p-5">
          <h3 className="text-sm font-semibold tracking-wide">Crime Distribution</h3>
          <p className="text-xs text-muted-foreground">All categories · YTD</p>
          <div className="mt-4 h-80">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={crimeDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  stroke="var(--card)"
                >
                  {crimeDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {[
          { label: "Cybercrime growth", value: "+38%", desc: "Year over year" },
          { label: "Repeat offenders", value: "12%", desc: "Of total population" },
          { label: "Case closure speed", value: "9.4d", desc: "Average per case" },
        ].map((m) => (
          <div key={m.label} className="rounded-2xl glass p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{m.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-neon">{m.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{m.desc}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
