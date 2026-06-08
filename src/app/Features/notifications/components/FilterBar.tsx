"use client";

import React from "react";
import { NotificationCategory, NotificationFilterChip } from "@/types/notification";

interface FilterBarProps {
  chips: NotificationFilterChip[];
  activeFilter: NotificationCategory;
  onFilterChange: (key: NotificationCategory) => void;
  unreadCounts: Record<NotificationCategory, number>;
}

export default function FilterBar({
  chips,
  activeFilter,
  onFilterChange,
  unreadCounts,
}: FilterBarProps) {
  return (
    <nav
      aria-label="Notification filters"
      className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
    >
      {chips.map((chip) => {
        const isActive = activeFilter === chip.key;
        const count = unreadCounts[chip.key] ?? 0;
        return (
          <button
            key={chip.key}
            id={`filter-chip-${chip.key}`}
            onClick={() => onFilterChange(chip.key)}
            aria-pressed={isActive}
            className={`
              relative flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2
              text-[11px] font-semibold uppercase tracking-widest
              transition-all duration-200 focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
              focus-visible:ring-offset-background
              ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-card text-muted-foreground hover:bg-primary/5 hover:text-primary"
              }
            `}
          >
            {chip.label}
            {count > 0 && (
              <span
                className={`
                  flex h-4 min-w-[16px] items-center justify-center rounded-full
                  px-1 text-[10px] font-bold leading-none
                  ${isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"}
                `}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
