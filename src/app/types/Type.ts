import { UserRole } from "@/Models/User";

export interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  image: string;
}

export interface IUser {
  fullName: string;
  email: string;
  password?: string; // Optional for OAuth users
  confirmPassword?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  profileImage?: string | null;
  role?: UserRole;
}

// dashboard root
export type QueueStatus = "Critical" | "Stable" | "Waiting";

export default interface QueueItem {
  initials: string;
  name: string;
  type: string;
  status: QueueStatus;
  time: string;
}
