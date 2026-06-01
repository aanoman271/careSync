"use client";
import { ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { cardClass } from "@/utils/cardVariants";
import { HISTORY } from "@/app/Features/patientdashboard/data/data";

export default function HistorySection() {
  const [search, setSearch] = useState("");

  const filtered = HISTORY.filter(
    (h) =>
      h.practitioner.toLowerCase().includes(search.toLowerCase()) ||
      h.specialty.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="w-full flex flex-col justify-start ">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col justify-between gap-4 md:flex-row md:items-end">
          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Appointment History
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and review past patient consultations and diagnostic
              visits.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Pills */}
            <div className="flex rounded-full border border-border/40 bg-muted p-1">
              <button>active</button>
              <button>complete</button>
              <button>cancel</button>
            </div>

            {/* Advanced Filters */}
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              <SlidersHorizontal size={15} />
              Advanced Filters
            </button>
          </div>
        </div>
        <div className="w-full lg:w-80 flex items-center gap-2 rounded-lg border border-border/40 bg-card px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden w-full overflow-hidden rounded-xl border border-border/40 bg-card md:block">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-muted/50">
              <tr>
                {[
                  "Date",
                  "Time",
                  "Practitioner",
                  "Specialty",
                  "Status",
                  "Action",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-6 py-4 text-sm text-foreground">
                    {item.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {item.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {item.practitioner}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {item.specialty}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded px-2 py-1 text-[11px] font-bold uppercase tracking-tight ${
                        item.status === "Completed"
                          ? "bg-green-500/10 text-green-500"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs font-bold text-primary transition-colors hover:text-primary/80">
                      {item.status === "Completed" ? "Summary" : "Details"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((item) => (
          <div key={item.id} className={cardClass}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  {item.practitioner}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.specialty}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.date} • {item.time}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase ${
                    item.status === "Completed"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {item.status}
                </span>
                <button className="flex items-center gap-1 text-xs font-bold text-primary">
                  {item.status === "Completed" ? "Summary" : "Details"}
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No results found.
          </p>
        )}
      </div>
    </section>
  );
}
