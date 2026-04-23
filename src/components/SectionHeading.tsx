import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  action?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "mx-auto max-w-3xl text-center",
        align === "left" && "max-w-2xl",
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-3",
          align === "center" && "items-center",
          action && "md:flex-row md:items-end md:justify-between md:gap-8",
        )}
      >
        <div className={cn(align === "center" && "mx-auto")}>
          {eyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
              {eyebrow}
            </p>
          )}
          <h2 className="mt-1 font-heading text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
