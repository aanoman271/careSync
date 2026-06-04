import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Appointment } from "@/Models/Appointment";
import mongoose from "mongoose";
import Prescription from "@/Models/prescribetion";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { appointmentId, patientId, doctorId, pdfUrl } = await req.json();

    if (!appointmentId || !pdfUrl) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 },
      );
    }

    // ১. প্রেসক্রিপশন রেকর্ড তৈরি করা
    const newPrescription = await Prescription.create({
      appointmentId: new mongoose.Types.ObjectId(appointmentId),
      patientId: new mongoose.Types.ObjectId(patientId),
      doctorId: new mongoose.Types.ObjectId(doctorId),
      pdfUrl,
    });

    // ২. অ্যাপয়েন্টমেন্টের স্ট্যাটাস 'Completed' করা
    await Appointment.findByIdAndUpdate(appointmentId, { status: "Completed" });

    return NextResponse.json(
      { success: true, data: newPrescription },
      { status: 201 },
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
