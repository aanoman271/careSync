import mongoose, { Schema, Document, Types } from "mongoose";

interface ISlot {
  day: string; // "Monday", "Tuesday" ইত্যাদি
  startTime: string; // "09:00"
  endTime: string; // "17:00"
}

export interface IDoctor extends Document {
  userId: Types.ObjectId;
  specialization: string;
  experience: number;
  hospital: string;
  qualification: string;
  consultationFee: number;
  availableSlots: ISlot[];
  rating: number;
  verified: boolean;
}

const SlotSchema = new Schema<ISlot>(
  {
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false },
);

const DoctorSchema = new Schema<IDoctor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    hospital: { type: String, required: true },
    qualification: { type: String, required: true },
    consultationFee: { type: Number, required: true },
    availableSlots: [SlotSchema],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    verified: {
      type: Boolean,
      default: false, // admin approve করলে true হবে
    },
  },
  {
    timestamps: true,
  },
);

const Doctor =
  mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", DoctorSchema);
export default Doctor;

// ─── Types for API Response ──────────────────────────────────────────────────

interface ISlot {
  day: string;
  startTime: string;
  endTime: string;
}
interface IPopulatedUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  phone?: string;
}

export interface IDoctorResponse {
  _id: string;
  userId: IPopulatedUser;
  specialization: string;
  experience: number;
  hospital: string;
  qualification: string;
  consultationFee: number;
  availableSlots: ISlot[];
  rating: number;
  verified: boolean;
}
