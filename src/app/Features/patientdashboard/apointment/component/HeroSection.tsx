"use client";

import { HeroSectionProps } from "@/types/apointment";
import { Calendar, Video, Activity } from "lucide-react";
import { useSession } from "next-auth/react";

export default function HeroSection({ appointmentList }: HeroSectionProps) {
  const { data: session } = useSession();
  const user = session?.user;
  console.log(appointmentList);
  // Extract name safely
  const rawName = user?.name || "Patient";
  const firstName = rawName.split(" ")[0];

  const totalAppointments = appointmentList?.length || 0;
  const nextAppointment = totalAppointments > 0 ? appointmentList[0] : null;
  const currentStatus =
    (nextAppointment?.status as unknown as string) || "Pending";

  return (
    <section className="mb-8">
      <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-card p-6 ring-1 ring-primary/20">
        {/* Decorative Blobs */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-secondary/5 blur-3xl" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          {/* Left Context: Dynamic Welcome Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">
              {nextAppointment ? (
                <>
                  Your health metrics are monitored. You have a{" "}
                  <span className="font-medium text-foreground">
                    {/* ◄ Added optional chaining and fallback string */}
                    {(nextAppointment?.specialty || "General").toLowerCase()}
                  </span>{" "}
                  consultation with{" "}
                  <span className="font-medium text-foreground">
                    {nextAppointment?.doctor || "Specialist"}
                  </span>{" "}
                  scheduled for{" "}
                  {nextAppointment?.date?.toLowerCase() === "today"
                    ? "today"
                    : `on ${nextAppointment?.date || "scheduled date"}`}{" "}
                  at {nextAppointment?.time || "scheduled time"}.
                </>
              ) : (
                "Your health metrics are stable. No medical consultations are currently synced to your upcoming ledger."
              )}
            </p>
          </div>

          {/* Right Context: Action Controller */}
          {nextAppointment ? (
            <div className="flex w-full flex-col gap-4 rounded-xl border border-border/30 bg-background/50 p-4 backdrop-blur-sm sm:w-auto sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                  <Calendar size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Next Appointment
                  </p>
                  <p className="text-sm font-semibold text-foreground sm:text-base whitespace-nowrap">
                    {nextAppointment?.date || "N/A"},{" "}
                    {nextAppointment?.time || "N/A"}
                  </p>
                </div>
              </div>

              {/* ◄ Smart Action Check with fallback to MapPin if actionType is missing */}
              <button
                disabled={
                  currentStatus !== "Confirmed" && currentStatus !== "Approved"
                }
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 ${
                  currentStatus !== "Confirmed" && currentStatus !== "Approved"
                    ? "opacity-60 cursor-not-allowed"
                    : ""
                }`}
              >
                <Video size={15} />
                <span>
                  {currentStatus === "Confirmed" || currentStatus === "Approved"
                    ? "Join Meeting"
                    : "waiting for approve"}
                </span>
              </button>
            </div>
          ) : (
            <div className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border p-4 bg-background/20 sm:w-auto">
              <Activity
                size={18}
                className="text-muted-foreground animate-pulse"
              />
              <p className="text-xs font-medium text-muted-foreground">
                Health ledger fully synchronized
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
