"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function RegisterToggle() {
  const pathname = usePathname();
  const isDoctor = pathname === "/registration/doctor";

  return (
    <div className="flex w-full max-w-md rounded-full bg-muted p-1">
      <Link
        href="/registration"
        className={`flex-1 rounded-full px-6 py-3 text-center text-xs font-semibold tracking-wide transition-all duration-300 ${
          !isDoctor
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        I am a Patient
      </Link>
      <Link
        href="/registration/doctor"
        className={`flex-1 rounded-full px-6 py-3 text-center text-xs font-semibold tracking-wide transition-all duration-300 ${
          isDoctor
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        I am a Doctor
      </Link>
    </div>
  );
}
