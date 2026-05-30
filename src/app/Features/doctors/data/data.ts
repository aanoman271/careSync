import { IDoctorResponse } from "@/Models/Doctor";
import { Doctor } from "@/types/doctor";

export const doctors: Doctor[] = [
  {
    name: "Dr. Sarah Jenkins",
    role: "Senior Cardiologist • 12 Yrs Exp",
    expertise: "Heart Failure & Rhythm",
    availability: "Available Today, 2:30 PM",
    availabilityType: "today",
    rating: 4.9,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVeI7yLO5IzRUljwx9vDSDzHBXJBMHpxOAgJvQKhdWTdeGymc5d8oodhAhU1SjMnFjRyH3CnjNj0bNb1FoXB5ujVzgiICdaeQj1bFfTg5Zk8oyU0Pdcr45D_q4guDsWhtOTkcqClPoxptXSd45aRV50CaCX7N8Xklvau7emakIhMpjoCJue8BZKXTWpabhSN_kp3qL-QBDqCyUJLJpFPQdK6yOHPkPGDk7ypbmdoYl9pvNvISgg2ReTDA1rFCx9xxXsG5V5QeZv-I",
  },
  {
    name: "Dr. Michael Chen",
    role: "Pediatric Specialist • 8 Yrs Exp",
    expertise: "Newborn Care & Nutrition",
    availability: "Next Slot: Wed, Aug 14",
    availabilityType: "later",
    rating: 4.8,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDAI5jnm6l-RK1J861k4eE7Cs1VTKkdl_907CxVZ_1ZYcN7dil_-IxDzYj0n_omCPPnW8K0h39raWHHuVPJhNkp3ErRiBLRmQYqWJlY7FZCYIYxKUsKMkPr06Xh34xeBTpx0pfq2MCD1ffQt4kxZT1JUh2-POAtCFh5DrnXu80R7MaKQm5-qRla5h0m2bsoM_snsZrYEikojwYsaDucmcU5gJkxxb9VDCJC544CV36LyxtvscTCZ7vwZ6lo255U2XBgL4Pnp-EPH4c",
  },
  {
    name: "Dr. Elena Rodriguez",
    role: "Dermatologist • 15 Yrs Exp",
    expertise: "Medical & Surgical Derm",
    availability: "Available Today, 4:00 PM",
    availabilityType: "today",
    rating: 5.0,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA43z9h90IDOHqArYp_hcJWc3N2_r16aNP5vpn2EtLWp6C1bAW5UaU6gDcQFMy6TaoNO5p-dczsiQj9AmkB5AqRGp9cI_fbeRpW9stEhJ5vL2uvjwEHCdKmRu273udTJyR1dCl20UwqSB_kph2Ybh-hMnsiWNVHe436PrGpIeKLH8oxIdNQ1jZ9O2BEAUk7yBunAyO_P15NJTf-fhJIi5UziZo9eop0DT9nvtNzl4QXlh_zViLeUJW0i3HmM1O1AjF6mWAkruaXYbY",
  },
  {
    name: "Dr. James Wilson",
    role: "Neurosurgeon • 20 Yrs Exp",
    expertise: "Spinal Micro-surgery",
    availability: "Next Slot: Monday, Aug 19",
    availabilityType: "later",
    rating: 4.7,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4NviEgs-KrMLCkSndpTFiR8KdBsf-9I6MJzLiXptRU2-vUQ7dk4XymAYCaqf5ss1ESd4aoR9GipEiawGRvdzZg8F-OGbgqji07y8n0P6Q8RS_6RInJydssvWAeukg2tDVDJbF4znuzb1d9tDkVsxELyHi7CCA4YxgY41Z_7bLS31aaZafHFTBE0qH_rz2ATkfgdZYLq0rI4EgxZfvBLgu6e4sQ6d7HxXn2px5M3rJsKh6PU2N5EnwTMJJtHcSwvUuCtp3MbqQN9Bc",
  },
  {
    name: "Dr. Amara Okafor",
    role: "Internal Medicine • 10 Yrs Exp",
    expertise: "Chronic Disease Mgmt",
    availability: "Available Today, 11:00 AM",
    availabilityType: "today",
    rating: 4.9,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD5QL2cVlNnKXqKdzkknPoioBDZA4QGQfdOeEbdmvF3QbieGLubHwLI1cTLbe0hSWwgWYZ8zC0t8bYOTYjR5p86ZXyRsIH1OSY1DuKwxHwUtIiAgwP-awxDjf7slJfnmcZ5bRcVP7sVWAFrBOaYmmExdiIZ_9YauDMd7TQX9To5sftVKK6dgtroZyB5vMwuouC7bzjO30_7tYjSB9EOgcGd-qHp0B4367DNXh83GEOEwoJq4KuMb8fhZxfPs-yL0AhH_zDnKX2lZ2g",
  },
];
// ─── Fetch All Doctors ────────────────────────────────────────────────────────
export async function getAllDoctors(): Promise<IDoctorResponse[]> {
  const res = await fetch("http://localhost:3000/api/doctors", {
    cache: "no-store", //for real time data
  });

  if (!res.ok) {
    throw new Error("Failed to fetch doctors");
  }

  return res.json();
}

export async function getDoctorDetails(id: string): Promise<IDoctorResponse> {
  const res = await fetch(`http://localhost:3000/api/doctors/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch doctor details");
  }

  return res.json();
}
