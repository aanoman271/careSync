import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import { Appointment } from "@/Models/Appointment";
import Doctor from "@/Models/Doctor";
import User from "@/Models/User";

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

    // 💡 ব্রো, এই ট্রিকটি ESLint কে পুরোপুরি শান্ত রাখবে:
    // কোনো ভ্যারিয়েবল ছাড়াই মঙ্গুজকে বাধ্য করা হচ্ছে স্কিমাগুলো মেমোরিতে রেজিস্টার করতে
    mongoose.model("Doctor", Doctor.schema);
    mongoose.model("User", User.schema);

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

    // 3. Query the database using the schema-compliant Type identifier and populate doctor info
    const appointments = await Appointment.find({
      patientId: validPatientId,
    }).populate({
      path: "doctorId",
      populate: {
        path: "userId",
        select: "name email image phone",
      },
    });

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
      const dateStringA = a.date.includes(",") ? a.date : `${a.date}, 2026`;
      const dateStringB = b.date.includes(",") ? b.date : `${b.date}, 2026`;

      const dateA = new Date(`${dateStringA} ${a.time}`);
      const dateB = new Date(`${dateStringB} ${b.time}`);

      if (isNaN(dateA.getTime())) return 1;
      if (isNaN(dateB.getTime())) return -1;

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
