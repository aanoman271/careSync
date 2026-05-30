"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

const filters = ["Cardiology", "Neurology", "Pediatrics", "Mental Health"];

export function DoctorSearch() {
  const [instantChat, setInstantChat] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Cardiology");

  return (
    <section className="bg-muted/30 px-4 py-16 md:px-8 w-full">
      <div className="relative z-20 mx-auto -mt-24 max-w-4xl rounded-3xl border border-border/40 bg-card/90 p-6 shadow-xl backdrop-blur-md md:p-8">
        <div className="grid gap-4 md:grid-cols-[1fr,auto,auto] items-end">
          <div className="space-y-2">
            <label className="px-2 text-xs font-bold text-foreground">Find a Doctor</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">search</span>
              <input
                type="text"
                placeholder="Search by name or condition..."
                className="w-full rounded-2xl border border-border bg-background py-4 pl-12 pr-4 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="px-2 text-xs font-bold text-foreground">Availability</label>
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-4">
              <span className="text-sm text-muted-foreground">Instant Chat</span>
              <button
                onClick={() => setInstantChat((v) => !v)}
                className={`relative h-6 w-10 rounded-full p-1 transition-all ${instantChat ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`h-4 w-4 rounded-full bg-white transition-transform ${instantChat ? "translate-x-4" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
          <button className="flex h-[60px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 font-bold text-primary-foreground transition-all hover:bg-primary/90">
            Search <ArrowRight size={18} />
          </button>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <span className="pt-2 text-xs text-muted-foreground">Quick Filters:</span>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-4 py-1.5 text-sm transition-all ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
