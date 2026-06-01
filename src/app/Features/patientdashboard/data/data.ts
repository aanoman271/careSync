import { Appointment, HistoryItem, Prescription } from "@/types/apointment";
import { FilterType } from "@/types/history";

export const APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    doctor: "Dr. Sarah Chen",
    specialty: "Cardiology Specialist",
    specialtyColor: "primary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdUIC_okAg-6aFsIFVSXARhGAGx-ZWdBYa4IkpXa7EOOmDJtFieoYuG8uVH5SB40J6HLQ9QhivhU54Rq1m8mAWlMVdl4Y07thEK-oX2jKh2bA0q-NIkX7_Ux2KPs13wN6NB9Gwn8DsA5lRlygxIsseITHvVwjmdayAS_9VV59Yl_2gowyMEcYLA4C652XJAd9agPshyz4ITzhHFCSwGknDuypi299MQwRo2EOK0atoeMIJJaBOsIwWwSEewalmImRCnilyI-BTEOE",
    date: "Thursday, Oct 24",
    time: "10:30 AM - 11:15 AM",
    patient: "James Vance",
    status: "Confirmed",
    statusColor: "primary",
    actionType: "join",
  },
  {
    id: "2",
    doctor: "Dr. Michael Ross",
    specialty: "General Practitioner",
    specialtyColor: "tertiary",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBIw1eqX1UOqVA0oQoOA_5qfj3lvoIpmqrM92RPp1PXGHCEzhtXYFy24OmsYfde94kY3qO6FXz9w0IZKoWtz8-nA4VNbkK5Q_UZgUJm0SZgn64zEYVRXocTh34_LQtAmOXK3jXNhN2COHNB2WRIDGLvE3kcrtnBIip0OdhPX5WY0ta6VScb7f1NJzpYCSKPxifqZgmIzYdyKO5-Ttv0AAXGEkmE1336HVOetJUWgqlYkOvLXZ5E4F_9xG8c77fo_eb5Fr8eMJJVBeY",
    date: "Saturday, Nov 02",
    time: "Room 402, HQ",
    location: "Room 402, HQ",
    patient: "James Vance",
    status: "In-Person",
    statusColor: "tertiary",
    actionType: "directions",
  },
];

export const HISTORY: HistoryItem[] = [
  {
    id: "1",
    date: "Sep 15, 2024",
    time: "09:00 AM",
    practitioner: "Dr. Emily Blunt",
    specialty: "Dermatology",
    status: "Completed",
  },
  {
    id: "2",
    date: "Aug 28, 2024",
    time: "11:30 AM",
    practitioner: "Dr. Sarah Chen",
    specialty: "Cardiology",
    status: "Completed",
  },
  {
    id: "3",
    date: "Aug 02, 2024",
    time: "02:15 PM",
    practitioner: "Lab Diagnostics",
    specialty: "Blood Work",
    status: "Cancelled",
  },
];

export const PRESCRIPTIONS: Prescription[] = [
  {
    id: "1",
    name: "Atorvastatin",
    dosage: "20mg Daily",
    prescribedBy: "Dr. Sarah Chen",
    patient: "James Vance",
    lastRefill: "Oct 12, 2024",
    status: "Active",
    actionType: "refill",
  },
  {
    id: "2",
    name: "Lisinopril",
    dosage: "10mg Daily",
    prescribedBy: "Dr. Michael Ross",
    lastRefill: "Sep 05, 2024",
    status: "Active",
    actionType: "refill",
  },
  {
    id: "3",
    name: "Metformin",
    dosage: "500mg Twice Daily",
    prescribedBy: "Dr. Emily Blunt",
    lastRefill: "Aug 20, 2024",
    status: "Refill Due",
    actionType: "order",
  },
];

export const filters: { id: FilterType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];
