"use client";
import { useState, useEffect } from "react"; // 💡 ফিক্সড: useEffect ইম্পোর্ট করা হলো
import { getAllDoctors } from "../Features/doctors/data/data";
import { LayoutGrid, List, Search } from "lucide-react";
import DoctorCard from "../Features/doctors/conponent/DoctorCard";
import CTACard from "../Features/doctors/conponent/CTACard";
import { IDoctorResponse } from "@/Models/Doctor"; // 💡 ফিক্সড: টাইপ ইন্টারফেস ইম্পোর্ট করা হলো

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Recommended");
  const [viewGrid, setViewGrid] = useState(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [doctorsList, setDoctorsList] = useState<IDoctorResponse[]>([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getAllDoctors();
        setDoctorsList(data);
      } catch (error) {
        console.error("Failed to load doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filtered = doctorsList.filter((d) => {
    const nameMatch = d.userId?.name
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const specialtyMatch = d.specialization
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const hospitalMatch = d.hospital
      ?.toLowerCase()
      .includes(search.toLowerCase());

    return nameMatch || specialtyMatch || hospitalMatch;
  });

  return (
    <main className="flex-1 bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* ── Search & Controls ── */}
        <div className="mb-8">
          <div className="mb-6 flex flex-col items-end gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="w-full md:w-2/3">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Search Specialists
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[20px] text-muted-foreground z-10">
                  <Search size={20} />
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, hospital, or expertise..."
                  className="w-full rounded-xl border border-border bg-card py-3 pl-12 pr-4 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* Sort */}
            <div className="w-full md:w-auto">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 md:w-auto"
              >
                <option>Recommended</option>
                <option>Highest Rated</option>
                <option>Next Available</option>
                <option>Years of Experience</option>
              </select>
            </div>
          </div>

          {/* Meta row */}
          <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-bold text-primary">
                {loading ? "..." : filtered.length}
              </span>{" "}
              providers found near your location
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setViewGrid(true)}
                className={`rounded p-2 border transition-colors ${
                  viewGrid
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-primary"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewGrid(false)}
                className={`rounded p-2 border transition-colors ${
                  !viewGrid
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-primary"
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {/* ── Loading Wrapper ── */}
          {loading ? (
            <div className="flex h-48 flex-col items-center justify-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">
                Loading expert providers...
              </p>
            </div>
          ) : (
            <>
              {/* ── Doctor Grid ── */}
              {filtered.length > 0 && (
                <div
                  className={`grid gap-6 ${
                    viewGrid
                      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {filtered.map((doc) => (
                    <DoctorCard key={doc._id} doctor={doc} />
                  ))}
                  <CTACard />
                </div>
              )}

              {/* Empty state */}
              {filtered.length === 0 && (
                <div className="py-20 text-center text-muted-foreground">
                  <span className="material-symbols-outlined mb-4 text-5xl text-border block">
                    search_off
                  </span>
                  <p className="text-base font-semibold text-foreground">
                    No specialists found
                  </p>
                  <p className="mt-1 text-sm">
                    Try adjusting your search terms.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
