"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Logo } from "../shared/Logo";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import useSweetAlert from "@/app/hooks/useSweetAlert";
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { errorAlert } = useSweetAlert();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      errorAlert({
        title: "Authentication Failed",
        text: "Invalid email or password. Please try again.",
      });
      return;
    }

    const session = await getSession();

    if (session?.user?.role === "doctor") {
      router.push("/doctor/dashboard");
    } else if (session?.user?.role === "patient") {
      router.push("/patient/dashboard");
    } else if (session?.user?.role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground flex flex-col">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute h-[40%] w-[40%] rounded-full bg-secondary/5 blur-[120px]" />
        <div className="absolute h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
      </div>

      {/* Main */}
      <main className="flex  items-center justify-center px-4 py-12 md:px-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Logo />
            </div>
            <p className="text-sm text-muted-foreground">
              Professional Healthcare Portal
            </p>
          </div>

          {/* Card */}
          <div className="rounded-xl border border-border/50 bg-card/80 p-8 shadow-sm backdrop-blur-md">
            <form
              className="space-y-6"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  Institutional Email
                </label>
                <div className="group relative">
                  <Mail
                    size={18}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 group-focus-within:text-primary ${
                      errors.email
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@hospital.org"
                    {...register("email")}
                    className={`w-full rounded-lg border bg-background py-3 pl-12 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:ring-2 ${
                      errors.email
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle size={13} />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                  >
                    Security Credentials
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="group relative">
                  <Lock
                    size={18}
                    className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 group-focus-within:text-primary ${
                      errors.password
                        ? "text-destructive"
                        : "text-muted-foreground"
                    }`}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full rounded-lg border bg-background py-3 pl-12 pr-12 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:ring-2 ${
                      errors.password
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "border-border focus:border-primary focus:ring-primary/20"
                    }`}
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
                {errors.password && (
                  <p className="flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle size={13} />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2">
                <input
                  id="rememberMe"
                  type="checkbox"
                  {...register("rememberMe")}
                  className="h-4 w-4 rounded border-border bg-card text-primary accent-primary cursor-pointer"
                />
                <label
                  htmlFor="rememberMe"
                  className="cursor-pointer text-sm text-muted-foreground"
                >
                  Stay authenticated for 12 hours
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Footer link */}
            <div className="mt-8 border-t border-border/50 pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                New medical practitioner?
                <Link
                  href="/register"
                  className="ml-1 font-bold text-primary transition-colors hover:text-primary/80"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex justify-center gap-8">
            <div className="flex items-center gap-1.5 text-muted-foreground opacity-60">
              <span className="material-symbols-outlined text-[16px]">
                verified_user
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest">
                HIPAA Compliant
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground opacity-60">
              <span className="material-symbols-outlined text-[16px]">
                encrypted
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest">
                SSL Secure
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <p className="text-xs text-muted-foreground/50">
          © 2026 CareSync Health Systems. Clinical precision in every pixel.
        </p>
      </footer>
    </div>
  );
}
