import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  // if user not logged in
  if (!user) {
    redirect("/login");
  }

  // get user role
  const role = session?.user?.role;

  // patient redirect
  if (role === "patient") {
    redirect("/dashboard/patient");
  }

  // doctor redirect
  if (role === "doctor") {
    redirect("/dashboard/doctor");
  }

  // admin redirect
  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  // fallback route
  redirect("/unauthorized");
}
