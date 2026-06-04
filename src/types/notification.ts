import mongoose from "mongoose";

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
