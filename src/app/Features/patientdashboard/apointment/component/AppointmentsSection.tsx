import { Calendar, PlusCircle } from "lucide-react";
import Link from "next/link";
import AppointmentCard from "./AppointmentCard";
import { APPOINTMENTS } from "../../data/data";
import { sectionTitleClass } from "@/utils/cardVariants";

export default function AppointmentsSection() {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className={sectionTitleClass}>
          <Calendar size={20} className="text-primary" />
          Upcoming Appointments
        </h2>
        <button className="text-xs font-semibold text-primary hover:underline">
          View Calendar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {APPOINTMENTS.map((appt) => (
          <AppointmentCard key={appt.id} appt={appt} />
        ))}

        {/* Book CTA */}
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-card p-6 text-center transition-all hover:border-primary/30">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <PlusCircle size={28} className="text-muted-foreground" />
          </div>
          <h3 className="mb-2 font-semibold text-muted-foreground">
            Need a check-up?
          </h3>
          <p className="mb-5 text-xs text-muted-foreground/70">
            Schedule your next consultation with our network of top-rated
            specialists.
          </p>
          <Link
            href="/doctors"
            className="rounded-lg bg-muted px-6 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted/80"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
