import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Doctor from "@/Models/Doctor";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    // .sort({ createdAt: -1 }) দেওয়া হয়েছে যেন নতুন রেজিস্টার্ড ডক্টররা আগে দেখায়
    const allDoctors = await Doctor.find({})
      .populate({
        path: "userId",
        select: "name email image phone",
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(allDoctors, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
