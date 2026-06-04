// ─── Status Badge ─────────────────────────────────────────────────────────────

import { PrescriptionStatus } from "@/types/prescribetion";

export const statusConfig: Record<
  PrescriptionStatus,
  { bg: string; text: string; ring: string; dot: string; pulse: boolean }
> = {
  Completed: {
    bg: "bg-green-500/10",
    text: "text-green-500",
    ring: "ring-green-500/20",
    dot: "bg-green-500",
    pulse: true,
  },
  Active: {
    bg: "bg-primary/10",
    text: "text-primary",
    ring: "ring-primary/20",
    dot: "bg-primary",
    pulse: false,
  },
  Pending: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-500",
    ring: "ring-yellow-500/20",
    dot: "bg-yellow-500",
    pulse: false,
  },
  Approved: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    ring: "ring-blue-500/20",
    dot: "bg-blue-500",
    pulse: false,
  },
  Rejected: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    ring: "ring-red-500/20",
    dot: "bg-red-500",
    pulse: false,
  },
  Cancelled: {
    bg: "bg-gray-500/10",
    text: "text-gray-500",
    ring: "ring-gray-500/20",
    dot: "bg-gray-500",
    pulse: false,
  },
};

export default function StatusBadge({
  status,
}: {
  status: PrescriptionStatus;
}) {
  const cfg = statusConfig[status] || statusConfig.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cfg.bg} ${cfg.text} ${cfg.ring}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`}
      />
      {status}
    </span>
  );
}
