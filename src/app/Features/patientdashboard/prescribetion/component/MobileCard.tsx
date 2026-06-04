import Image from "next/image";
import RowActions from "./RowActions";
import StatusBadge from "./StatusBadge";
import { IPopulatedPrescription } from "@/types/prescribetion";

export default function MobileCard({ rx }: { rx: IPopulatedPrescription }) {
  const doctorName = rx.doctorId?.userId?.name || "Unknown Doctor";
  const doctorSpecialty = rx.doctorId?.specialization || "General Medicine";
  const doctorImage = rx.doctorId?.userId?.image || "https://i.ibb.co/F0606f1/default-doctor.png";
  const patientName = rx.appointmentId?.patient?.name || "Unknown Patient";
  const patientIdShort = rx.appointmentId?._id 
    ? `PID-${rx.appointmentId._id.slice(-6).toUpperCase()}`
    : "PID-UNKNOWN";
  const status = rx.appointmentId?.status || "Pending";

  return (
    <div className="border-b border-border/30 p-4 transition-colors last:border-0 hover:bg-muted/20">
      <div className="flex items-start justify-between gap-3">
        {/* Doctor */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/50">
            <Image
              src={doctorImage}
              alt={doctorName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {doctorName}
            </p>
            <p className="text-xs text-muted-foreground">
              {doctorSpecialty}
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground">{patientName}</p>
          <p className="text-xs text-muted-foreground">{patientIdShort}</p>
        </div>
        <RowActions pdfUrl={rx.pdfUrl} />
      </div>
    </div>
  );
}
