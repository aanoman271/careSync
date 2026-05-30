import React from "react";
import { Download } from "lucide-react";

const prescriptions = [
  {
    icon: "medication",
    name: "Amoxicillin 500mg",
    desc: "Take 1 capsule twice daily for 7 days. Complete the full course.",
    date: "Oct 10, 2024",
    status: "Verified",
    statusColor: "text-green-600 bg-green-50",
  },
  {
    icon: "pill",
    name: "Lisinopril 10mg",
    desc: "Take 1 tablet daily in the morning for blood pressure management.",
    date: "Sep 24, 2024",
    status: "Verified",
    statusColor: "text-green-600 bg-green-50",
  },
  {
    icon: "biotech",
    name: "Blood Work Panel",
    desc: "Complete metabolic panel + CBC with differential requested.",
    date: "Oct 02, 2024",
    status: "In-Progress",
    statusColor: "text-primary bg-primary/10",
  },
];

export function Prescriptions() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 w-full">
      <div className="mb-16 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Digital Prescriptions</h2>
        <p className="mt-3 text-base text-muted-foreground">No more lost paper. Access your medical orders anywhere.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {prescriptions.map((rx) => (
          <div
            key={rx.name}
            className="group rounded-3xl border border-border/40 bg-card p-8 transition-all hover:shadow-lg"
          >
            <div className="mb-6 flex items-start justify-between">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <span className="material-symbols-outlined">{rx.icon}</span>
              </div>
              <button className="rounded-full bg-muted p-2 transition-all hover:bg-primary hover:text-primary-foreground">
                <Download size={18} />
              </button>
            </div>
            <h4 className="mb-2 text-lg font-bold text-foreground">{rx.name}</h4>
            <p className="mb-6 text-sm text-muted-foreground">{rx.desc}</p>
            <div className="flex items-center justify-between border-t border-border/30 pt-6">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Date Issued</p>
                <p className="text-xs font-bold">{rx.date}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${rx.statusColor}`}>
                {rx.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
