// ─── Types ────────────────────────────────────────────────────────────────────

export type Step = 1 | 2 | 3;

export interface DaySlot {
  day: string;
  date: string;
  dayNum: number;
}

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface AvailableSlot {
  day: string;
  startTime?: string;
  endTime?: string;
}

interface DoctorUser {
  name: string;
  image?: string;
}

export interface DoctorData {
  userId?: DoctorUser;
  specialization?: string;
  hospital?: string;
  rating?: number | string;
  availableSlots?: AvailableSlot[];
}

export interface PatientInfo {
  name: string;
  age: string;
  disease: string;
}

export interface ReviewForm {
  rating: number;
  comment: string;
}
