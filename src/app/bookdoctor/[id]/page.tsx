"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import {
  MapPin,
  Star,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  Dot,
} from "lucide-react";
import {
  AvailableSlot,
  DaySlot,
  DoctorData,
  PatientInfo,
} from "@/types/bookDoctor";
import { Stepper } from "@/app/Features/bookDoctor/component/Stteper";
import { getDoctorDetails } from "@/app/Features/doctors/data/data";
import { ReviewModal } from "@/app/shared/RateReview";
import { useSession } from "next-auth/react";
import useAxios from "@/app/hooks/useAxios";
import Swal from "sweetalert2";
import { compare } from "bcryptjs";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseTimeStr(t: string | undefined): number {
  if (!t) return 10;
  const [h] = t.split(":");
  return parseInt(h, 10);
}

function generateTimeSlots(startStr?: string, endStr?: string): string[] {
  const start = parseTimeStr(startStr || "10:00");
  const end = parseTimeStr(endStr || "17:00");
  return Array.from({ length: end - start }, (_, i) => {
    const hour = start + i;
    return hour < 12
      ? `${hour}:00 AM`
      : hour === 12
        ? `12:00 PM`
        : `${hour - 12}:00 PM`;
  });
}

function generateDays(): DaySlot[] {
  const days: DaySlot[] = [];
  const today = new Date();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let count = 0;
  let offset = 0;
  while (count < 14) {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) {
      days.push({
        day: dayNames[dow],
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        dayNum: d.getDate(),
      });
      count++;
    }
    offset++;
  }
  return days;
}

const DAYS = generateDays();

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClass = "block text-xs font-semibold text-muted-foreground mb-1.5";

// ─── Patient Info Form ────────────────────────────────────────────────────────

