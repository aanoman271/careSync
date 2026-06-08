import mongoose, { Schema, Document, Types } from "mongoose";

export type DBNotificationType =
  | "appointment_reminder"
  | "appointment_confirmed"
  | "appointment_cancelled"
  | "appointment_completed"
  | "prescription_ready"
  | "system";

export interface IDBNotification extends Document {
  userId: Types.ObjectId;
  type: DBNotificationType;
  title: string;
  body: string;
  isRead: boolean;
  meta?: {
    appointmentId?: string;
    prescriptionId?: string;
    doctorName?: string;
    date?: string;
    time?: string;
    pdfUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const DBNotificationSchema = new Schema<IDBNotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: [
        "appointment_reminder",
        "appointment_confirmed",
        "appointment_cancelled",
        "appointment_completed",
        "prescription_ready",
        "system",
      ],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    meta: {
      appointmentId: { type: String },
      prescriptionId: { type: String },
      doctorName: { type: String },
      date: { type: String },
      time: { type: String },
      pdfUrl: { type: String },
    },
  },
  { timestamps: true }
);

const DBNotification =
  mongoose.models.Notification ||
  mongoose.model<IDBNotification>("Notification", DBNotificationSchema);

export default DBNotification;
