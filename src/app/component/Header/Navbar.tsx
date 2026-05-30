"use client";
import { signOut, useSession } from "next-auth/react";

import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, MoreVertical, LogOut } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/app/shared/Logo";

import { usePathname, useRouter } from "next/navigation";
import { UserAvatar } from "@/app/shared/UserAvatar";
import useSweetAlert from "@/app/hooks/useSweetAlert";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Doctors", href: "/doctors" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Features", href: "/features" },
  { label: "FAQ", href: "/faq" },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { confirmAlert, successAlert } = useSweetAlert();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const isConfirmed = await confirmAlert({
      title: "Sign Out",
      text: "Are you sure you want to sign out?",
      confirmButtonText: "Yes, sign out",
    });

    if (isConfirmed) {
      await signOut({ redirect: false });
      await successAlert({
        title: "Signed Out!",
        text: "You have successfully logged out.",
      });
      router.push("/login");
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const isDarkMode =
      theme === "dark" ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // theme changing function
  const toggleTheme = () => {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");

    if (isCurrentlyDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }

    // মোবাইল বা অন্যান্য মেনু ড্রপডাউন বন্ধ করার জন্য ট্রিক (ঐচ্ছিক)
    setMoreMenuOpen(false);
  };

  const shouldHideNavbar =
    pathname?.startsWith("/registration") || pathname?.startsWith("/dashboard");

  const user = session?.user;
  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b border-border/30 bg-background/80 backdrop-blur-md transition-all duration-300 ${shouldHideNavbar ? "hidden" : "block"}`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Logo />

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={
                  isActive
                    ? "border-b-2 border-primary pb-1 text-sm font-semibold text-primary"
                    : "text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* New Dynamic Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-primary/5 hover:text-primary focus-visible:outline-none"
            aria-label="Toggle theme"
          >
            {/* 💡 CSS এর মাধ্যমে আইকনগুলো ডার্ক/লাইট মোডে স্বয়ংক্রিয়ভাবে অদলবদল হবে */}
            <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          {/* User Actions */}
          {user ? (
            <div className="flex items-center gap-2">
              <UserAvatar src={user?.image} />
              <div className="hidden md:block">
                <button
                  onClick={handleSignOut}
                  className="rounded-full px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  Sign Out
                </button>
              </div>
              <div className="relative md:hidden">
                <button
                  onClick={() => setMoreMenuOpen((v) => !v)}
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary/5"
                  aria-label="More options"
                >
                  <MoreVertical size={22} />
                </button>
                {moreMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-40 rounded-md border border-border/50 bg-background p-2 shadow-lg backdrop-blur-md">
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-md p-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Login */}
              <Link
                href="/login"
                className="hidden text-sm font-medium text-muted-foreground transition-colors hover:text-primary sm:block px-4 py-2"
              >
                Login
              </Link>

              {/* Register */}
              <Link
                href="/registration"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-primary/5 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border/30 bg-background/95 px-4 pb-4 pt-2 md:hidden">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="mt-2 border-t border-border/30 pt-3">
            <button className="w-full py-2 text-sm font-medium text-muted-foreground hover:text-primary">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
