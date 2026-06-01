"use client";

import { getAppointmentDetails } from "@/app/Features/dashboard/data";
import HeroSection from "@/app/Features/patientdashboard/apointment/component/HeroSection";
import UpcomingAppointment from "@/app/Features/patientdashboard/apointment/component/UpcomingAppointment";
import { Appointment } from "@/types/apointment";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function PatientDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const [loading, setLoading] = useState<boolean>(true);
  const [appointmentList, setAppointmentList] = useState<Appointment[]>([]);

  // ─── Inside your PatientDashboard.tsx ─────────────────────

  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      try {
        setLoading(true);

        const responseData = (await getAppointmentDetails(
          user.id,
        )) as unknown as {
          success: boolean;
          count: number;
          data: Appointment[];
        };

        const actualAppointments = responseData?.data || [];

        setAppointmentList(actualAppointments);
      } catch (error) {
        console.error("Failed to load appointments:", error);
        setAppointmentList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  return (
    <div className="w-full space-y-8">
      {/* Hero */}
      <HeroSection appointmentList={appointmentList} />

      {/* Desktop: all sections visible */}
      <UpcomingAppointment appointmentList={appointmentList} />
      {/* <HistorySection /> */}
      {/* <PrescriptionsSection /> */}
    </div>
  );
}
