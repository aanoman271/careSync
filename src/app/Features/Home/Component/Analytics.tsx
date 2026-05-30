import React from "react";

const chartBars = [40, 55, 45, 70, 85, 95, 100];

export function Analytics() {
  return (
    <section className="bg-muted/30 py-20 w-full">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Impact in Numbers</h2>
            <p className="text-base text-muted-foreground">
              We're transforming how healthcare is delivered and managed across the country.
            </p>
            <div className="space-y-4">
              {[
                { label: "Active Patients", value: "150,000+" },
                { label: "Partner Clinics", value: "1,200+" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-sm">
                  <span className="font-bold text-foreground">{stat.label}</span>
                  <span className="text-xl font-bold text-primary">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/40 bg-card/80 p-8 shadow-xl backdrop-blur-md lg:col-span-2">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="font-bold text-foreground">Platform Growth (2024)</h3>
              <div className="flex gap-4">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Patients
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-green-500" /> Doctors
                </span>
              </div>
            </div>
            <div className="flex h-64 items-end gap-3">
              {chartBars.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-lg transition-all hover:bg-primary ${
                    i === chartBars.length - 1 ? "bg-primary" : "bg-primary/20"
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
