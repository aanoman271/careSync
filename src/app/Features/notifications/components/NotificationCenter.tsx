"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCheck, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import {
  DBNotification,
  NotificationCategory,
  NotificationsAPIResponse,
} from "@/types/notification";
import { FILTER_CHIPS } from "../data";
import { typeToCategory } from "../utils";
import FilterBar from "./FilterBar";
import NotificationCard from "./NotificationCard";
import EmptyState from "./EmptyState";

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div className="flex animate-pulse gap-4 rounded-xl border border-border/20 bg-card/60 p-5">
      <div className="h-11 w-11 shrink-0 rounded-xl bg-muted" />
      <div className="flex flex-1 flex-col gap-3 pt-1">
        <div className="h-2.5 w-24 rounded-full bg-muted" />
        <div className="h-4 w-3/4 rounded-full bg-muted" />
        <div className="h-3 w-full rounded-full bg-muted" />
        <div className="h-3 w-2/3 rounded-full bg-muted" />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function NotificationCenter() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [notifications, setNotifications] = useState<DBNotification[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotificationCategory>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────────

  const fetchNotifications = useCallback(
    async (silent = false) => {
      if (!userId) return;
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);
      setError(null);

      try {
        const res = await fetch(`/api/notifications?userId=${userId}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json: NotificationsAPIResponse = await res.json();
        if (!json.success) throw new Error("API returned failure");

        setNotifications(json.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load notifications",
        );
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchNotifications(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [fetchNotifications]);

  // ── Derived state ────────────────────────────────────────────────────────

  const unreadCounts = useMemo(() => {
    const counts: Record<NotificationCategory, number> = {
      all: 0,
      appointments: 0,
      updates: 0,
    };
    notifications.forEach((n) => {
      if (!n.isRead) {
        counts.all += 1;
        const cat = typeToCategory(n.type);
        counts[cat] += 1;
      }
    });
    return counts;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "all") return notifications;
    return notifications.filter((n) => typeToCategory(n.type) === activeFilter);
  }, [notifications, activeFilter]);

  const totalUnread = unreadCounts.all;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleMarkRead = useCallback(
    async (notificationId: string) => {
      if (!userId) return;
      // Optimistic UI update
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, isRead: true } : n,
        ),
      );
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, notificationId }),
        });
      } catch {
        // Revert on failure
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: false } : n,
          ),
        );
      }
    },
    [userId],
  );

  const handleMarkAllRead = useCallback(async () => {
    if (!userId) return;
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, markAll: true }),
      });
    } catch {
      // Re-fetch to restore correct state
      fetchNotifications(true);
    }
  }, [userId, fetchNotifications]);

  const handleDelete = useCallback(
    async (notificationId: string) => {
      if (!userId) return;
      // Optimistic removal
      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
      try {
        await fetch(
          `/api/notifications?notificationId=${notificationId}&userId=${userId}`,
          { method: "DELETE" },
        );
      } catch {
        // Re-fetch to restore
        fetchNotifications(true);
      }
    },
    [userId, fetchNotifications],
  );

  const handleFilterChange = useCallback((key: NotificationCategory) => {
    setActiveFilter(key);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* ─── Page Header ────────────────────────────────────────────────── */}
      <header className="flex flex-col gap-4 border-b border-border/20 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Notification Center
            </h1>
            {totalUnread > 0 && (
              <span
                aria-label={`${totalUnread} unread notifications`}
                className="flex h-6  items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground"
              >
                {totalUnread}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Stay updated with your clinical schedule and care team.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {/* Refresh */}
          <button
            id="refresh-notifications-btn"
            onClick={() => fetchNotifications(true)}
            disabled={isRefreshing || isLoading}
            aria-label="Refresh notifications"
            className="flex items-center gap-2 rounded-lg border border-border/30 bg-card px-3 py-2.5 text-[11px] font-semibold text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <RefreshCw
              size={13}
              className={isRefreshing ? "animate-spin" : ""}
            />
          </button>

          {/* Mark all read */}
          <button
            id="mark-all-read-btn"
            onClick={handleMarkAllRead}
            disabled={totalUnread === 0 || isLoading}
            className="flex items-center gap-2 rounded-lg border border-border/30 bg-card px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground transition-all duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCheck size={14} />
            Mark all as read
          </button>
        </div>
      </header>

      {/* ─── Filter Chips ────────────────────────────────────────────────── */}
      <FilterBar
        chips={FILTER_CHIPS}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        unreadCounts={unreadCounts}
      />

      {/* ─── Error banner ────────────────────────────────────────────────── */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span className="font-semibold">Failed to load:</span>
          {error}
          <button
            onClick={() => fetchNotifications()}
            className="ml-auto rounded-lg border border-destructive/30 px-3 py-1 text-[11px] font-semibold transition-colors hover:bg-destructive/10"
          >
            Retry
          </button>
        </div>
      )}

      {/* ─── Notification List ───────────────────────────────────────────── */}
      <section aria-label="Notifications list">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {/* Unread group label */}
            {filteredNotifications.some((n) => !n.isRead) && (
              <p className="px-1 pt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                New
              </p>
            )}

            {/* Unread first */}
            {filteredNotifications
              .filter((n) => !n.isRead)
              .map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))}

            {/* Earlier separator */}
            {filteredNotifications.some((n) => !n.isRead) &&
              filteredNotifications.some((n) => n.isRead) && (
                <p className="px-1 pt-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Earlier
                </p>
              )}

            {/* Read notifications */}
            {filteredNotifications
              .filter((n) => n.isRead)
              .map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                  onDelete={handleDelete}
                />
              ))}
          </div>
        )}
      </section>

      {/* ─── Footer count ────────────────────────────────────────────────── */}
      {!isLoading && filteredNotifications.length > 0 && (
        <p className="pb-4 text-center text-xs text-muted-foreground/60">
          {filteredNotifications.length} notification
          {filteredNotifications.length !== 1 ? "s" : ""}
          {activeFilter !== "all" ? ` in "${activeFilter}"` : ""}
        </p>
      )}
    </div>
  );
}
