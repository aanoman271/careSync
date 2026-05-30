import { IDoctorResponse } from "@/Models/Doctor"; // 💡 এপিআই এর টাইপটি নিয়ে আসলাম
import { CalendarDays, CheckCircle, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // 💡 প্রোফাইলে নেভিগেট করার জন্য

function DoctorCard({ doctor }: { doctor: IDoctorResponse }) {
  console.log(doctor);

  // 💡 প্রথম স্লটের ডেটা দিয়ে কার্ডে অ্যাভেইলেবিলিটি দেখানোর সিম্পল লজিক
  const primarySlot =
    doctor.availableSlots && doctor.availableSlots.length > 0
      ? `${doctor.availableSlots[0].day}: ${doctor.availableSlots[0].startTime} - ${doctor.availableSlots[0].endTime}`
      : "No slots available";

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={
            doctor.userId?.image ||
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDVeI7yLO5IzRUljwx9vDSDzHBXJBMHpxOAgJvQKhdWTdeGymc5d8oodhAhU1SjMnFjRyH3CnjNj0bNb1FoXB5ujVzgiICdaeQj1bFfTg5Zk8oyU0Pdcr45D_q4guDsWhtOTkcqClPoxptXSd45aRV50CaCX7N8Xklvau7emakIhMpjoCJue8BZKXTWpabhSN_kp3qL-QBDqCyUJLJpFPQdK6yOHPkPGDk7ypbmdoYl9pvNvISgg2ReTDA1rFCx9xxXsG5V5QeZv-I"
          } // 💡 ম্যাপড টু পপুলেটেড ইউজার ইমেজ
          alt={doctor.userId?.name || "Doctor"} // 💡 ম্যাপড টু পপুলেটেড ইউজার নেম
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        {/* Rating Badge */}
        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full border border-border/40 bg-background/80 px-3 py-1 backdrop-blur-md">
          <Star size={13} className="fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold text-foreground">
            {doctor.rating}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {doctor.userId?.name} {/* 💡 ম্যাপড টু পপুলেটেড ইউজার নেম */}
          </h3>
          <p className="text-xs font-semibold text-primary">
            {doctor.specialization}
          </p>{" "}
          {/* 💡 ম্যাপড টু ডক্টর স্পেশালাইজেশন */}
        </div>

        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle size={18} className="shrink-0 text-primary" />
            <span className="text-sm">Hospital: {doctor.hospital}</span>{" "}
            {/* 💡 ম্যাপড টু ডক্টর হসপিটাল */}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarDays size={18} className="shrink-0 text-primary" />
            <span className="text-sm truncate">
              {primarySlot} {/* 💡 ডাইনামিক ফার্স্ট স্লট ডেটা */}
            </span>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <button className="rounded-lg bg-primary py-2.5 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95">
            Book Appointment
          </button>
          {/* 💡 View Profile বাটনে ক্লিক করলে নির্দিষ্ট ডক্টরের ডাইনামিক প্রোফাইলে চলে যাবে */}
          <Link
            href={`/doctors/${doctor._id}`}
            className="rounded-lg border border-border py-2.5 text-xs font-semibold text-muted-foreground transition-all hover:border-primary hover:text-foreground flex items-center justify-center text-center bg-background/50 hover:bg-background"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
export default DoctorCard;
