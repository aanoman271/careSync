// @/models/Prescription.ts
import { IPrescription } from "@/types/prescribetion";
import mongoose, { Schema } from "mongoose";

export const PrescriptionSchema: Schema = new Schema(
  {
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    pdfUrl: { type: String, required: true },
  },
  { timestamps: true },
);

const Prescription =
  mongoose.models.Prescription ||
  mongoose.model<IPrescription>("Prescription", PrescriptionSchema);

export default Prescription;
