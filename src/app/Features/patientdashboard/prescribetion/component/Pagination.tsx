import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  current,
  totalItems,
  perPage,
  onChange,
}: {
  current: number;
  totalItems: number;
  perPage: number;
  onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(totalItems / perPage) || 1;
  
  const startItem = totalItems === 0 ? 0 : (current - 1) * perPage + 1;
  const endItem = Math.min(current * perPage, totalItems);

  // Generate range of page numbers to show (e.g. max 5 around current)
  const pages = [];
  const maxVisible = 3;
  let startPage = Math.max(1, current - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between border-t border-border/30 bg-muted/30 px-6 py-3">
      <span className="text-xs text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} prescriptions
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={current === 1}
          onClick={() => onChange(current - 1)}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`h-8 w-8 rounded text-xs font-bold transition-colors ${
              current === p
                ? "border border-primary/30 bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          disabled={current === totalPages}
          onClick={() => onChange(current + 1)}
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
