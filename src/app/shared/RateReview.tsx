"use client";

import { ReviewForm } from "@/types/bookDoctor";
import { Star, X } from "lucide-react";
import { useState } from "react";

// Shared Tailwind style classes to avoid compilation errors
const labelClass = "mb-1.5 block text-xs font-semibold text-foreground";
const fieldClass =
  "w-full rounded-xl border border-border/60 bg-background px-3 py-2 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary focus:ring-1 focus:ring-primary";

function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            size={24}
            className={`transition-colors ${
              star <= (hovered || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-border"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 self-center text-xs text-muted-foreground">
          {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
        </span>
      )}
    </div>
  );
}

// ─── Review Modal Component ──────────────────────────────────────────────────

export function ReviewModal({
  doctorName,
  onClose,
}: {
  doctorName: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState<ReviewForm>({ rating: 0, comment: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!form.rating || !form.comment.trim()) return;

    // Log structure matching backend telemetry requirements
    console.log("Review Submitted:", {
      doctor: doctorName,
      rating: form.rating,
      comment: form.comment,
      submittedAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card p-6 shadow-2xl">
        {/* Header Section */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Rate & Review
            </h3>
            <p className="text-xs text-muted-foreground">{doctorName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Conditional View Switching based on form submission status */}
        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/15">
              <Star size={28} className="fill-green-500 text-green-500" />
            </div>
            <p className="font-semibold text-foreground">
              Thank you for your review!
            </p>
            <p className="text-sm text-muted-foreground">
              Your feedback helps other patients make better decisions.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Star Rating Input Container */}
            <div>
              <label className={labelClass}>Your Rating</label>
              <StarRatingInput
                value={form.rating}
                onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
              />
            </div>

            {/* Comment Area Box */}
            <div>
              <label className={labelClass}>Your Review</label>
              <textarea
                rows={4}
                placeholder="Share your experience with this doctor..."
                value={form.comment}
                onChange={(e) =>
                  setForm((f) => ({ ...f, comment: e.target.value }))
                }
                maxLength={300}
                className={fieldClass + " resize-none"}
              />
              <p className="mt-1 text-right text-[11px] text-muted-foreground">
                {form.comment.length}/300
              </p>
            </div>

            {/* Form Submission Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!form.rating || !form.comment.trim()}
              className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
