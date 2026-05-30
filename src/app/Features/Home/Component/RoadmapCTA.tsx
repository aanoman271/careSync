import React from "react";

export function RoadmapCTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 w-full">
      <div className="relative overflow-hidden rounded-[3rem] bg-primary p-12 text-primary-foreground">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white">
              Coming Q1 2025
            </span>
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              The Future of<br />Personalized Health.
            </h2>
            <p className="text-lg opacity-80 text-white/90">
              We're building the next generation of predictive healthcare tools using advanced machine learning.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { icon: "psychology", title: "AI Symptom Checker", desc: "Guided health assessment before your visit." },
              { icon: "video_chat", title: "Spatial Consultations", desc: "Immersive remote care using MR technology." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-all hover:bg-white/20"
              >
                <span className="material-symbols-outlined mb-4 text-4xl text-white">{item.icon}</span>
                <h4 className="mb-2 font-bold text-white">{item.title}</h4>
                <p className="text-sm opacity-70 text-white/80">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
