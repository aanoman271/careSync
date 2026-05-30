"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send, Shield } from "lucide-react";
import { Logo } from "@/app/shared/Logo";
import { usePathname } from "next/navigation";

const Footer = () => {
  const [email, setEmail] = useState("");
  const pathname = usePathname();

  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/registration")) {
    return null;
  }

  return (
    <footer className="border-t border-border/20 bg-card/50 pb-10 pt-20 w-full">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-6">
            <Logo />
            <p className="text-sm text-muted-foreground">
              The future of healthcare management for patients and professionals alike.
            </p>
            <div className="flex gap-4">
              {["share", "mail"].map((icon) => (
                <Link
                  key={icon}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  <span className="material-symbols-outlined text-xl">{icon}</span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h5 className="mb-6 font-bold text-foreground">Platform</h5>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {["Doctors Portal", "Patient Hub", "Enterprise Solutions", "Integrations"].map((item) => (
                <li key={item}>
                  <Link href="#" className="transition-colors hover:text-primary">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-6 font-bold text-foreground">Support</h5>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {["Help Center", "API Status", "Community Forums", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link href="#" className="transition-colors hover:text-primary">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="font-bold text-foreground">Newsletter</h5>
            <p className="text-sm text-muted-foreground">Get the latest healthcare insights delivered to your inbox.</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button className="rounded-xl bg-primary p-2 px-4 text-primary-foreground transition-all hover:bg-primary/90">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-border/10 pt-8 md:flex-row">
          <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
            {["Privacy Policy", "Terms of Service", "Security"].map((item) => (
              <Link key={item} href="#" className="hover:underline">{item}</Link>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded border border-border/30 bg-muted px-3 py-1">
              <Shield size={14} className="text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-tighter">HIPAA Compliant</span>
            </div>
            <p className="text-xs text-muted-foreground">© 2026 CareSync Healthcare. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
