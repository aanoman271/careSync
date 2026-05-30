"use client";

import { useState } from "react";
import { CheckCircle, History, ChevronRight, Lock } from "lucide-react";

export function PatientDashboardPreview() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">("upcoming");

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 w-full">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Your Health,<br />
            <span className="text-primary">Always Accessible.</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            The CareSync patient portal puts you in control. Access medical history, prescriptions,
            and lab results in one centralized dashboard.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <CheckCircle size={22} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="font-bold text-foreground">HIPAA Compliant Storage</p>
                <p className="text-sm text-muted-foreground">Your data is encrypted and secure at all times.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-2xl border border-border p-4">
              <History size={22} className="mt-0.5 shrink-0 text-muted-foreground" />
              <div>
                <p className="font-bold text-foreground">Universal Health Record</p>
                <p className="text-sm text-muted-foreground">Share your history with any specialist instantly.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-border/40 bg-card/80 p-8 shadow-xl backdrop-blur-md">
          <div className="mb-6 flex gap-4 border-b border-border pb-2">
            {(["upcoming", "history"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 px-2 text-sm font-bold capitalize transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-primary text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {activeTab === "upcoming" ? (
              <>
                <div className="group flex items-center justify-between rounded-2xl border border-border/30 bg-background p-4 transition-all hover:border-primary">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-accent">
                      <span className="text-[10px] font-bold">OCT</span>
                      <span className="text-lg font-bold leading-tight">12</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Cardiology Consultation</p>
                      <p className="text-sm text-muted-foreground">Dr. Robert Chen • 10:30 AM</p>
                    </div>
                  </div>
                  <button className="rounded-full p-2 text-primary transition-colors hover:bg-primary/10">
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-border/30 bg-background p-4 opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-muted">
                      <span className="text-[10px] font-bold">OCT</span>
                      <span className="text-lg font-bold leading-tight">15</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Annual Wellness Visit</p>
                      <p className="text-sm text-muted-foreground">Dr. Sarah Laine • 02:00 PM</p>
                    </div>
                  </div>
                  <Lock size={18} className="text-muted-foreground" />
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No past consultations found.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
