import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import loginBg from "@/assets/login-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CRMS — Secure Admin Login" },
      { name: "description", content: "Crime Record Management System admin portal. Secure access for authorized officers." },
      { property: "og:title", content: "CRMS — Secure Admin Login" },
      { property: "og:description", content: "Crime Record Management System admin portal." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <img
        src={loginBg}
        alt="Cybersecurity command center"
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/50 to-background/95" />
      <div className="absolute inset-0 bg-grid opacity-40" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-between gap-12 px-6 py-10 lg:px-10">
        <section className="hidden flex-1 lg:block">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs uppercase tracking-[0.2em] text-neon">
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-neon" />
            Secure Access · v4.2
          </div>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight xl:text-6xl">
            Crime Record <br />
            <span className="text-neon">Management</span> System
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground">
            Centralized intelligence for modern law enforcement. Track records,
            monitor cases, and coordinate field operations in real time.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              { k: "12K+", v: "Records" },
              { k: "99.9%", v: "Uptime" },
              { k: "AES-256", v: "Encrypted" },
            ].map((s) => (
              <div key={s.v} className="rounded-xl glass p-4">
                <p className="text-xl font-semibold text-neon">{s.k}</p>
                <p className="text-xs text-muted-foreground">{s.v}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full max-w-md">
          <div className="relative rounded-2xl glass-strong p-8 shadow-elev">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-neon/30 to-transparent opacity-40 [mask:linear-gradient(black,transparent_40%)] pointer-events-none" />
            <div className="relative">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-neon/10 ring-1 ring-neon/40 animate-glow">
                <Shield className="h-6 w-6 text-neon" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight">Admin Sign In</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Authorized personnel only. All activity is logged.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate({ to: "/dashboard" });
                }}
                className="mt-7 space-y-4"
              >
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Email
                  </label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      defaultValue="admin@crms.gov"
                      className="h-11 w-full rounded-lg bg-input/60 pl-10 pr-3 text-sm outline-none ring-1 ring-border focus:ring-neon transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Password
                  </label>
                  <div className="relative mt-1.5">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      defaultValue="••••••••"
                      className="h-11 w-full rounded-lg bg-input/60 pl-10 pr-10 text-sm outline-none ring-1 ring-border focus:ring-neon transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-muted-foreground">
                    <input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-[color:var(--neon)]" />
                    Remember device
                  </label>
                  <a href="#" className="text-neon hover:underline">Forgot password?</a>
                </div>
                <button
                  type="submit"
                  className="group mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-neon font-semibold text-neon-foreground shadow-neon transition hover:brightness-110"
                >
                  Sign in securely
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
              </form>
              <p className="mt-6 text-center text-xs text-muted-foreground">
                Protected by multi-factor authentication
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
