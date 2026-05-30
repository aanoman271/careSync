import DoctorCard from "@/app/component/DocktorCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { doctors } from "../data";

export function TopDoctorsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
      {/* Section Header */}
      <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Top Rated Specialists
          </h2>
          <p className="mt-3 max-w-xl text-base text-muted-foreground">
            Consult with our world-class medical professionals vetted for their
            expertise and patient care.
          </p>
        </div>
        <Link
          href="#"
          className="group flex items-center gap-2 font-bold text-primary transition-all hover:gap-3"
        >
          View all 400+ doctors
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.name} doctor={doctor} />
        ))}
      </div>
    </section>
  );
}
