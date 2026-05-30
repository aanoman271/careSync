import { Analytics } from "@/app/Features/Home/Component/Analytics";
import { BentoFeatures } from "@/app/Features/Home/Component/BentoFeatures";
import { BookingSteps } from "@/app/Features/Home/Component/BookingSteps";
import { DoctorDashboard } from "@/app/Features/Home/Component/DoctorDashboard";
import { DoctorSearch } from "@/app/Features/Home/Component/DoctorSearch";
import { FAQ } from "@/app/Features/Home/Component/FAQ";
import { HeroSection } from "@/app/Features/Home/Component/Hero";
import { PatientDashboardPreview } from "@/app/Features/Home/Component/PatientDashboardPreview";
import { Prescriptions } from "@/app/Features/Home/Component/Prescriptions";
import { RoadmapCTA } from "@/app/Features/Home/Component/RoadmapCTA";
import { Testimonials } from "@/app/Features/Home/Component/Testimonials";
import { TopDoctorsSection } from "@/app/Features/Home/Component/TopDoctor";
import { WhyCareSync } from "@/app/Features/Home/Component/WhyCareSync";

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full">
      <HeroSection />
      <DoctorSearch />
      <TopDoctorsSection />
      <BookingSteps />
      <PatientDashboardPreview />
      <DoctorDashboard />
      <Prescriptions />
      <BentoFeatures />
      <Analytics />
      <Testimonials />
      <WhyCareSync />
      <FAQ />
      <RoadmapCTA />
    </main>
  );
}
