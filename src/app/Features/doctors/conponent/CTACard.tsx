function CTACard() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-primary/30 bg-primary/15 p-6 text-center">
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-white blur-2xl" />
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-primary blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
          <span className="material-symbols-outlined text-3xl text-primary">
            question_mark
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Can,t find the right specialist?
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Our AI health assistant can recommend the best providers based on your
          symptoms.
        </p>
        <button className="rounded-full bg-primary px-8 py-3 text-xs font-bold text-primary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95">
          Start AI Matching
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default CTACard;
