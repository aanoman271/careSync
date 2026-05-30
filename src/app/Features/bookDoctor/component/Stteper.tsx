import { Step } from "@/types/bookDoctor";
import { CheckCircle } from "lucide-react";

export function Stepper({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: "Select Doctor" },
    { n: 2, label: "Schedule" },
    { n: 3, label: "Confirmation" },
  ];
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const done = current > step.n;
        const active = current === step.n;
        return (
          <div key={step.n} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 ${!active && !done ? "opacity-40" : ""}`}
            >
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  done
                    ? "bg-green-500 text-white"
                    : active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {done ? <CheckCircle size={14} /> : step.n}
              </div>
              <span
                className={`text-xs font-semibold ${
                  active
                    ? "text-primary"
                    : done
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px w-8 ${done ? "bg-green-500" : "bg-border"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
