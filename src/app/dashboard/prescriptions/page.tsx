"use client";

import MobileCard from "@/app/Features/patientdashboard/prescribetion/component/MobileCard";
import Pagination from "@/app/Features/patientdashboard/prescribetion/component/Pagination";
import RowActions from "@/app/Features/patientdashboard/prescribetion/component/RowActions";
import StatusBadge from "@/app/Features/patientdashboard/prescribetion/component/StatusBadge";
import { Search, RefreshCw, AlertCircle, FileText } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react"; // ✅ useEffect ইম্পোর্ট করা হয়েছে
import { useSession } from "next-auth/react";
import { IPopulatedPrescription } from "@/types/prescribetion";
import { useQuery } from "@tanstack/react-query";
import { getPrescriptionsData } from "@/app/Features/patientdashboard/prescribetion/data/data";
import useAxios from "@/app/hooks/useAxios";
import useSweetAlert from "@/app/hooks/useSweetAlert";
import { AxiosError } from "axios"; // ✅ AxiosError টাইপ ইম্পোর্ট করা হয়েছে

export default function PrescriptionRecordsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const user = session?.user;

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const { errorAlert } = useSweetAlert();
  const ITEMS_PER_PAGE = 5;
  const axiosInstance = useAxios();

  // 🔥 তানস্ট্যাক কুয়েরি উইথ টাইপ সেফটি (AxiosError ব্যবহার করা হয়েছে, any বিদায়!)
  const {
    data: Prescriptions = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<IPopulatedPrescription[], AxiosError<{ message?: string }>>({
    queryKey: ["prescriptions", user?.id],
    queryFn: () => getPrescriptionsData(axiosInstance),
    enabled: sessionStatus === "authenticated" && !!user?.id,
  });

  // sweet alert
  useEffect(() => {
    if (isError && error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to load prescriptions";

      errorAlert({ text: errorMsg });
    }
  }, [isError, error, errorAlert]);

  // Filtering
  const filtered = Prescriptions.filter((rx) => {
    const doctorName = rx.doctorId?.userId?.name || "";
    const patientName = rx.appointmentId?.patient?.name || "";
    const doctorSpecialty = rx.doctorId?.specialization || "";
    const status = rx.appointmentId?.status || "";

    const term = search.toLowerCase();
    return (
      doctorName.toLowerCase().includes(term) ||
      patientName.toLowerCase().includes(term) ||
      doctorSpecialty.toLowerCase().includes(term) ||
      status.toLowerCase().includes(term)
    );
  });

  // Pagination calculations
  const totalItems = filtered.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filtered.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  // Reset page to 1 when search changes
  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const isPageLoading = sessionStatus === "loading" || isLoading;

  if (sessionStatus === "loading") {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">
            Authenticating user...
          </p>
        </div>
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-bold text-foreground">Access Denied</h2>
        <p className="max-w-xs text-sm text-muted-foreground">
          Please log in to your account to view your prescription records.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        {/* ── Header ── */}
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
              Prescription Records
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Real-time clinical pharmaceutical oversight and status tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary/20 md:w-64"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              disabled={isPageLoading}
              className="flex items-center justify-center rounded-lg border border-border bg-card p-2.5 text-muted-foreground transition-all hover:bg-muted active:scale-95 disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw
                size={16}
                className={isPageLoading ? "animate-spin" : ""}
              />
            </button>
          </div>
        </header>

        {/* Error Alert */}
        {isError && error && (
          <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Error Loading Prescriptions</p>
              <p className="text-xs opacity-90">
                {error.response?.data?.message || error.message}
              </p>
            </div>
          </div>
        )}

        {/* ── Table / Cards Container ── */}
        <div className="overflow-hidden rounded-xl border border-border/40 bg-card shadow-xl">
          {isPageLoading ? (
            /* Premium Skeleton loading state */
            <div className="space-y-4 p-6">
              <div className="h-8 w-1/3 animate-pulse rounded bg-muted"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="flex items-center justify-between border-b border-border/20 py-4 last:border-0"
                  >
                    <div className="flex items-center gap-3 w-1/3">
                      <div className="h-10 w-10 animate-pulse rounded-full bg-muted"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                        <div className="h-3 w-1/2 animate-pulse rounded bg-muted"></div>
                      </div>
                    </div>
                    <div className="h-4 w-1/4 animate-pulse rounded bg-muted"></div>
                    <div className="h-6 w-16 animate-pulse rounded bg-muted"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border/40 bg-muted/50">
                      {["Doctor Name", "Patient Name", "Status", "Actions"].map(
                        (h) => (
                          <th
                            key={h}
                            className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground ${
                              h === "Actions" ? "text-right" : ""
                            }`}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {paginatedItems.map((rx) => {
                      const doctorName =
                        rx.doctorId?.userId?.name || "Unknown Doctor";
                      const doctorSpecialty =
                        rx.doctorId?.specialization || "General Medicine";
                      const doctorImage =
                        rx.doctorId?.userId?.image ||
                        "https://i.ibb.co/F0606f1/default-doctor.png";
                      const patientName =
                        rx.appointmentId?.patient?.name || "Unknown Patient";
                      const patientIdShort = rx.appointmentId?._id
                        ? `PID-${rx.appointmentId._id.slice(-6).toUpperCase()}`
                        : "PID-UNKNOWN";
                      const status = rx.appointmentId?.status || "Pending";

                      return (
                        <tr
                          key={rx._id}
                          onMouseEnter={() => setHoveredRow(rx._id)}
                          onMouseLeave={() => setHoveredRow(null)}
                          className="group relative transition-colors hover:bg-muted/20"
                          style={{
                            boxShadow:
                              hoveredRow === rx._id
                                ? "inset 4px 0 0 0 hsl(var(--primary))"
                                : "none",
                          }}
                        >
                          {/* Doctor */}
                          <td className="px-6 py-5">
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
                          </td>

                          {/* Patient */}
                          <td className="px-6 py-5">
                            <p className="text-sm text-foreground">
                              {patientName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {patientIdShort}
                            </p>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-5">
                            <StatusBadge status={status} />
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-5">
                            <RowActions pdfUrl={rx.pdfUrl} />
                          </td>
                        </tr>
                      );
                    })}

                    {filtered.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="py-16 text-center text-sm text-muted-foreground"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FileText className="h-8 w-8 text-muted-foreground/40" />
                            <span>No prescriptions match your search.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden">
                {filtered.length === 0 ? (
                  <div className="py-16 text-center text-sm text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground/40" />
                      <span>No prescriptions match your search.</span>
                    </div>
                  </div>
                ) : (
                  paginatedItems.map((rx) => (
                    <MobileCard key={rx._id} rx={rx} />
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalItems > 0 && (
                <Pagination
                  current={currentPage}
                  totalItems={totalItems}
                  perPage={ITEMS_PER_PAGE}
                  onChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
