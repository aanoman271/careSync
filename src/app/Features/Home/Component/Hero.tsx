import { Calendar, Video } from "lucide-react";
import Link from "next/link";

function HeartBars() {
  return (
    <div className="mt-2 flex h-8 items-end gap-1">
      {["h-1/2 bg-primary/30", "h-2/3 bg-primary/30", "h-full bg-primary", "h-3/4 bg-primary/60", "h-1/2 bg-primary/40"].map(
        (cls, i) => <div key={i} className={`w-1 rounded-full ${cls}`} />
      )}
    </div>
  );
}

function O2Bars() {
  return (
    <div className="mt-2 flex h-8 items-end gap-1">
      {["h-3/4 bg-green-400/30", "h-full bg-green-500", "h-4/5 bg-green-400/60", "h-2/3 bg-green-400/40", "h-1/2 bg-green-400/20"].map(
        (cls, i) => <div key={i} className={`w-1 rounded-full ${cls}`} />
      )}
    </div>
  );
}

export function HeroSection() {
  return (
    <header
      className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 overflow-hidden px-4 pb-20 pt-12 md:px-8 lg:grid-cols-2 w-full"
      style={{
        backgroundImage: `
          linear-gradient(to right,
            hsl(var(--background) / 0.97) 0%,
            hsl(var(--background) / 0.85) 50%,
            hsl(var(--background) / 0.5) 100%
          ),
          url("https://lh3.googleusercontent.com/aida/ADBb0uifBokWdb-Thyl8BZfXfoBJboFbfJ9t3v6h-RqpYrK8AFvB6bEYEgNpnA5VzEwNX8d1g5AJ3fc9d8FZIPWnbBXVyV8YYhllZ66x1k247eMxtFEkd5yXG5mNHWVtDQ9u6zxhS1T34yO0lVo2vc5pKuwTDa9aJ9ZPWhlMyS-KG6pkMS89fPQ_nNE1qhkvl8lJgOcuZllOMQQ5AuSgVtJPEvYYKAkLtGvpnD2iidkqQXhdavQMZNyjLYgm-eg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
          <span className="material-symbols-outlined text-sm text-primary">verified</span>
          <span className="text-xs font-semibold text-primary">Trusted by 50,000+ Patients</span>
        </div>
        <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-5xl lg:text-6xl">
          Expert Care,<br />
          <span className="text-primary">Anytime, Anywhere.</span>
        </h1>
        <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
          Consult with top-rated doctors via secure video calls or instant messaging. Professional
          healthcare that fits your life, powered by CareSync's HIPAA-compliant platform.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="#"
            className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
          >
            Book an Appointment
            <Calendar size={20} />
          </Link>
          <Link
            href="#"
            className="rounded-xl border border-border bg-background px-8 py-4 text-base font-semibold text-muted-foreground transition-all hover:bg-muted"
          >
            Explore Platform
          </Link>
        </div>
      </div>

      {/* Hero Card */}
      <div className="rounded-[2rem] border border-border/40 bg-card/80 p-6 shadow-2xl backdrop-blur-md">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-foreground">Patient Care Hub</h3>
            <div className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
              <span className="text-[10px] font-bold text-destructive">LIVE CONSULTATION</span>
            </div>
          </div>

          <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Next Up</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">AJ</div>
              <div>
                <p className="font-bold text-foreground">Alex Johnson</p>
                <p className="text-xs text-muted-foreground">Scheduled in 15 mins</p>
              </div>
              <button className="ml-auto rounded-full bg-primary p-2 text-primary-foreground">
                <Video size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
              <span className="material-symbols-outlined text-[20px] text-primary">person</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Monitoring Patient</p>
              <p className="font-bold text-foreground">Alex Johnson</p>
            </div>
            <div className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
              <span className="h-1 w-1 animate-pulse rounded-full bg-primary" />
              <span className="text-[8px] font-bold tracking-wider text-primary">LIVE</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
              <p className="mb-1 text-[10px] font-bold uppercase text-muted-foreground">
                Heart Rate <span className="text-[8px] font-normal text-primary/70">(Live)</span>
              </p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-primary">72</span>
                <span className="mb-1 text-[10px] text-muted-foreground">BPM</span>
              </div>
              <HeartBars />
            </div>
            <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
              <p className="mb-1 text-[10px] font-bold uppercase text-muted-foreground">
                O2 Saturation <span className="text-[8px] font-normal text-green-500/70">(Live)</span>
              </p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-green-500">98</span>
                <span className="mb-1 text-[10px] text-muted-foreground">%</span>
              </div>
              <O2Bars />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
