"use client";

import { ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { cardClass } from "@/utils/cardVariants";
import { useSession } from "next-auth/react";
import { AppointmentResponse, PopulatedAppointment } from "@/types/apointment";
import { FilterType } from "@/types/history";
import { getAppointmentDetails } from "@/app/Features/dashboard/data";

export default function HistorySection() {
  const { data: session } = useSession();
  const [search, setSearch] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [appointments, setAppointments] = useState<PopulatedAppointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = (await getAppointmentDetails(
          session.user.id,
        )) as AppointmentResponse;

        // টাইপ কাস্টিং করে ডাটাকে আমাদের প্রোপার ইন্টারফেসে ম্যাপ করা হলো
        const rawData = (response?.data ||
          []) as unknown as PopulatedAppointment[];
        setAppointments(rawData);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [session?.user?.id]);

  // Handle both Searching and Filtering dynamically on real fetched items
  const filteredAppointments = appointments.filter(
    (appt: PopulatedAppointment) => {
      const currentStatus = appt.status || "Pending";

      // ১. ফিল্টার টাইপ লজিক
      if (activeFilter === "completed" && currentStatus !== "Completed") {
        return false;
      }
      if (
        activeFilter === "cancelled" &&
        currentStatus !== "Cancelled" &&
        currentStatus !== "Rejected"
      ) {
        return false;
      }

      // ২. প্রোপার অবজেক্ট পাথ ট্র্যাকিং উইথ টাইপ সেফটি
      const doctorName = appt.doctorId?.userId?.name || "";
      const specialty =
        appt.doctorId?.specialization || appt.specialty || "General";

      // পেশেন্ট যদি অবজেক্ট হয় তবে নাম নিবে, স্ট্রিং হলে সরাসরি ভ্যালু নিবে
      let patientName = "";
      if (
        appt.patient &&
        typeof appt.patient === "object" &&
        "name" in appt.patient
      ) {
        patientName = appt.patient.name;
      } else if (typeof appt.patient === "string") {
        patientName = appt.patient;
      } else if (
        appt.patientId &&
        typeof appt.patientId === "object" &&
        "name" in appt.patientId
      ) {
        patientName = appt.patientId.name;
      }

      // ৩. সার্চ কুয়েরি ম্যাপিং
      const matchesSearch =
        doctorName.toLowerCase().includes(search.toLowerCase()) ||
        specialty.toLowerCase().includes(search.toLowerCase()) ||
        patientName.toLowerCase().includes(search.toLowerCase());

      return matchesSearch;
    },
  );

  return (
    <section className="w-full flex flex-col justify-start">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col justify-between gap-4 md:flex-row md:items-end">
          {/* Title and Subtitle */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Appointment History
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage and review past patient consultations and diagnostic
              visits.
            </p>
          </div>

          {/* Quick Filters Group */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-full border border-border/40 bg-muted p-1">
              {(["all", "completed", "cancelled"] as FilterType[]).map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors capitalize ${
                      activeFilter === filter
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-card/50"
                    }`}
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>

            {/* Advanced Filters Trigger */}
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-border bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
            >
              <SlidersHorizontal size={15} />
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Search Bar Input Container */}
        <div className="w-full lg:w-80 flex items-center gap-2 rounded-lg border border-border/40 bg-card px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {/* Main Core Display Body */}
      {loading ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          Loading system database records...
        </div>
      ) : (
        <>
          {/* Layout Variant 1: Desktop Mode Data Grid/Table View */}
          <div className="hidden w-full overflow-hidden rounded-xl border border-border/40 bg-card md:block">
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-muted/50">
                  <tr>
                    {[
                      "Date",
                      "Time",
                      "Doctor / Practitioner",
                      "Specialty",
                      "Patient",
                      "Status",
                      "Action",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredAppointments.map((item) => {
                    const docName =
                      item.doctorId?.userId?.name || "Unknown Doctor";
                    const specName =
                      item.doctorId?.specialization ||
                      item.specialty ||
                      "General";

                    let patName = "N/A";
                    if (
                      item.patient &&
                      typeof item.patient === "object" &&
                      "name" in item.patient
                    ) {
                      patName = item.patient.name;
                    } else if (typeof item.patient === "string") {
                      patName = item.patient;
                    } else if (
                      item.patientId &&
                      typeof item.patientId === "object" &&
                      "name" in item.patientId
                    ) {
                      patName = item.patientId.name;
                    }

                    return (
                      <tr
                        key={item._id || item.id}
                        className="transition-colors hover:bg-muted/20"
                      >
                        <td className="px-6 py-4 text-sm text-foreground whitespace-nowrap">
                          {item.date}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground whitespace-nowrap">
                          {item.time}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground font-medium">
                          {docName}
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          <span
                            className={`inline-block rounded px-2 py-0.5 text-xs font-medium border ${
                              item.specialtyColor === "tertiary"
                                ? "border-amber-500/20 text-amber-500 bg-amber-500/5"
                                : "border-primary/20 text-primary bg-primary/5"
                            }`}
                          >
                            {specName}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {patName}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`rounded px-2 py-1 text-[11px] font-bold uppercase tracking-tight ${
                              item.status === "Completed" ||
                              item.status === "Approved"
                                ? "bg-green-500/10 text-green-500"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-xs font-bold text-primary transition-colors hover:text-primary/80 capitalize">
                            {item.actionType || "Details"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Layout Variant 2: Mobile UI Card Architecture View */}
          <div className="space-y-3 md:hidden">
            {filteredAppointments.map((item) => {
              const docName = item.doctorId?.userId?.name || "Unknown Doctor";
              const specName =
                item.doctorId?.specialization || item.specialty || "General";

              let patName = "N/A";
              if (
                item.patient &&
                typeof item.patient === "object" &&
                "name" in item.patient
              ) {
                patName = item.patient.name;
              } else if (typeof item.patient === "string") {
                patName = item.patient;
              } else if (
                item.patientId &&
                typeof item.patientId === "object" &&
                "name" in item.patientId
              ) {
                patName = item.patientId.name;
              }

              return (
                <div key={item._id || item.id} className={cardClass}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{docName}</p>
                      <p className="text-xs text-muted-foreground">
                        {specName} • Patient:{" "}
                        <span className="text-foreground font-medium">
                          {patName}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.date} • {item.time}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase ${
                          item.status === "Completed" ||
                          item.status === "Approved"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {item.status}
                      </span>
                      <button className="flex items-center gap-1 text-xs font-bold text-primary capitalize">
                        {item.actionType || "Details"}
                        <ChevronRight size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fallback layout state if no matching configurations populate */}
          {filteredAppointments.length === 0 && (
            <div className="py-12 text-center border border-dashed border-border rounded-xl bg-card/50">
              <p className="text-sm text-muted-foreground">
                No matching appointments found.
              </p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
