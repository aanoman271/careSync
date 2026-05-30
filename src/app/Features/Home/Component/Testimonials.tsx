import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "CareSync made managing my chronic condition so much easier. The dashboard is intuitive, and I love having all my records in one place.",
    name: "Sarah T.",
    color: "bg-accent",
  },
  {
    quote:
      "As a busy professional, the video consultation feature is a lifesaver. No more driving across town for a 15-minute follow-up.",
    name: "David L.",
    color: "bg-primary/20",
  },
  {
    quote:
      "The prescription management is flawless. My pharmacy receives orders instantly, and I get notified when they're ready.",
    name: "Emily R.",
    color: "bg-muted",
  },
];

export function Testimonials() {
  return (
    <section className="overflow-hidden py-20 w-full">
      <div className="mx-auto mb-12 max-w-7xl px-4 md:px-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Patient Success Stories
        </h2>
      </div>
      <div className="flex gap-6 overflow-x-auto px-4 pb-4 scrollbar-hide md:px-8">
        {testimonials.map((t) => (
          <div
            key={t.name}
            className="w-80 shrink-0 rounded-[2rem] border border-border/30 bg-card/80 p-8 backdrop-blur-md md:w-96"
          >
            <div className="mb-6 flex gap-1 text-yellow-500">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} size={16} className="fill-yellow-500" />
              ))}
            </div>
            <p className="mb-8 text-base italic text-foreground">"{t.quote}"</p>
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-full ${t.color}`} />
              <div>
                <p className="font-bold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">Verified Patient</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
