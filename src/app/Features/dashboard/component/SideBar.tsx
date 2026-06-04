"use client";

import React from "react";
import {
  LayoutDashboard,
  CalendarDays,
  History,
  FileSpreadsheet,
  Bell,
  UserCheck,
  Settings,
  LogOut,
  Users,
  Activity,
  LineChart,
  ClipboardList,
  FolderHeart,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import useSweetAlert from "@/app/hooks/useSweetAlert";
import { Logo } from "@/app/shared/Logo";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const roleBasedLinks: Record<
  string,
  Array<{
    icon: React.ComponentType<{ size?: number }>;
    label: string;
    href: string;
  }>
> = {
  patient: [
    {
      icon: CalendarDays,
      label: "Upcoming Appointments",
      href: "/dashboard/patient",
    },
    {
      icon: History,
      label: "Appointment History",
      href: `/dashboard/patient/history`,
    },
    {
      icon: FileSpreadsheet,
      label: "Prescription Management",
      href: "/dashboard/prescriptions",
    },
    {
      icon: Bell,
      label: "Notification Center",
      href: "/dashboard/notifications",
    },
    {
      icon: UserCheck,
      label: "Profile Management",
      href: "/dashboard/profile",
    },
  ],
  doctor: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    {
      icon: ClipboardList,
      label: "Appointment Management",
      href: "/dashboard/doctor/appointments",
    },
    {
      icon: FolderHeart,
      label: "Patient Records",
      href: "/dashboard/doctor/records",
    },
    {
      icon: CalendarDays,
      label: "Schedule Management",
      href: "/dashboard/doctor/schedule",
    },
    {
      icon: FileSpreadsheet,
      label: "Prescription Creation",
      href: "/dashboard/doctor/prescriptions",
    },
    {
      icon: Settings,
      label: "Availability Settings",
      href: "/dashboard/doctor/availability",
    },
  ],
  admin: [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Users, label: "User Management", href: "/dashboard/admin/users" },
    {
      icon: UserCheck,
      label: "Doctor Verification",
      href: "/dashboard/admin/verification",
    },
    {
      icon: Activity,
      label: "Appointment Monitoring",
      href: "/dashboard/admin/monitoring",
    },
    {
      icon: LineChart,
      label: "Analytics Dashboard",
      href: "/dashboard/admin/analytics",
    },
    {
      icon: ClipboardList,
      label: "Platform Statistics",
      href: "/dashboard/admin/statistics",
    },
  ],
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const SideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { confirmAlert, successAlert } = useSweetAlert();

  const userRole = session?.user?.role || "patient";
  const sidebarLinks =
    roleBasedLinks[userRole.toLowerCase()] || roleBasedLinks.patient;

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

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-border/20 bg-card md:flex">
      {/* Logo */}
      <div className="flex h-20 items-center px-6">
        <Logo />
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
        {status === "loading" ? (
          <div className="text-center text-xs text-muted-foreground py-4">
            Loading menu...
          </div>
        ) : (
          sidebarLinks.map((link) => {
            const IconComponent = link.icon;

            // Check active state against the dynamic href
            const isActive =
              pathname === link.href ||
              (pathname.startsWith(link.href) &&
                link.href !== "/dashboard" &&
                link.href !== "/dashboard/patient");

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center gap-4 rounded-lg px-4 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-primary/5 text-primary"
                    : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                }`}
              >
                <IconComponent size={20} />
                {link.label}
              </Link>
            );
          })
        )}
      </nav>

      {/* Bottom */}
      <div className="mt-auto border-t border-border/20 p-4">
        <Link
          href="#"
          className="flex items-center gap-4 rounded-lg px-4 py-2.5 text-xs font-semibold tracking-wide text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary"
        >
          <Settings size={20} />
          Settings
        </Link>

        {/* Sign Out in sidebar */}
        <button
          onClick={handleSignOut}
          className="mt-1 flex w-full items-center gap-4 rounded-lg px-4 py-2.5 text-xs font-semibold tracking-wide text-destructive transition-all hover:bg-destructive/10"
        >
          <LogOut size={20} />
          Sign Out
        </button>

        <div className="mt-4 rounded-lg bg-muted p-4">
          <p className="text-xs text-muted-foreground">Emergency Support</p>
          <p className="mt-1 text-xs font-bold text-primary">
            24/7 Priority Line
          </p>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
