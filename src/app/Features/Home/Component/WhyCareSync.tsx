import React from "react";
import Image from "next/image";
import { Shield, Accessibility, TrendingUp } from "lucide-react";

const advantages = [
  {
    icon: <Shield size={28} />,
    title: "Uncompromising Security",
    desc: "SOC2 Type II certified and fully HIPAA compliant. Your privacy is our absolute priority.",
  },
  {
    icon: <Accessibility size={28} />,
    title: "Universal Accessibility",
    desc: "Design with empathy. Our platform is WCAG 2.1 AA compliant, ensuring everyone can access care.",
  },
  {
    icon: <TrendingUp size={28} />,
    title: "Infinite Scalability",
    desc: "From single-doctor practices to multi-city hospital networks, we grow with your health needs.",
  },
];

export function WhyCareSync() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-8 w-full">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="relative">
          <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBi6rxa3HW-RPojrkXw3j4yraeEbvYjy5qwisiisJVSyw9Edm3RVRhv573qr538dmalT6uPIO6dqPk6DNLodmz5LPd_Agq1BjjfYSPR4m1xJaaJEwIS9FxQ4eq24aez4qkOYn4lQ3nsMBDxuakGk5nV27p69Vm76286R9rGGA1eQ-EGDhdzrwKwuw9TjJuikInp90FwHRbPOZeBDVlFLDvE91WMe4MvIAYT4myB5BIc--T32mWU-fDiHwxh4S86ZKmdCX4dpzUmHBI"
            alt="Medical Technology"
            width={600}
            height={500}
            className="h-[500px] w-full rounded-[3rem] object-cover shadow-2xl"
          />
          <div className="absolute -bottom-8 -right-8 max-w-xs rounded-3xl border border-border/40 bg-card/90 p-8 shadow-xl backdrop-blur-md">
            <p className="mb-2 text-4xl font-extrabold text-primary">99.9%</p>
            <p className="font-bold text-foreground">Uptime Reliability</p>
            <p className="text-sm text-muted-foreground">Your health records are always available when you need them most.</p>
          </div>
        </div>

        <div className="space-y-12">
          <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            The CareSync<br />
            <span className="text-primary">Advantage.</span>
          </h2>
          <div className="grid gap-8">
            {advantages.map((adv) => (
              <div key={adv.title} className="flex gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {adv.icon}
                </div>
                <div>
                  <h4 className="mb-1 text-lg font-bold text-foreground">{adv.title}</h4>
                  <p className="text-sm text-muted-foreground">{adv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
