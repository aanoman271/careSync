import {
  CalendarDays,
  FileText,
  LayoutDashboard,
  Plus,
  Settings,
} from "lucide-react";
import Link from "next/link";
import React from "react";

const MobbileNav = () => {
  const mobileLinks = [
    {
      icon: <LayoutDashboard size={22} />,
      label: "Home",
      href: "/dashboard",
      active: true,
    },
    { icon: <CalendarDays size={22} />, label: "Appts", href: "#" },
    { icon: <FileText size={22} />, label: "Records", href: "#" },
    { icon: <Settings size={22} />, label: "Settings", href: "#" },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border/20 bg-card md:hidden">
      {mobileLinks.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={`flex flex-col items-center gap-0.5 ${
            link.active ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {link.icon}
          <span className="text-[10px] font-semibold">{link.label}</span>
        </Link>
      ))}

      {/* FAB */}
      <button className="relative -top-6 rounded-full bg-primary p-4 shadow-lg shadow-primary/30">
        <Plus size={22} className="text-primary-foreground" />
      </button>
    </nav>
  );
};

export default MobbileNav;
