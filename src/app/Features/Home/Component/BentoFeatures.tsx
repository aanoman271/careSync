import React from "react";

export function BentoFeatures() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 w-full">
      <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Intelligent Care Infrastructure
      </h2>
      <div className="grid gap-6 md:grid-cols-12">
        <div className="flex flex-col justify-between rounded-3xl border border-border/40 bg-card/80 p-8 backdrop-blur-md transition-all hover:bg-primary/5 md:col-span-8">
          <div className="max-w-md">
            <h3 className="mb-4 text-xl font-semibold text-foreground">Smart Queue Generation</h3>
            <p className="text-base text-muted-foreground">
              Our AI predicts patient arrival times and optimizes scheduling to reduce waiting room congestion by up to 40%.
            </p>
          </div>
          <div className="mt-8">
            <div className="h-2 w-full overflow-hidden rounded-full bg-border/30">
              <div className="h-full w-[70%] rounded-full bg-primary" />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-3xl bg-primary p-8 text-center text-primary-foreground md:col-span-4">
          <span className="material-symbols-outlined mb-6 text-6xl">lock_reset</span>
          <h3 className="mb-2 text-lg font-semibold text-white">Secure 2FA</h3>
          <p className="text-sm opacity-80 text-white/95">Banking-grade biometric authentication for all sensitive medical data.</p>
        </div>

        <div className="flex flex-col justify-between rounded-3xl bg-green-500 p-8 text-white md:col-span-4">
          <span className="material-symbols-outlined text-4xl">notifications_active</span>
          <h3 className="text-lg font-semibold text-white">Smart Alerts</h3>
        </div>

        <div className="flex items-center gap-8 rounded-3xl border border-border/40 bg-card/80 p-8 backdrop-blur-md md:col-span-8">
          <div className="rounded-2xl bg-accent p-6 text-accent-foreground">
            <span className="material-symbols-outlined text-4xl">hub</span>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">Unified Healthcare API</h3>
            <p className="text-sm text-muted-foreground">
              Seamlessly sync data with pharmacies, labs, and insurance providers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
