"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { ArrowRight, MoreHorizontal } from "lucide-react";
import { queue, stats, statusStyles } from "@/app/Features/dashboard/data";

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <>
      {/* Header Section */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end mb-8 w-full">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Clinical Overview
          </h1>
          <p className="mt-1 text-base text-muted-foreground">
            Welcome back{user?.name ? `, ${user.name}` : ""}. You have 4 patient
            reviews pending today.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="rounded-lg border border-primary px-6 py-2.5 text-xs font-semibold text-primary transition-all hover:bg-primary/5">
            Export Report
          </button>
          <button className="rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-95">
            New Appointment
          </button>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-12 w-full">
        {/* Patient Flow Analytics */}
        <div className="group relative overflow-hidden rounded-xl border border-border/10 bg-card p-6 transition-all duration-500 hover:border-primary/30 md:col-span-8">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Patient Flow Analytics
            </h3>
            <button className="text-muted-foreground transition-colors hover:text-primary">
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* Background decoration */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
            <span className="material-symbols-outlined animate-pulse text-[120px] text-primary/30">
              query_stats
            </span>
          </div>

          {/* Stats */}
          <div className="relative z-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border/10 bg-muted/50 p-4"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
                <p className={`mt-1 text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Queue */}
        <div className="flex flex-col rounded-xl border border-border/10 bg-card p-6 transition-all duration-500 hover:border-primary/30 md:col-span-4">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Queue</h3>
            <Link
              href="#"
              className="text-xs font-bold text-primary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="flex-1 space-y-4">
            {queue.map((item) => (
              <div
                key={item.name}
                className={`flex items-center gap-4 rounded-lg border-l-4 bg-muted/30 p-4 transition-colors hover:bg-muted ${statusStyles[item.status].border}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-primary">
                  {item.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span
                    className={`block text-xs font-semibold ${statusStyles[item.status].text}`}
                  >
                    {item.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lab Sync */}
        <div className="flex flex-col gap-4 rounded-xl border border-border/10 bg-card p-6 transition-all hover:border-primary/30 md:col-span-4">
          <span className="material-symbols-outlined text-[32px] text-primary">
            chip_extraction
          </span>
          <h4 className="text-lg font-semibold text-foreground">Lab Sync</h4>
          <p className="text-sm text-muted-foreground">
            Auto-importing 12 new results from Central Lab Services.
          </p>
          <div className="mt-auto h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-3/4 rounded-full bg-primary" />
          </div>
        </div>

        {/* HIPAA Compliance */}
        <div className="flex flex-col gap-4 rounded-xl border border-border/10 bg-card p-6 transition-all hover:border-primary/30 md:col-span-4">
          <span className="material-symbols-outlined text-[32px] text-green-400">
            shield_with_heart
          </span>
          <h4 className="text-lg font-semibold text-foreground">
            HIPAA Compliance
          </h4>
          <p className="text-sm text-muted-foreground">
            Privacy protocols are active. All data transmission is encrypted
            (AES-256).
          </p>
          <div className="mt-auto flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs font-semibold text-green-400">
              Secure Connection
            </span>
          </div>
        </div>

        {/* AI Insights */}
        <div className="flex flex-col gap-4 rounded-xl border border-border/10 bg-card bg-gradient-to-br from-primary/5 to-transparent p-6 transition-all hover:border-primary/30 md:col-span-4">
          <span className="material-symbols-outlined text-[32px] text-primary">
            science
          </span>
          <h4 className="text-lg font-semibold text-foreground">AI Insights</h4>
          <p className="text-sm text-muted-foreground">
            Predictive analysis suggests a 15% increase in respiratory cases
            this week.
          </p>
          <button className="group/btn mt-auto flex items-center gap-1 text-left text-xs font-semibold text-primary transition-all hover:gap-3">
            Review Trends
            <ArrowRight
              size={14}
              className="transition-transform group-hover/btn:translate-x-1"
            />
          </button>
        </div>
      </section>
    </>
  );
}
