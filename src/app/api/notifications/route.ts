import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import DBNotification from "@/Models/Notification";
import { Appointment } from "@/Models/Appointment";
import Prescription from "@/Models/prescribetion";
import Doctor from "@/Models/Doctor";
import User from "@/Models/User";

// ─── Helper: ensure all models are registered ────────────────────────────────
function ensureModels() {
  if (!mongoose.models.Doctor) mongoose.model("Doctor", Doctor.schema);
  if (!mongoose.models.User) mongoose.model("User", User.schema);
}

// ─── Helper: sync notifications from appointments & prescriptions ─────────────
async function syncNotificationsForUser(userId: mongoose.Types.ObjectId) {
  ensureModels();

  // ── Appointments ──
  const appointments = await Appointment.find({ patientId: userId }).populate({
    path: "doctorId",
    populate: { path: "userId", select: "name" },
  });

  for (const appt of appointments) {
    const apptId = (appt._id as mongoose.Types.ObjectId).toString();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doctorDoc = appt.doctorId as any;
    const doctorName: string =
      doctorDoc?.userId?.name ?? "your doctor";

    // Map appointment status → notification type + message
    type ApptStatus = "Pending" | "Approved" | "Completed" | "Rejected" | "Cancelled";
    const statusMap: Record<
      ApptStatus,
      { type: DBNotificationType; title: string; body: string } | null
    > = {
      Pending: {
        type: "appointment_reminder",
        title: `Appointment Pending: ${appt.date}`,
        body: `Your appointment with ${doctorName} on ${appt.date} at ${appt.time} is pending approval.`,
      },
      Approved: {
        type: "appointment_confirmed",
        title: `Appointment Confirmed: ${appt.date}`,
        body: `Your appointment with ${doctorName} on ${appt.date} at ${appt.time} has been approved.`,
      },
      Completed: {
        type: "appointment_completed",
        title: `Appointment Completed`,
        body: `Your appointment with ${doctorName} on ${appt.date} has been marked as completed.`,
      },
      Rejected: {
        type: "appointment_cancelled",
        title: `Appointment Rejected`,
        body: `Your appointment with ${doctorName} on ${appt.date} at ${appt.time} was rejected. Please book a new slot.`,
      },
      Cancelled: {
        type: "appointment_cancelled",
        title: `Appointment Cancelled`,
        body: `Your appointment with ${doctorName} on ${appt.date} at ${appt.time} was cancelled.`,
      },
    };

    const mapping = statusMap[appt.status as ApptStatus];
    if (!mapping) continue;

    // Only upsert one notification per appointment — deduplicate by appointmentId
    await DBNotification.findOneAndUpdate(
      { userId, "meta.appointmentId": apptId },
      {
        $set: {
          userId,
          type: mapping.type,
          title: mapping.title,
          body: mapping.body,
          meta: {
            appointmentId: apptId,
            doctorName,
            date: appt.date,
            time: appt.time,
          },
        },
        $setOnInsert: { isRead: false },
      },
      { upsert: true, new: true }
    );
  }

  // ── Prescriptions ──
  const prescriptions = await Prescription.find({ patientId: userId }).populate({
    path: "doctorId",
    populate: { path: "userId", select: "name" },
  });

  for (const rx of prescriptions) {
    const rxId = (rx._id as mongoose.Types.ObjectId).toString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doctorDoc = rx.doctorId as any;
    const doctorName: string = doctorDoc?.userId?.name ?? "your doctor";

    await DBNotification.findOneAndUpdate(
      { userId, "meta.prescriptionId": rxId },
      {
        $set: {
          userId,
          type: "prescription_ready",
          title: "Prescription Available",
          body: `A new prescription from ${doctorName} is ready. You can view and download it from your prescriptions section.`,
          meta: {
            prescriptionId: rxId,
            doctorName,
            pdfUrl: rx.pdfUrl,
          },
        },
        $setOnInsert: { isRead: false },
      },
      { upsert: true, new: true }
    );
  }
}

// ─── GET: sync + return notifications ────────────────────────────────────────
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const rawUserId = searchParams.get("userId");

    if (!rawUserId) {
      return NextResponse.json(
        { success: false, message: "userId is required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(rawUserId)) {
      return NextResponse.json(
        { success: false, message: "Invalid userId" },
        { status: 400 }
      );
    }

    const userId = new mongoose.Types.ObjectId(rawUserId);

    // Sync before returning so data is always fresh
    await syncNotificationsForUser(userId);

    const notifications = await DBNotification.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, count: notifications.length, data: notifications },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("=== GET /api/notifications Error ===", error);
    return NextResponse.json(
      { success: false, message: msg },
      { status: 500 }
    );
  }
}

// ─── PATCH: mark one or all as read ──────────────────────────────────────────
export async function PATCH(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const body = await req.json() as {
      userId?: string;
      notificationId?: string;
      markAll?: boolean;
    };

    const { userId, notificationId, markAll } = body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Valid userId is required" },
        { status: 400 }
      );
    }

    const oid = new mongoose.Types.ObjectId(userId);

    if (markAll) {
      await DBNotification.updateMany({ userId: oid }, { $set: { isRead: true } });
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    if (!notificationId || !mongoose.Types.ObjectId.isValid(notificationId)) {
      return NextResponse.json(
        { success: false, message: "Valid notificationId is required" },
        { status: 400 }
      );
    }

    await DBNotification.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(notificationId), userId: oid },
      { $set: { isRead: true } }
    );

    return NextResponse.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("=== PATCH /api/notifications Error ===", error);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

// ─── DELETE: remove a single notification ────────────────────────────────────
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const notificationId = searchParams.get("notificationId");
    const userId = searchParams.get("userId");

    if (
      !notificationId ||
      !userId ||
      !mongoose.Types.ObjectId.isValid(notificationId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        { success: false, message: "Valid notificationId and userId are required" },
        { status: 400 }
      );
    }

    await DBNotification.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(notificationId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    return NextResponse.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal server error";
    console.error("=== DELETE /api/notifications Error ===", error);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}

// ─── Type alias used inside this file ────────────────────────────────────────
type DBNotificationType =
  | "appointment_reminder"
  | "appointment_confirmed"
  | "appointment_cancelled"
  | "appointment_completed"
  | "prescription_ready"
  | "system";
