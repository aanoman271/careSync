import { Hospital } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <span
        className="material-symbols-outlined text-3xl text-primary"
        style={{ fontVariationSettings: '"FILL" 1' }}
      >
        <Hospital />
      </span>
      <span className="text-2xl font-bold tracking-tight text-primary dark:text-primary">
        CareSync
      </span>
    </div>
  );
}
