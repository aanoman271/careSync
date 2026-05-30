"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, AlertCircle, Camera } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useAxios from "@/app/hooks/useAxios";
import useSweetAlert from "@/app/hooks/useSweetAlert";
// ─── Types ────────────────────────────────────────────────────────────────────

type DoctorFormData = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  gender: string;
  specialization: string;
  experience: number;
  hospital: string;
  licenseNumber: string;
  qualification: string;
  consultationFee: number;
  bio: string;
  timeFrom: string;
  timeTo: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fieldClass = (hasError?: boolean) =>
  `w-full rounded-lg border bg-background py-2.5 px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/40 focus:ring-2 ${
    hasError
      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
      : "border-border focus:border-primary focus:ring-primary/20"
  }`;

const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-muted-foreground";

const ErrorMsg = ({ message }: { message?: string }) =>
  message ? (
    <p className="flex items-center gap-1.5 text-xs text-destructive">
      <AlertCircle size={13} />
      {message}
    </p>
  ) : null;

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SPECIALIZATIONS = [
  "Cardiology",
  "Neurology",
  "Pediatrics",
  "Oncology",
  "Dermatology",
  "General Practice",
];

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/20 bg-card p-6">
      <h2 className="mb-5 flex items-center gap-2 text-base font-semibold text-primary">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DoctorRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bioLength, setBioLength] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<DoctorFormData>();

  const toggleDay = (day: string) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }
    
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };
  // hook
  const router = useRouter();
  const axios = useAxios();
  const { successAlert, errorAlert } = useSweetAlert();
  const onSubmit = async (data: DoctorFormData) => {
    try {
      // Validate available days
      if (selectedDays.length === 0) {
        errorAlert({
          title: "Missing Information",
          text: "Please select at least one available day.",
        });
        return;
      }

      // Prepare available slots from selected days and time
      const availableSlots = selectedDays.map((day) => ({
        day,
        startTime: data.timeFrom,
        endTime: data.timeTo,
      }));

      let imageUrl = "";

      if (profileImage) {
        const imgData = new FormData();
        imgData.append("image", profileImage);
        const imgRes = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
          {
            method: "POST",
            body: imgData,
          }
        );
        const imgJson = await imgRes.json();
        if (imgJson.success) {
          imageUrl = imgJson.data.display_url;
        }
      }

      const formData = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        gender: data.gender,
        image: imageUrl,
        role: "doctor",
        specialization: data.specialization,
        experience: Number(data.experience),
        hospital: data.hospital,
        qualification: data.qualification,
        consultationFee: Number(data.consultationFee),
        availableSlots,
      };

      await axios.post("/api/auth/register/doctor", formData);

      await successAlert({
        title: "Application Submitted!",
        text: "Your profile is under review. You will be notified once approved by admin.",
      });

      // Redirect to login after success
      router.push("/login");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      errorAlert({
        title: "Registration Failed",
        text: message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Main ── */}
      <main className="mx-auto max-w-4xl px-4 py-10 md:px-8">
        {/* Page Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Join the Medical Network
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Empower your practice with CareSync. Connect with patients through
            our HIPAA-compliant clinical infrastructure.
          </p>
        </div>

        {/* Form Grid */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid grid-cols-1 gap-6 md:grid-cols-12"
        >
          {/* ── Left Column ── */}
          <div className="space-y-6 md:col-span-8">
            {/* Professional Identity */}
            <SectionCard icon="person_pin" title="Professional Identity">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Dr. Jane Smith"
                    {...register("fullName", {
                      required: "Full name is required.",
                    })}
                    className={fieldClass(!!errors.fullName)}
                  />
                  <ErrorMsg message={errors.fullName?.message} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Institutional Email</label>
                  <input
                    type="email"
                    placeholder="jane.smith@hospital.com"
                    {...register("email", {
                      required: "Email is required.",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address.",
                      },
                    })}
                    className={fieldClass(!!errors.email)}
                  />
                  <ErrorMsg message={errors.email?.message} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password", {
                        required: "Password is required.",
                        minLength: {
                          value: 8,
                          message: "At least 8 characters.",
                        },
                      })}
                      className={fieldClass(!!errors.password) + " pr-12"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="Toggle password"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <ErrorMsg message={errors.password?.message} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    {...register("phone", {
                      required: "Phone number is required.",
                      pattern: {
                        value: /^[+\d\s\-()]{7,15}$/,
                        message: "Enter a valid phone number.",
                      },
                    })}
                    className={fieldClass(!!errors.phone)}
                  />
                  <ErrorMsg message={errors.phone?.message} />
                </div>

                {/* Gender */}
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className={labelClass}>Gender</label>
                  <select
                    {...register("gender", { required: "Please select a gender." })}
                    className={fieldClass(!!errors.gender)}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not">Prefer not to say</option>
                  </select>
                  <ErrorMsg message={errors.gender?.message} />
                </div>
              </div>
            </SectionCard>

            {/* Clinical Specialization */}
            <SectionCard
              icon="medical_services"
              title="Clinical Specialization"
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Specialization</label>
                  <select
                    {...register("specialization", {
                      required: "Please select a specialization.",
                    })}
                    className={fieldClass(!!errors.specialization)}
                  >
                    <option value="">Select specialization</option>
                    {SPECIALIZATIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <ErrorMsg message={errors.specialization?.message} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Years of Experience</label>
                  <input
                    type="number"
                    placeholder="10"
                    {...register("experience", {
                      required: "Experience is required.",
                      min: { value: 0, message: "Must be 0 or more." },
                    })}
                    className={fieldClass(!!errors.experience)}
                  />
                  <ErrorMsg message={errors.experience?.message} />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label className={labelClass}>Hospital / Clinic Name</label>
                  <input
                    type="text"
                    placeholder="Central City Medical Center"
                    {...register("hospital", {
                      required: "Hospital name is required.",
                    })}
                    className={fieldClass(!!errors.hospital)}
                  />
                  <ErrorMsg message={errors.hospital?.message} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Medical License Number</label>
                  <input
                    type="text"
                    placeholder="MLN-88293-XP"
                    {...register("licenseNumber", {
                      required: "License number is required.",
                    })}
                    className={fieldClass(!!errors.licenseNumber)}
                  />
                  <ErrorMsg message={errors.licenseNumber?.message} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Qualification</label>
                  <input
                    type="text"
                    placeholder="MD, PhD, FACS"
                    {...register("qualification", {
                      required: "Qualification is required.",
                    })}
                    className={fieldClass(!!errors.qualification)}
                  />
                  <ErrorMsg message={errors.qualification?.message} />
                </div>
              </div>
            </SectionCard>

            {/* Availability & Fees */}
            <SectionCard icon="calendar_clock" title="Availability & Fees">
              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Consultation Fee (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      $
                    </span>
                    <input
                      type="number"
                      placeholder="150"
                      {...register("consultationFee", {
                        required: "Consultation fee is required.",
                        min: { value: 0, message: "Must be 0 or more." },
                      })}
                      className={fieldClass(!!errors.consultationFee) + " pl-8"}
                    />
                  </div>
                  <ErrorMsg message={errors.consultationFee?.message} />
                </div>

                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Available Days</label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-all ${
                          selectedDays.includes(day)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Available Time Slots</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="time"
                      defaultValue="09:00"
                      {...register("timeFrom", { required: true })}
                      className={fieldClass(!!errors.timeFrom)}
                    />
                    <input
                      type="time"
                      defaultValue="17:00"
                      {...register("timeTo", { required: true })}
                      className={fieldClass(!!errors.timeTo)}
                    />
                  </div>
                  {(errors.timeFrom || errors.timeTo) && (
                    <ErrorMsg message="Please set your available time slot." />
                  )}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* ── Right Column ── */}
          <div className="space-y-6 md:col-span-4">
            {/* Profile Image */}
            <div className="rounded-xl border border-border/20 bg-card p-6 text-center">
              <label className={labelClass + " mb-4 block"}>
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                ref={fileRef}
                className="hidden"
                onChange={handleProfileUpload}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="group relative mx-auto flex h-32 w-32 flex-col items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border transition-all hover:border-primary"
              >
                {profilePreview ? (
                  <Image
                    src={profilePreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    width={150}
                    height={150}
                  />
                ) : (
                  <>
                    {/* aanoman291_db_user  DuniPRsiHz4bfAKC */}
                    <Camera
                      size={30}
                      className="text-muted-foreground transition-colors group-hover:text-primary"
                    />
                    <span className="mt-1 text-[10px] font-bold uppercase text-muted-foreground group-hover:text-primary">
                      Upload
                    </span>
                  </>
                )}
              </button>
              <p className="mt-4 text-xs text-muted-foreground">
                Upload a professional headshot. JPEG or PNG, max 2MB.
              </p>
            </div>

            {/* Bio */}
            <div className="rounded-xl border border-border/20 bg-card p-6">
              <label className={labelClass + " mb-3 block"}>
                Bio / Professional Summary
              </label>
              <textarea
                rows={8}
                maxLength={500}
                placeholder="Briefly describe your clinical focus and approach to patient care..."
                {...register("bio", { required: "Bio is required." })}
                onChange={(e) => setBioLength(e.target.value.length)}
                className={fieldClass(!!errors.bio) + " resize-none"}
              />
              <div className="mt-1.5 flex items-center justify-between">
                <ErrorMsg message={errors.bio?.message} />
                <span className="ml-auto text-xs text-muted-foreground">
                  {bioLength} / 500
                </span>
              </div>
            </div>

            {/* Security & Submit */}
            <div className="rounded-xl border border-border/20 bg-card p-5">
              <div className="mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">
                  verified_user
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  HIPAA Compliant Cloud
                </span>
              </div>
              <p className="mb-5 text-xs leading-relaxed text-muted-foreground">
                Your data is encrypted using AES-256 standards. We ensure 100%
                compliance with global healthcare privacy regulations.
              </p>
              <button
                type="submit"
                disabled={isSubmitting || isSubmitSuccessful}
                className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Validating Credentials...
                  </span>
                ) : isSubmitSuccessful ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">
                      check_circle
                    </span>
                    Application Submitted
                  </span>
                ) : (
                  "Create Professional Profile"
                )}
              </button>
            </div>
          </div>
        </form>
      </main>

      {/* ── Footer ── */}
      <footer className="mt-12 border-t border-border/20 bg-card px-4 py-10 md:px-8">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <span className="text-base font-bold text-foreground">
              CareSync
            </span>
            <p className="text-xs text-muted-foreground">
              The future of clinical precision and patient care connectivity.
            </p>
            <div className="mt-1 flex gap-3">
              {["HIPAA", "SOC2"].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-1 rounded border border-border/30 bg-muted px-2 py-1"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary">
                    {badge === "HIPAA" ? "security" : "gpp_good"}
                  </span>
                  <span className="text-[10px] font-bold text-foreground">
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-primary">
              Platform
            </h4>
            {["Privacy Policy", "Terms of Service", "Security Protocol"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-xs text-muted-foreground hover:underline"
                >
                  {item}
                </Link>
              ),
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-primary">
              Support
            </h4>
            {["Help Center", "API Status", "Contact Us"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-muted-foreground hover:underline"
              >
                {item}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-start justify-between gap-4 md:items-end">
            <p className="text-xs text-muted-foreground">
              © 2026 CareSync Healthcare. HIPAA Compliant.
            </p>
            <div className="flex gap-4">
              {["public", "hub", "mail"].map((icon) => (
                <span
                  key={icon}
                  className="material-symbols-outlined cursor-pointer text-[20px] text-muted-foreground transition-colors hover:text-primary"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
