import { Metadata } from "next";
import NotificationCenter from "@/app/Features/notifications/components/NotificationCenter";

export const metadata: Metadata = {
  title: "CareSync | Notification Center",
  description:
    "Stay updated with your clinical schedule, care team messages, and health record updates.",
};

export default function NotificationsPage() {
  return <NotificationCenter />;
}
