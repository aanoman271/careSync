export interface Appointment {
  id: string;
  _id?: string;
  doctorId?: string;
  doctor: string;
  specialty: string;
  specialtyColor: "primary" | "tertiary";
  image: string;
  date: string;
  time: string;
  location?: string;
  patient: string;
  status: "Confirmed" | "In-Person";
  statusColor: "primary" | "tertiary";
  actionType: "join" | "directions";
}
export interface UpcomingAppointmentProps {
  appointmentList: Appointment[];
}
export interface AppointmentCardProps {
  appt: Appointment;
}
export interface HeroSectionProps {
  appointmentList: Appointment[];
}
export interface HistoryItem {
  id: string;
  date: string;
  time: string;
  practitioner: string;
  specialty: string;
  status: "Completed" | "Cancelled";
}

export interface Prescription {
  id: string;
  name: string;
  dosage: string;
  prescribedBy: string;
  patient?: string;
  lastRefill: string;
  status: "Active" | "Refill Due";
  actionType: "refill" | "order";
}
export type Tab = "appointments" | "history" | "prescriptions";
