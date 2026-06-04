import mongoose from "mongoose";

export interface IPrescription extends Document {
  appointmentId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  pdfUrl: string; // Cloudinary বা Vercel Blob-এর লিঙ্ক
  createdAt: Date;
}
// @/types/prescription.ts

export interface IPopulatedPrescription {
  _id: string;
  pdfUrl: string;
  createdAt: string;
  appointmentId: {
    _id: string;
    date: string;
    time: string;
    status: PrescriptionStatus;
    patient: {
      name: string;
      age: number;
      disease: string;
    };
  };
  doctorId: {
    _id: string;
    specialization: string;
    userId: {
      name: string;
      email?: string;
      image?: string;
    };
  };
}
// ─── Types ────────────────────────────────────────────────────────────────────

export type PrescriptionStatus = "Completed" | "Active" | "Pending" | "Approved" | "Rejected" | "Cancelled";

export interface Prescriptions {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  patientName: string;
  patientId: string;
  status: PrescriptionStatus;
}
