import { sectionTitleClass } from "@/utils/cardVariants";
import { Pill } from "lucide-react";
import { PRESCRIPTIONS } from "../data/data";
import PrescriptionCard from "./PrescriptionCard";

function PrescriptionsSection() {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className={sectionTitleClass}>
          <Pill size={20} className="text-green-500" />
          Active Prescriptions
        </h2>
        <button className="text-xs font-semibold text-primary hover:underline">
          View All
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {PRESCRIPTIONS.map((rx) => (
          <PrescriptionCard key={rx.id} rx={rx} />
        ))}
      </div>
    </section>
  );
}
