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
// 💡 পপুলেটেড ডাটার জন্য টাইপ-সেফ ইন্টারফেস স্ট্রাকচার
interface PopulatedUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
}

interface PopulatedDoctor {
  _id: string;
  specialization: string;
  userId: PopulatedUser;
}

interface PopulatedPatient {
  _id: string;
  name: string;
}

export interface PopulatedAppointment {
  _id: string;
  id?: string;
  date: string;
  time: string;
  status: "Pending" | "Approved" | "Completed" | "Rejected" | "Cancelled";
  doctorId: PopulatedDoctor;
  patientId: string | PopulatedPatient;
  patient?: string | PopulatedPatient; // ব্যাকএন্ড থেকে ডাইনামিক স্ট্রিং বা অবজেক্ট আসতে পারে তার ব্যাকআপ
  specialty?: string;
  specialtyColor?: string;
  actionType?: string;
}

export interface AppointmentResponse {
  success: boolean;
  count: number;
  data: Appointment[];
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
