import { Prescription } from "@/types/apointment";
import { cardClass, metaLabelClass } from "@/utils/cardVariants";
import { Info, Pill } from "lucide-react";

export default function PrescriptionCard({ rx }: { rx: Prescription }) {
  const isRefillDue = rx.status === "Refill Due";

  return (
    <div className={`${cardClass} flex flex-col gap-4`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-green-500/20 bg-green-500/10">
            <Pill size={20} className="text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{rx.name}</h3>
            <p className="text-xs text-muted-foreground">{rx.dosage}</p>
          </div>
        </div>
        <span
          className={`rounded px-2.5 py-1 text-[11px] font-bold uppercase border ${
            isRefillDue
              ? "border-destructive/30 bg-destructive/10 text-destructive"
              : "border-green-500/30 bg-green-500/10 text-green-500"
          }`}
        >
          {rx.status}
        </span>
      </div>

      {/* Meta */}
      <div className="rounded-lg border border-border/20 bg-background/50 p-3">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className={metaLabelClass}>Prescribed By</p>
            <p className="truncate text-xs font-semibold text-foreground">
              {rx.prescribedBy}
            </p>
          </div>
          {rx.patient && (
            <div className="text-center">
              <p className={metaLabelClass}>Patient</p>
              <p className="truncate text-xs font-semibold text-foreground">
                {rx.patient}
              </p>
            </div>
          )}
          <div className={rx.patient ? "text-right" : "col-span-2 text-right"}>
            <p className={metaLabelClass}>Last Refill</p>
            <p className="text-xs font-semibold text-foreground">
              {rx.lastRefill}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2">
        {rx.actionType === "order" ? (
          <button className="flex-1 rounded-lg bg-green-500 py-2.5 text-xs font-bold text-white transition-all hover:bg-green-600 active:scale-95">
            Order Now
          </button>
        ) : (
          <button className="flex-1 rounded-lg border border-border bg-muted py-2.5 text-xs font-semibold text-foreground transition-all hover:border-green-500/30 hover:bg-green-500/10 hover:text-green-500">
            Refill Request
          </button>
        )}
        <button className="rounded-lg bg-muted px-4 py-2.5 text-muted-foreground transition-colors hover:bg-muted/80">
          <Info size={18} />
        </button>
      </div>
    </div>
  );
}
