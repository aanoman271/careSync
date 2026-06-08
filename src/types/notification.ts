import mongoose from "mongoose";

// ─── Legacy type kept for compatibility with existing DB model ─────────────
export type NotificationType = "appointment" | "prescription" | "system";

export interface INotification {
  _id: string;
  userId: mongoose.Types.ObjectId | string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

// ─── DB Notification shape (matches Mongoose Notification model) ────────────

export type DBNotificationType =
  | "appointment_reminder"
  | "appointment_confirmed"
  | "appointment_cancelled"
  | "appointment_completed"
  | "prescription_ready"
  | "system";

export interface DBNotificationMeta {
  appointmentId?: string;
  prescriptionId?: string;
  doctorName?: string;
  date?: string;
  time?: string;
  pdfUrl?: string;
}

export interface DBNotification {
  _id: string;
  userId: string;
  type: DBNotificationType;
  title: string;
  body: string;
  isRead: boolean;
  meta?: DBNotificationMeta;
  createdAt: string;
  updatedAt: string;
}

// ─── API response shape ─────────────────────────────────────────────────────

export interface NotificationsAPIResponse {
  success: boolean;
  count: number;
  data: DBNotification[];
}

// ─── UI-level filter & category types ──────────────────────────────────────

export type NotificationCategory =
  | "all"
  | "appointments"
  | "updates";

export interface NotificationFilterChip {
  key: NotificationCategory;
  label: string;
}
