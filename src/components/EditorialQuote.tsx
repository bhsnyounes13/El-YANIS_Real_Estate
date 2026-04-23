import { cn } from "@/lib/utils";

interface EditorialQuoteProps {
  quote: string;
  attribution?: string;
  className?: string;
}

export function EditorialQuote({ quote, attribution, className }: EditorialQuoteProps) {
  return (
    <blockquote
      className={cn(
        "rounded-3xl border border-outline-variant/40 bg-surface-container-lowest px-8 py-10 shadow-[var(--shadow-ambient)] md:px-12",
        className,
      )}
    >
      <p className="font-heading text-xl font-medium leading-snug tracking-[-0.02em] text-foreground md:text-2xl">
        &ldquo;{quote}&rdquo;
      </p>
      {attribution && (
        <footer className="mt-6 text-sm font-medium text-on-surface-variant">
          — {attribution}
        </footer>
      )}
    </blockquote>
  );
}
