import { cn } from "@/lib/utils";

export interface StatItem {
  value: string;
  label: string;
}

interface StatStripProps {
  stats: StatItem[];
  className?: string;
}

export function StatStrip({ stats, className }: StatStripProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-6 rounded-3xl bg-surface-container-lowest px-6 py-8 shadow-[var(--shadow-ambient)] md:grid-cols-4 md:gap-10 md:px-10",
        className,
      )}
    >
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <div className="font-heading text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
            {s.value}
          </div>
          <div className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-on-surface-variant">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}
