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
  X,
} from "lucide-react";
import { DaySlot } from "@/types/bookDoctor";
import { Stepper } from "@/app/Features/bookDoctor/component/Stteper";
import { getDoctorDetails } from "@/app/Features/doctors/data/data";

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface AvailableSlot {
  day: string;
  startTime?: string;
  endTime?: string;
}

interface DoctorUser {
  name: string;
  image?: string;
}

interface DoctorData {
  userId?: DoctorUser;
  specialization?: string;
  hospital?: string;
  rating?: number | string;
  availableSlots?: AvailableSlot[];
}

interface PatientInfo {
  name: string;
  age: string;
  disease: string;
}

interface ReviewForm {
  rating: number;
  comment: string;
}

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

// ─── Star Rating Input ────────────────────────────────────────────────────────

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={24}
            className={`transition-colors ${
              star <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-border"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 self-center text-xs text-muted-foreground">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
        </span>
      )}
    </div>
  );
}

// ─── Review Modal ─────────────────────────────────────────────────────────────

function ReviewModal({
  doctorName,
  onClose,
}: {
  doctorName: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ReviewForm>({ rating: 0, comment: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.rating || !form.comment.trim()) return;
    console.log("Review Submitted:", {
      doctor: doctorName,
      rating: form.rating,
      comment: form.comment,
      submittedAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Rate & Review
            </h3>
            <p className="text-xs text-muted-foreground">{doctorName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15">
              <Star size={28} className="fill-green-500 text-green-500" />
            </div>
            <p className="font-semibold text-foreground">
              Thank you for your review!
            </p>
            <p className="text-sm text-muted-foreground">
              Your feedback helps other patients make better decisions.
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Star Rating */}
            <div>
              <label className={labelClass}>Your Rating</label>
              <StarRatingInput
                value={form.rating}
                onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
              />
            </div>

            {/* Comment */}
            <div>
              <label className={labelClass}>Your Review</label>
              <textarea
                rows={4}
                placeholder="Share your experience with this doctor..."
                value={form.comment}
                onChange={(e) =>
                  setForm((f) => ({ ...f, comment: e.target.value }))
                }
                maxLength={300}
                className={fieldClass + " resize-none"}
              />
              <p className="mt-1 text-right text-[11px] text-muted-foreground">
                {form.comment.length}/300
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!form.rating || !form.comment.trim()}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

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
        {/* Name */}
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

        {/* Age */}
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

        {/* Disease / Reason */}
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

  // ── Continue Handler ──
  const handleContinue = () => {
    const payload = {
      doctorId: id,
      doctorName: doctor?.userId?.name,
      date: selectedDay.date,
      time: selectedTime,
      patient: {
        name: patientInfo.name,
        age: patientInfo.age,
        disease: patientInfo.disease,
      },
    };
    console.log("Booking Payload:", payload);
  };

  const isFormValid =
    !!selectedTime &&
    patientInfo.name.trim() &&
    patientInfo.age.trim() &&
    patientInfo.disease.trim();

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

              {/* Rate & Review Button */}
              <button
                onClick={() => setShowReviewModal(true)}
                className="flex shrink-0 items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:border-primary hover:text-primary"
              >
                <MessageSquare size={14} />
                Rate & Review
              </button>
            </div>

            {/* Day Picker */}
            <div className="rounded-xl border border-border/40 bg-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <h4 className="text-base font-semibold text-foreground">
                  Select Day
                </h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDayOffset((v) => Math.max(0, v - 1))}
                    disabled={!canPrev}
                    className="rounded-lg border border-border p-1.5 text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDayOffset((v) => Math.min(DAYS.length - 5, v + 1))
                    }
                    disabled={!canNext}
                    className="rounded-lg border border-border p-1.5 text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {visibleDays.map((d) => {
                  const globalIndex = DAYS.indexOf(d);
                  const isActive = globalIndex === selectedDayIndex;
                  const isDoctorAvailable = doctor.availableSlots?.some(
                    (slot: AvailableSlot) =>
                      slot?.day?.toLowerCase().slice(0, 3) ===
                      d.day.toLowerCase(),
                  );

                  return (
                    <button
                      key={d.date}
                      type="button"
                      disabled={!isDoctorAvailable}
                      onClick={() => handleDaySelect(globalIndex)}
                      className={`flex flex-col items-center rounded-xl border py-4 transition-all ${
                        isActive
                          ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : !isDoctorAvailable
                            ? "cursor-not-allowed border-dashed border-border/50 bg-muted/20 text-muted-foreground/30 opacity-50"
                            : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-primary/5"
                      }`}
                    >
                      <span
                        className={`text-[11px] font-semibold uppercase tracking-wider ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                      >
                        {d.day}
                      </span>
                      <span className="mt-1 text-2xl font-bold">
                        {d.dayNum}
                      </span>
                      <span
                        className={`mt-1 text-[10px] ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                      >
                        {isDoctorAvailable ? "Available" : "Off Day"}
                      </span>
                    </button>
                  );
                })}
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

                  {/* Patient info preview */}
                  {(patientInfo.name ||
                    patientInfo.age ||
                    patientInfo.disease) && (
                    <>
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
                    </>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!isFormValid}
                  onClick={handleContinue}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue to Confirm
                  <ArrowRight size={18} />
                </button>

                {!isFormValid && (
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
