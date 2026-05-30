type Availability = "today" | "later";
export interface Doctor {
  name: string;
  role: string;
  expertise: string;
  availability: string;
  availabilityType: Availability;
  rating: number;
  image: string;
}
export interface DoctorsLayoutProps {
  children: React.ReactNode; // 💡 ফিক্সড: children প্রপের টাইপ ডিফাইন করা হলো
}
