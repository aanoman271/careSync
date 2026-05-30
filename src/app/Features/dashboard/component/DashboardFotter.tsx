import Link from "next/link";
import React from "react";

const DashboardFotter = () => {
  return (
    <footer className="border-t border-border/20 bg-card px-4 py-6 md:px-8">
      <div className="mx-auto flex  flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-foreground">CareSync</span>
          <span className="text-sm text-muted-foreground/60">
            © 2026 CareSync Healthcare. HIPAA Compliant.
          </span>
        </div>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms", "Help Center"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default DashboardFotter;
