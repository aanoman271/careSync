import { Logo } from "@/app/shared/Logo";
import Link from "next/link";

export function RegisterHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="flex items-center justify-between px-4 py-4 md:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-muted-foreground sm:block">
            Already have an account?
          </span>
          <Link
            href="/login"
            className="text-sm font-bold text-primary transition-colors duration-200 hover:text-primary/80 active:opacity-80"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
