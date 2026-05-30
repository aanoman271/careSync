import { Star } from "lucide-react";
import Image from "next/image";
import { Doctor } from "../types/Type";

export default function DoctorCard({ doctor }: { doctor: Doctor }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-border/30 bg-card transition-all duration-300 hover:border-primary hover:shadow-2xl">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={doctor.image}
          alt={doctor.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Rating badge */}
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 shadow-sm backdrop-blur-md">
          <Star size={14} className="fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-bold text-gray-800">
            {doctor.rating}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          {doctor.specialty}
        </span>
        <h3 className="mt-1 text-lg font-semibold text-foreground">
          {doctor.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {doctor.experience}
        </p>
        <button className="mt-6 w-full rounded-xl border border-primary py-3 text-sm font-bold text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
          Book Now
        </button>
      </div>
    </div>
  );
}
