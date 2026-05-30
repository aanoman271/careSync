"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Camera } from "lucide-react";
import Image from "next/image";
import useAxios from "@/app/hooks/useAxios";
import useSweetAlert from "@/app/hooks/useSweetAlert";

type PatientFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  gender: string;
};

const fieldClass = (hasError?: boolean) =>
  `w-full rounded-lg border bg-background py-3 px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:ring-2 ${
    hasError
      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
      : "border-border focus:border-primary focus:ring-primary/20"
  }`;

const labelClass =
  "block text-xs font-semibold uppercase tracking-widest text-muted-foreground";

const ErrorMsg = ({ message }: { message?: string }) =>
  message ? (
    <p className="flex items-center gap-1.5 text-xs text-destructive mt-1">
      <AlertCircle size={13} />
      {message}
    </p>
  ) : null;

export default function RegistrationPage() {
  // ✅ hooks সব component এর ভেতরে
  const router = useRouter();
  const axios = useAxios();
  const { successAlert, errorAlert } = useSweetAlert();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>();

  const handleProfileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous URL to prevent memory leak
    if (profilePreview) {
      URL.revokeObjectURL(profilePreview);
    }

    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: PatientFormData) => {
    try {
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

      await axios.post("/api/auth/register/patient", {
        name: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        gender: data.gender,
        role: "patient",
        image: imageUrl,
      });

      await successAlert({
        title: "Account Created!",
        text: "Your patient account has been created successfully.",
      });

      router.push("/login");
    } catch (error: unknown) {
      let message = "Something went wrong. Please try again.";

      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response?.data?.message === "string"
      ) {
        message = (error as { response: { data: { message: string } } })
          .response.data.message;
      }

      errorAlert({
        title: "Registration Failed",
        text: message,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-2xl rounded-xl border border-border/50 bg-card/80 p-6 shadow-sm backdrop-blur-md md:p-8"
      >
        {/* Profile Image */}
        <div className="mb-6 flex flex-col items-center justify-center text-center">
          <label className={`${labelClass} mb-3`}>Profile Picture</label>
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
            className="group relative flex h-28 w-28 flex-col items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border transition-all hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {profilePreview ? (
              <Image
                src={profilePreview}
                alt="Profile Preview"
                className="h-full w-full object-cover"
                width={112}
                height={112}
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Camera
                  size={24}
                  className="text-muted-foreground transition-colors group-hover:text-primary"
                />
                <span className="mt-1 text-[10px] font-bold uppercase text-muted-foreground group-hover:text-primary">
                  Upload
                </span>
              </div>
            )}
          </button>
          <p className="mt-2 text-xs text-muted-foreground">
            Upload a profile image (PNG, JPG, max 2MB)
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("fullName", {
                required: "Full name is required.",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters.",
                },
              })}
              className={fieldClass(!!errors.fullName)}
            />
            <ErrorMsg message={errors.fullName?.message} />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
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

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required.",
                  minLength: { value: 8, message: "At least 8 characters." },
                })}
                className={`${fieldClass(!!errors.password)} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <ErrorMsg message={errors.password?.message} />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Please confirm your password.",
                  validate: (value) =>
                    value === getValues("password") ||
                    "Passwords do not match.",
                })}
                className={`${fieldClass(!!errors.confirmPassword)} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <ErrorMsg message={errors.confirmPassword?.message} />
          </div>

          {/* Phone */}
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
          <div className="flex flex-col gap-1.5">
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

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-8 w-full rounded-lg bg-primary py-3 text-base font-bold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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
              Creating Account...
            </span>
          ) : (
            "Create Patient Account"
          )}
        </button>
      </form>
    </div>
  );
}
