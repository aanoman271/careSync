"use client";

import { Appointment } from "@/types/apointment";
import {
  cardClass,
  metaCellClass,
  metaLabelClass,
  metaValueClass,
} from "@/utils/cardVariants";
import { Video } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getDoctorDetails } from "@/app/Features/doctors/data/data";
import { IDoctorResponse } from "@/Models/Doctor";

export default function AppointmentCard({ appt }: { appt: Appointment }) {
  const [doctorDetails, setDoctorDetails] = useState<IDoctorResponse | null>(
    null,
  );

  useEffect(() => {
    async function fetchDoctor() {
      const doctorIdToFetch = appt?.doctorId;
      if (doctorIdToFetch && doctorIdToFetch.length === 24) {
        // Basic ObjectId check
        try {
          const docRes = await getDoctorDetails(doctorIdToFetch);
          const response = docRes as IDoctorResponse & {
            success?: boolean;
            data?: IDoctorResponse;
          };
          if (response && response.success !== false) {
            // API might wrap it in { success: true, data: ... }
            const data = response.data || docRes;
            setDoctorDetails(data);
          }
        } catch (error) {
          console.error("Failed to fetch doctor details in card:", error);
        }
      }
    }
    fetchDoctor();
  }, [appt?.doctorId]);

  // ─── Shared Styles ────────────────────────────────────────────────────────────
  // Cast safely through unknown to compare runtime string literals cleanly without lint errors
  const currentStatus = (appt?.status as unknown as string) || "Pending";
  const isPrimary =
    appt?.statusColor === "primary" ||
    currentStatus === "Confirmed" ||
    currentStatus === "Approved";

  // Cast through unknown to safely check nested database fields without 'never' or 'any' type traps
  const safePatient = appt?.patient as unknown as Record<
    string,
    string | number
  >;
  const patientName =
    typeof safePatient === "object" && safePatient !== null
      ? (safePatient.name as string)
      : (appt?.patient as unknown as string) || "Patient";

  // Safeguards to ensure layout never crashes due to missing database fields
  const doctorImage =
    doctorDetails?.userId?.image ||
    appt?.image ||
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=120&auto=format&fit=crop";
  const doctorName =
    doctorDetails?.userId?.name || appt?.doctor || "Medical Specialist";
  const doctorSpecialty =
    doctorDetails?.specialization || appt?.specialty || "General Health";

  return (
    <div className={`${cardClass} group flex flex-col`}>
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex gap-3">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={doctorImage}
              alt={doctorName}
              fill
              className="object-cover grayscale transition-all group-hover:grayscale-0"
              unoptimized
            />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{doctorName}</h3>
            <p
              className={`text-[11px] font-bold uppercase tracking-wider ${isPrimary ? "text-primary" : "text-green-500"}`}
            >
              {doctorSpecialty}
            </p>
          </div>
        </div>
        <span
          className={`rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border ${
            isPrimary
              ? "border-primary/30 bg-primary/10 text-primary"
              : "border-green-500/30 bg-green-500/10 text-green-500"
          }`}
        >
          {currentStatus}
        </span>
      </div>

      {/* Meta */}
      <div className="mb-5 grid grid-cols-2 gap-2">
        <div className={metaCellClass}>
          <p className={metaLabelClass}>Date</p>
          <p className={metaValueClass}>{appt?.date}</p>
        </div>
        <div className={metaCellClass}>
          <p className={metaLabelClass}>Time</p>
          <p className={metaValueClass}>{appt?.time}</p>
        </div>
        <div className={`${metaCellClass} col-span-2`}>
          <p className={metaLabelClass}>Patient</p>
          <p className={metaValueClass}>{patientName}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2">
        <button
          disabled={
            currentStatus !== "Confirmed" && currentStatus !== "Approved"
          }
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 ${
            currentStatus !== "Confirmed" && currentStatus !== "Approved"
              ? "opacity-60 cursor-not-allowed"
              : ""
          }`}
        >
          <Video size={15} />
          <span>
            {currentStatus === "Confirmed" || currentStatus === "Approved"
              ? "Join Meeting"
              : "waiting for approve"}
          </span>
        </button>
      </div>
    </div>
  );
}
