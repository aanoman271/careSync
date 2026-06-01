import QueueItem, { QueueStatus } from "@/app/types/Type";
import { Appointment } from "@/types/apointment";

export async function getAppointmentDetails(id: string): Promise<Appointment> {
  const res = await fetch(`http://localhost:3000/api/appointment/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch appointment details");
  }

  return res.json();
}

export const stats = [
  { label: "Avg. Wait", value: "14m", color: "text-secondary" },
  { label: "Capacity", value: "92%", color: "text-green-400" },
  { label: "Critical", value: "03", color: "text-destructive" },
  { label: "Discharged", value: "12", color: "text-primary" },
];
export const queue: QueueItem[] = [
  {
    initials: "AM",
    name: "Alice Mitchell",
    type: "Post-Op Review",
    status: "Critical",
    time: "10:30 AM",
  },
  {
    initials: "RK",
    name: "Robert Kovic",
    type: "Routine Checkup",
    status: "Stable",
    time: "11:15 AM",
  },
  {
    initials: "JD",
    name: "Jane Doe",
    type: "Lab Results",
    status: "Waiting",
    time: "12:00 PM",
  },
];

export const statusStyles: Record<
  QueueStatus,
  { border: string; text: string }
> = {
  Critical: { border: "border-destructive", text: "text-destructive" },
  Stable: { border: "border-green-400", text: "text-green-400" },
  Waiting: { border: "border-border", text: "text-muted-foreground" },
};
