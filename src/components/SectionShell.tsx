import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionShellProps {
  children: ReactNode;
  className?: string;
  tone?: "default" | "muted";
  id?: string;
}

export function SectionShell({ children, className, tone = "default", id }: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 md:py-28",
        tone === "muted" && "bg-surface-container/60 dark:bg-surface-container/35",
        className,
      )}
    >
      {children}
    </section>
  );
}
