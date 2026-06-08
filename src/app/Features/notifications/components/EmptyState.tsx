"use client";

import React from "react";
import { BellOff } from "lucide-react";
import Link from "next/link";

export default function EmptyState() {
  return (
    <div
      id="notification-empty-state"
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/40 bg-card/40 px-6 py-16 text-center"
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <BellOff size={36} className="text-muted-foreground" />
      </div>
      <h2 className="mb-2 text-lg font-semibold text-foreground">
        All caught up!
      </h2>
      <p className="mb-6 max-w-xs text-sm text-muted-foreground">
        You don&apos;t have any notifications in this category at the moment.
      </p>
      <Link
        href="/dashboard/patient"
        className="rounded-lg bg-muted px-5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-primary/10 hover:text-primary"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
