import React from "react";
import { CheckCircle } from "lucide-react";

export function DoctorDashboard() {
  return (
    <section className="bg-foreground py-20 text-background w-full">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 grid grid-cols-2 gap-4 lg:order-1">
            {[
              { icon: "group", value: "24", label: "Patients Today" },
              { icon: "pending_actions", value: "8", label: "Pending Results" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
                <span className="material-symbols-outlined mb-4 text-4xl text-primary-foreground/80">{stat.icon}</span>
                <p className="mb-1 text-4xl font-bold text-white">{stat.value}</p>
                <p className="text-xs font-semibold uppercase tracking-widest opacity-60 text-white/80">{stat.label}</p>
              </div>
            ))}
            <div className="col-span-2 rounded-3xl bg-primary p-6">
              <div className="mb-6 flex items-center justify-between">
                <h4 className="text-lg font-bold text-primary-foreground">Active Consultation</h4>
                <span className="animate-pulse rounded-full bg-destructive px-3 py-1 text-xs text-white">LIVE</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/30" />
                <div>
                  <p className="font-bold text-primary-foreground">Johnathan Smith</p>
                  <p className="text-sm text-primary-foreground/80">ID: #CS-8923 • Hypertension</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 space-y-8 lg:order-2">
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              Built for the<br />
              <span className="text-primary">Modern Practice.</span>
            </h2>
            <p className="text-lg opacity-70 text-white/80">
              Reduce administrative burden with our intelligent workflow tools designed for clinical efficiency.
            </p>
            <ul className="space-y-4">
              {["Automated Queue Management", "One-Click EHR Integration", "Secure Video Consultations"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white">
                  <CheckCircle size={20} className="text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
