/**
 * Returns a human-readable relative time string from an ISO date string.
 * e.g. "2 minutes ago", "3 hours ago", "Yesterday", "Oct 20, 2024"
 */
export function formatDistanceToNow(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();

  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Maps a DBNotificationType to a NotificationCategory for filtering.
 */
export function typeToCategory(
  type: string
): "appointments" | "updates" {
  if (
    type === "appointment_reminder" ||
    type === "appointment_confirmed" ||
    type === "appointment_cancelled" ||
    type === "appointment_completed"
  ) {
    return "appointments";
  }
  return "updates";
}
