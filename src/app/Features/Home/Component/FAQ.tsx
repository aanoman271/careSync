"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "How do I verify a doctor's credentials?",
    a: "Every medical professional on CareSync undergoes a rigorous primary source verification process, checking medical licenses, specialty certifications, and educational background against official records.",
  },
  {
    q: "Is my medical data shared with third parties?",
    a: "Absolutely not. We never sell or share your medical data for marketing. Access is only granted to healthcare providers you explicitly authorize during the booking process.",
  },
  {
    q: "Can I get a refund if I cancel my appointment?",
    a: "Appointments canceled at least 24 hours in advance are eligible for a full refund. Cancellations within 24 hours may be subject to a small provider fee depending on the clinic's policy.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-border/30 bg-card shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between p-6 text-left font-bold transition-colors hover:bg-primary/5"
      >
        {q}
        <ChevronDown
          size={20}
          className={`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-border/10 p-6 pt-4 text-sm text-muted-foreground">
          {a}
        </div>
      )}
    </div>
  );
}

export function FAQ() {
  return (
    <section className="bg-muted/30 py-20 w-full">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Common Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
