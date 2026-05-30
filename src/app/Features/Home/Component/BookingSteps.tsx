import React from "react";

const steps = [
  { label: "Select Doctor", desc: "Browse by specialty or specific health concerns." },
  { label: "Choose Slot", desc: "Find a date and time that works for your schedule." },
  { label: "Confirm Info", desc: "Quickly review and confirm your visit details." },
  { label: "Get Reminders", desc: "We'll notify you before your appointment starts.", accent: true },
];

export function BookingSteps() {
  return (
    <section className="bg-muted/30 px-4 py-20 md:px-8 w-full">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="mb-16 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Simple Booking in 4 Steps</h2>
        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="absolute left-0 top-8 hidden h-0.5 w-full bg-border md:block" />
          {steps.map((step, i) => (
            <div key={step.label} className="relative z-10 flex flex-col items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold shadow-lg ${
                  step.accent ? "bg-green-500 text-white" : "bg-primary text-primary-foreground"
                }`}
              >
                {i + 1}
              </div>
              <div>
                <h4 className="mb-1 text-lg font-semibold text-foreground">{step.label}</h4>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
