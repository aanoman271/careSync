import mongoose, { Schema, Document, Query } from "mongoose";

// 1. Interfaces for Structure Validation
interface IPatient {
  name: string;
  age: number;
  disease: string;
}

export interface IAppointment extends Document {
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId; // ◄ এখানে patientId টাইপ যুক্ত করা হলো
  date: string;
  time: string;
  status: "Pending" | "Approved" | "Completed" | "Rejected" | "Cancelled";
  patientCapacity: number;
  serialNumber: number;
  patient: IPatient;
  createdAt: Date;
  updatedAt: Date;
}

// 2. Schema definition
const AppointmentSchema = new Schema<IAppointment>(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    patientId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // ◄ এখানে patientId স্কিমাতে যুক্ত করা হলো
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Completed", "Rejected", "Cancelled"],
      default: "Pending",
    },
    patientCapacity: { type: Number, default: 3 },
    serialNumber: { type: Number, default: 1 },
    patient: {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      disease: { type: String, required: true },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

// 3. Complete Type-Safe Middleware Function Execution
// Using a flexible call signature for next parameter to prevent Mongoose framework mismatches
const autoCancelUncompletedAppointments = async function (
  queryContext: Query<unknown, IAppointment>,
): Promise<void> {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  try {
    await queryContext.model.updateMany(
      {
        status: { $nin: ["Completed", "Cancelled"] },
        createdAt: { $lt: twentyFourHoursAgo },
      },
      { $set: { status: "Cancelled" } },
    );
  } catch (error) {
    console.error("Error executing auto-cancel middleware:", error);
  }
};

// 4. Registering Hooks by bypassing the problematic 'next' parameter mismatch
// Calling the logic synchronously before passing execution flow via native function wrapping
AppointmentSchema.pre(
  "find",
  async function (this: Query<unknown, IAppointment>) {
    await autoCancelUncompletedAppointments(this);
  },
);

AppointmentSchema.pre(
  "findOne",
  async function (this: Query<unknown, IAppointment>) {
    await autoCancelUncompletedAppointments(this);
  },
);

// 5. Model Export
export const Appointment =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);
