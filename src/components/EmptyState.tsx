import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
  children,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center py-20 text-center", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-surface-container text-on-surface-variant shadow-[var(--shadow-ambient)]">
        <Icon className="h-7 w-7" />
      </div>
      <p className="mt-6 font-heading text-xl font-semibold text-foreground">{title}</p>
      {description && <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>}
      {children}
    </div>
  );
}
