"use client";

import React from "react";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  FileText,
  Bell,
  Video,
  ExternalLink,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { DBNotification, DBNotificationType } from "@/types/notification";
import { formatDistanceToNow } from "@/app/Features/notifications/utils";

// ─── Icon & colour mapping per type ─────────────────────────────────────────

type TypeMeta = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
  labelColor: string;
  label: string;
};

const TYPE_META: Record<DBNotificationType, TypeMeta> = {
  appointment_reminder: {
    icon: Calendar,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    labelColor: "text-primary",
    label: "Appointment Reminder",
  },
  appointment_confirmed: {
    icon: CheckCircle2,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-500",
    labelColor: "text-green-500",
    label: "Appointment Confirmed",
  },
  appointment_cancelled: {
    icon: XCircle,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    labelColor: "text-destructive",
    label: "Appointment Cancelled",
  },
  appointment_completed: {
    icon: ClipboardCheck,
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    labelColor: "text-secondary",
    label: "Appointment Completed",
  },
  prescription_ready: {
    icon: FileText,
    iconBg: "bg-tertiary/10",
    iconColor: "text-tertiary",
    labelColor: "text-tertiary",
    label: "Prescription Ready",
  },
  system: {
    icon: Bell,
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
    labelColor: "text-muted-foreground",
    label: "System",
  },
};

// ─── Card actions resolver ───────────────────────────────────────────────────

function CardActions({ notification }: { notification: DBNotification }) {
  const { type, meta } = notification;

  if (type === "appointment_confirmed" || type === "appointment_reminder") {
    return (
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Link
          href="/dashboard/patient"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground shadow-sm shadow-primary/20 transition-all duration-200 hover:brightness-110 active:scale-95"
        >
          <Video size={13} />
          View Appointment
        </Link>
      </div>
    );
  }

  if (type === "prescription_ready" && meta?.pdfUrl) {
    return (
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <a
          href={meta.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-card px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary active:scale-95"
        >
          <ExternalLink size={13} />
          View Prescription
        </a>
      </div>
    );
  }

  return null;
}

// ─── Main card ───────────────────────────────────────────────────────────────

interface NotificationCardProps {
  notification: DBNotification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
}: NotificationCardProps) {
  const meta = TYPE_META[notification.type] ?? TYPE_META.system;
  const Icon = meta.icon;
  const { isRead } = notification;
  const timeAgo = formatDistanceToNow(notification.createdAt);

  return (
    <article
      id={`notification-${notification._id}`}
      role="article"
      aria-label={notification.title}
      className={`
        group relative flex flex-col gap-4 rounded-xl border p-4
        transition-all duration-200
        md:flex-row md:gap-5 md:p-5
        ${
          isRead
            ? "border-border/20 bg-card/50 opacity-70 hover:opacity-90"
            : "border-border/40 bg-card hover:border-primary/30 hover:bg-primary/5 cursor-pointer"
        }
      `}
      onClick={() => !isRead && onMarkRead(notification._id)}
    >
      {/* Unread pulse dot */}
      {!isRead && (
        <span
          aria-label="Unread"
          className="absolute right-4 top-4 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px] shadow-primary/60 md:right-5 md:top-5"
        />
      )}

      {/* Delete button — always in top-right, appears on hover */}
      <button
        aria-label="Delete notification"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification._id);
        }}
        className={`
          absolute right-8 top-3.5 rounded-lg p-1.5 text-muted-foreground
          opacity-0 transition-all duration-150
          hover:bg-destructive/10 hover:text-destructive
          group-hover:opacity-100
          md:right-10 md:top-4
          ${!isRead ? "right-10 md:right-12" : ""}
        `}
      >
        <Trash2 size={13} />
      </button>

      {/* Type icon */}
      <div className="flex-shrink-0">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border border-border/20 ${meta.iconBg}`}
        >
          <Icon size={22} className={meta.iconColor} />
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* Label + time row */}
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
          <p
            className={`text-[10px] font-bold uppercase tracking-widest ${meta.labelColor}`}
          >
            {meta.label}
          </p>
          <time
            dateTime={notification.createdAt}
            className="shrink-0 text-[11px] font-medium text-muted-foreground"
          >
            {timeAgo}
          </time>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground md:text-[15px]">
          {notification.title}
        </h3>

        {/* Body */}
        <p className="text-sm leading-relaxed text-muted-foreground">
          {notification.body}
        </p>

        {/* Meta pill row (date/time/doctor) */}
        {notification.meta && (
          <div className="flex flex-wrap gap-2">
            {notification.meta.doctorName && (
              <span className="rounded-full border border-border/30 bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {notification.meta.doctorName}
              </span>
            )}
            {notification.meta.date && (
              <span className="rounded-full border border-border/30 bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {notification.meta.date}
              </span>
            )}
            {notification.meta.time && (
              <span className="rounded-full border border-border/30 bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                {notification.meta.time}
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <CardActions notification={notification} />
      </div>
    </article>
  );
}
