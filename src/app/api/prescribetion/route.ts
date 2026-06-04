import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Prescription from "@/Models/prescribetion";
import { Appointment } from "@/Models/Appointment";
import Doctor from "@/Models/Doctor";
import User from "@/Models/User";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    // Ensure models are registered in mongoose to prevent MissingSchemaError
    if (!mongoose.models.Appointment) {
      mongoose.model("Appointment", Appointment.schema);
    }
    if (!mongoose.models.Doctor) {
      mongoose.model("Doctor", Doctor.schema);
    }
    if (!mongoose.models.User) {
      mongoose.model("User", User.schema);
    }

    const { searchParams } = new URL(req.url);
    const patientId = searchParams.get("patientId");
    const doctorId = searchParams.get("doctorId");

    const query: Record<string, unknown> = {};

    if (patientId) {
      query.patientId = mongoose.Types.ObjectId.isValid(patientId)
        ? new mongoose.Types.ObjectId(patientId)
        : patientId;
    } else if (doctorId) {
      query.doctorId = mongoose.Types.ObjectId.isValid(doctorId)
        ? new mongoose.Types.ObjectId(doctorId)
        : doctorId;
    }

    // Retrieve prescriptions and populate references
    const prescriptions = await Prescription.find(query)
      .populate({
        path: "appointmentId",
        select: "date time status patient",
      })
      .populate({
        path: "doctorId",
        populate: {
          path: "userId",
          select: "name email image",
        },
      })
      .populate({
        path: "patientId",
        select: "name email image",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        count: prescriptions.length,
        data: prescriptions,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("=== Fetch Prescriptions Error ===", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch prescriptions",
        error: msg,
      },
      { status: 500 }
    );
  }
}
