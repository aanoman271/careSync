import { Tab } from "@/types/apointment";
import { Calendar, History, Pill } from "lucide-react";

export default function MobileTabs({
  active,
  onChange,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
}) {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "appointments", label: "Appointments", icon: <Calendar size={16} /> },
    { id: "history", label: "History", icon: <History size={16} /> },
    { id: "prescriptions", label: "Prescriptions", icon: <Pill size={16} /> },
  ];
  return (
    <div className="mb-6 flex overflow-x-auto rounded-xl border border-border/40 bg-card p-1 md:hidden">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-xs font-semibold transition-all ${
            active === tab.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