function PatientInfoForm({
  value,
  onChange,
}: {
  value: PatientInfo;
  onChange: (v: PatientInfo) => void;
}) {
  return (
    <div className="rounded-xl border border-border/40 bg-card p-6">
      <h4 className="mb-5 text-base font-semibold text-foreground">
        Patient Information
      </h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            placeholder="e.g. John Doe"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Age</label>
          <input
            type="number"
            placeholder="e.g. 32"
            min={1}
            max={120}
            value={value.age}
            onChange={(e) => onChange({ ...value, age: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div>
          <label className={labelClass}>Chief Complaint / Disease</label>
          <input
            type="text"
            placeholder="e.g. Chest pain"
            value={value.disease}
            onChange={(e) => onChange({ ...value, disease: e.target.value })}
            className={fieldClass}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Day Card ─────────────────────────────────────────────────────────────────

function DayCard({
  d,
  isActive,
  isDoctorAvailable,
  onClick,
}: {
  d: DaySlot;
  isActive: boolean;
  isDoctorAvailable: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!isDoctorAvailable}
      onClick={onClick}
      className={`group relative flex flex-col items-center rounded-xl border py-3 transition-all duration-200 ${
        isActive
          ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
          : !isDoctorAvailable
            ? "cursor-not-allowed border-dashed border-border/40 bg-muted/10 opacity-40"
            : "border-border bg-background text-foreground hover:border-primary/60 hover:bg-primary/5 hover:shadow-sm"
      }`}
    >
      {/* Active check */}
      {isActive && (
        <span className="absolute right-1.5 top-1.5">
          <CheckCircle2 size={12} className="text-primary-foreground/80" />
        </span>
      )}

      {/* Day name */}
      <span
        className={`text-[10px] font-bold uppercase tracking-widest ${
          isActive
            ? "text-primary-foreground/70"
            : isDoctorAvailable
              ? "text-muted-foreground"
              : "text-muted-foreground/40"
        }`}
      >
        {d.day}
      </span>

      {/* Day number */}
      <span
        className={`my-1 text-xl font-bold leading-none ${
          isActive ? "text-primary-foreground" : "text-foreground"
        }`}
      >
        {d.dayNum}
      </span>

      {/* Status pill */}
      <span
        className={` font-semibold  tracking-wider ${
          isActive
            ? " text-primary-foreground"
            : isDoctorAvailable
              ? " text-green-600 dark:text-green-400"
              : " text-red-700"
        }`}
      >
        {/* {isDoctorAvailable ? "Open" : "Off"} */}
        <Dot size={30}></Dot>
      </span>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BookingSchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [doctor, setDoctor] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: "",
    age: "",
    disease: "",
  });

  const visibleDays = DAYS.slice(dayOffset, dayOffset + 5);
  const selectedDay = DAYS[selectedDayIndex];
  const canPrev = dayOffset > 0;
  const canNext = dayOffset + 5 < DAYS.length;

  const TIME_SLOTS = generateTimeSlots(
    doctor?.availableSlots?.[0]?.startTime,
    doctor?.availableSlots?.[0]?.endTime,
  );

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        const data = (await getDoctorDetails(id)) as DoctorData;
        setDoctor(data);
        if (data?.availableSlots) {
          const firstAvailableIndex = DAYS.findIndex((d) =>
            data.availableSlots!.some(
              (slot: AvailableSlot) =>
                slot.day.toLowerCase().slice(0, 3) === d.day.toLowerCase(),
            ),
          );
          if (firstAvailableIndex !== -1)
            setSelectedDayIndex(firstAvailableIndex);
        }
      } catch (error) {
        console.error("Failed to fetch doctor data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDoctorData();
  }, [id]);

  const isTimePassed = (slotLabel: string) => {
    const today = new Date();
    if (selectedDay.dayNum !== today.getDate()) return false;
    const [time, modifier] = slotLabel.split(" ");
    let [hours] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    return today.getHours() >= hours;
  };

  const handleDaySelect = (globalIndex: number) => {
    setSelectedDayIndex(globalIndex);
    setSelectedTime(null);
  };

  const axios = useAxios();
  const { data: session } = useSession();
  const user = session?.user;
  // ── Continue Handler ──
  const handleContinue = async () => {
    const payload = {
      patientId: user?.id,
      doctorId: id,
      date: selectedDay.date,
      time: selectedTime,
      status: "pending",
      patientCapacity: 3,
      patient: {
        name: patientInfo.name,
        age: patientInfo.age,
        disease: patientInfo.disease,
      },
    };

    try {
      setSubmitting(true);
      const response = await axios.post("/api/appointment", payload);

      if (response.data.success) {
        await Swal.fire({
          icon: "success",
          title: "Appointment Booked!",
          text: response.data.message,
          confirmButtonColor: "hsl(var(--primary))",
          background: "hsl(var(--card))",
          color: "hsl(var(--foreground))",
          confirmButtonText: "Great, thanks!",
          timer: 4000,
          timerProgressBar: true,
        });
      }
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const message =
        axiosError?.response?.data?.message ??
        "Something went wrong. Please try again.";

      await Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: message,
        confirmButtonColor: "hsl(var(--destructive))",
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
        confirmButtonText: "Try Again",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid =
    !!selectedTime &&
    patientInfo.name.trim() &&
    patientInfo.age.trim() &&
    patientInfo.disease.trim();

  // ── Loading ──
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="p-8 text-center text-destructive">Doctor not found!</div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          doctorName={doctor.userId?.name || "Doctor"}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
        {/* Stepper */}
        <div className="mb-8">
          <Stepper current={2} />
        </div>

        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Choose Your Slot
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select a convenient day and time, then fill in your details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ── Left Column ── */}
          <div className="space-y-6 lg:col-span-8">
            {/* Doctor Card */}
            <div className="flex flex-col items-center gap-5 rounded-xl border border-border/40 bg-card p-5 md:flex-row">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                <Image
                  src={
                    doctor.userId?.image ||
                    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=500"
                  }
                  alt={doctor.userId?.name || "Doctor"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="mb-1 text-lg font-bold text-primary">
                  {doctor.userId?.name || "Dr. Professional"}
                </h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  {doctor.specialization} • {doctor.hospital}
                </p>
                <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin size={13} className="text-primary" />
                    {doctor.hospital}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Star
                      size={13}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    {doctor.rating || "4.8"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                <MessageSquare size={14} />
                Rate & Review
              </button>
            </div>

            {/* Day Picker */}
            <div className="rounded-xl border border-border/40 bg-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Select Day
                  </h4>
                  <p className="text-[11px] text-muted-foreground">
                    {
                      DAYS.filter((_, i) =>
                        doctor.availableSlots?.some(
                          (s: AvailableSlot) =>
                            s.day.toLowerCase().slice(0, 3) ===
                            DAYS[i]?.day.toLowerCase(),
                        ),
                      ).length
                    }{" "}
                    available days
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDayOffset((v) => Math.max(0, v - 1))}
                    disabled={!canPrev}
                    className="rounded-lg border border-border p-1.5 text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDayOffset((v) => Math.min(DAYS.length - 5, v + 1))
                    }
                    disabled={!canNext}
                    className="rounded-lg border border-border p-1.5 text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {visibleDays.map((d) => {
                  const globalIndex = DAYS.indexOf(d);
                  const isActive = globalIndex === selectedDayIndex;
                  const isDoctorAvailable = doctor.availableSlots?.some(
                    (slot: AvailableSlot) =>
                      slot?.day?.toLowerCase().slice(0, 3) ===
                      d.day.toLowerCase(),
                  );

                  return (
                    <DayCard
                      key={d.date}
                      d={d}
                      isActive={isActive}
                      isDoctorAvailable={!!isDoctorAvailable}
                      onClick={() => handleDaySelect(globalIndex)}
                    />
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-3 flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />{" "}
                  Available
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full border border-border/50 bg-red-700" />{" "}
                  Off day
                </span>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />{" "}
                  Selected
                </span>
              </div>
            </div>

            {/* Time Slots */}
            <div className="rounded-xl border border-border/40 bg-card p-6">
              <h4 className="mb-5 text-base font-semibold text-foreground">
                Available Times —{" "}
                <span className="text-primary">{selectedDay.date}</span>
              </h4>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {TIME_SLOTS.map((slot) => {
                  const passed = isTimePassed(slot);
                  const isSelected = selectedTime === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={passed}
                      onClick={() => setSelectedTime(slot)}
                      className={`relative rounded-xl py-3 text-xs font-semibold transition-all ${
                        passed
                          ? "cursor-not-allowed border border-border/10 bg-muted/40 text-muted-foreground/30 line-through"
                          : isSelected
                            ? "scale-[1.02] bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "border border-border bg-background text-foreground hover:border-primary hover:bg-primary/5"
                      }`}
                    >
                      {slot}
                      {passed && (
                        <span className="absolute right-1.5 top-1 text-[7px] font-bold uppercase text-destructive/60">
                          Passed
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">
                Each slot is 1 hour. Please arrive 10 minutes early.
              </p>
            </div>

            {/* Patient Info Form */}
            <PatientInfoForm value={patientInfo} onChange={setPatientInfo} />
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              {/* Summary Card */}
              <div className="rounded-xl border border-primary/20 bg-card p-6">
                <h4 className="mb-5 text-base font-semibold text-foreground">
                  Appointment Summary
                </h4>

                <div className="space-y-3">
                  {[
                    { label: "Doctor", value: doctor.userId?.name || "—" },
                    { label: "Specialty", value: doctor.specialization || "—" },
                    { label: "Date", value: selectedDay.date },
                    {
                      label: "Time",
                      value: selectedTime ?? "—",
                      highlight: !!selectedTime,
                    },
                  ].map(({ label, value, highlight }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs text-muted-foreground">
                        {label}
                      </span>
                      <span
                        className={`text-xs font-semibold ${highlight ? "text-primary" : "text-foreground"}`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}

                  {(patientInfo.name ||
                    patientInfo.age ||
                    patientInfo.disease) && (
                    <div className="border-t border-border pt-3">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Patient
                      </p>
                      {patientInfo.name && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Name
                          </span>
                          <span className="text-xs font-semibold text-foreground">
                            {patientInfo.name}
                          </span>
                        </div>
                      )}
                      {patientInfo.age && (
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Age
                          </span>
                          <span className="text-xs font-semibold text-foreground">
                            {patientInfo.age} yrs
                          </span>
                        </div>
                      )}
                      {patientInfo.disease && (
                        <div className="mt-1.5 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Complaint
                          </span>
                          <span className=" truncate text-right text-xs font-semibold text-foreground">
                            {patientInfo.disease}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!isFormValid || submitting}
                  onClick={handleContinue}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      Booking...
                    </>
                  ) : (
                    <>
                      Continue to Confirm
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                {!isFormValid && !submitting && (
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    {!selectedTime
                      ? "Select a time slot to continue."
                      : "Fill in patient details to continue."}
                  </p>
                )}
              </div>

              {/* HIPAA Badge */}
              <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/30 p-4">
                <span className="material-symbols-outlined text-[20px] text-green-500">
                  verified_user
                </span>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    HIPAA Compliant
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Your data is encrypted end-to-end.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
