import { NextRequest, NextResponse } from "next/server";
import { Appointment, IAppointment } from "@/Models/Appointment";

// Next.js App Router-এ এক্সপ্লিসিটলি POST ফাংশন এক্সপোর্ট করতে হয়
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Next.js-এ বডি পার্স করার নেটিভ নিয়ম
    const body = await req.json();
    const { doctorId, patientId, date, time, patientCapacity, patient } = body;

    // ১. ভ্যালিডেশন গার্ড চেক
    if (!doctorId || !patientId || !date || !time || !patient) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 },
      );
    }

    // রেস-কন্ডিশন এড়াতে ২৪ ঘণ্টার কাট-অফ টাইম হিসাব
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // ২. একটিভ বুকিং ফিল্টার কুয়েরি
    const activeBookings = await Appointment.find({
      doctorId,
      date,
      time,
      $and: [
        { status: { $in: ["Pending", "Approved", "Completed"] } },
        {
          $or: [
            { status: "Completed" },
            { status: "Approved" },
            { createdAt: { $gte: twentyFourHoursAgo } },
          ],
        },
      ],
    }).sort({ serialNumber: 1 });

    const capacityLimit = (patientCapacity as number) || 3;

    // ৩. ক্যাপাসিটি চেক
    if (activeBookings.length >= capacityLimit) {
      return NextResponse.json(
        {
          success: false,
          message: "এই স্লটটা ফুল হয়ে গেছে, দয়া করে অন্য স্লট বুক করুন।",
        },
        { status: 400 },
      );
    }

    // ৪. ডায়নামিক সিরিয়াল নম্বর জেনারেটর
    let nextSerialNumber = 1;
    if (activeBookings.length > 0) {
      const highestSerialObj = activeBookings.reduce(
        (max: IAppointment, current: IAppointment): IAppointment =>
          current.serialNumber > max.serialNumber ? current : max,
        activeBookings[0],
      );
      nextSerialNumber = highestSerialObj.serialNumber + 1;
    }

    // ৫. নতুন বুকিং অবজেক্ট তৈরি ও সেভ করা
    const newAppointment = new Appointment({
      doctorId,
      patientId,
      date,
      time,
      status: "Pending",
      patientCapacity: capacityLimit,
      serialNumber: nextSerialNumber,
      patient,
    });

    await newAppointment.save();

    return NextResponse.json(
      {
        success: true,
        message: `Appointment booked successfully! Your Serial Number is: ${nextSerialNumber}`,
        data: newAppointment,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error.";
    console.error("Booking API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
