import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Appointment } from "@/Models/Appointment";
import dbConnect from "@/lib/mongodb";

interface RouteParams {
  params: Promise<{
    patientId: string;
  }>;
}

// GET: Fetch, normalize, and sort appointments for a specific patient
export async function GET(
  req: NextRequest,
  { params }: RouteParams,
): Promise<NextResponse> {
  try {
    // 1. Establish database connection lifecycle context
    await dbConnect();

    const { patientId } = await params;

    if (!patientId) {
      return NextResponse.json(
        { success: false, message: "Patient ID is required." },
        { status: 400 },
      );
    }

    // 2. Cast string ID to Mongoose ObjectId to fix the empty array query bug
    const validPatientId = mongoose.Types.ObjectId.isValid(patientId)
      ? new mongoose.Types.ObjectId(patientId)
      : patientId;

    // 3. Query the database using the schema-compliant Type identifier
    const appointments = await Appointment.find({ patientId: validPatientId });

    if (!appointments || appointments.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No appointments found for this patient.",
          data: [],
        },
        { status: 200 },
      );
    }

    // 4. Robust sorting matrix to prevent timeline calculation compilation errors
    const sortedAppointments = [...appointments].sort((a, b) => {
      // Formulate complete date signature to safely evaluate short-hand strings like "Jun 4"
      const dateStringA = a.date.includes(",") ? a.date : `${a.date}, 2026`;
      const dateStringB = b.date.includes(",") ? b.date : `${b.date}, 2026`;

      const dateA = new Date(`${dateStringA} ${a.time}`);
      const dateB = new Date(`${dateStringB} ${b.time}`);

      // Fallback guarding mechanisms against malformed inputs
      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;

      // Ascending sort array configuration
      return dateA.getTime() - dateB.getTime();
    });

    return NextResponse.json(
      {
        success: true,
        count: sortedAppointments.length,
        data: sortedAppointments,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error.";

    console.error("=== Fetch Patient Appointments Error ===");
    console.error(errorMessage);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch appointments.",
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
