import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  align?: "center" | "left";
  variant?: "luminous" | "soft";
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  align = "center",
  variant = "luminous",
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        variant === "luminous" &&
          "bg-gradient-to-br from-[#0037b0] via-[#0d47c9] to-[#1d4ed8] text-primary-foreground",
        variant === "soft" && "bg-surface-container-low",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.12]"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M40 40v-8h-4v8h-8v4h8v8h4v-8h8v-4h-8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <div
        className={cn(
          "container relative z-[1] py-20 md:py-28",
          align === "center" && "text-center",
          align === "left" && "text-start",
        )}
      >
        {eyebrow && (
          <p
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.22em]",
              variant === "luminous" ? "text-white/75" : "text-on-surface-variant",
            )}
          >
            {eyebrow}
          </p>
        )}
        <h1
          className={cn(
            "mt-3 max-w-4xl font-heading text-4xl font-bold tracking-[-0.02em] md:text-5xl lg:text-[3.25rem] leading-[1.08]",
            align === "center" && "mx-auto",
            variant === "soft" && "text-foreground",
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "mt-5 max-w-2xl text-base leading-relaxed md:text-lg",
              align === "center" && "mx-auto",
              variant === "luminous" ? "text-white/80" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
