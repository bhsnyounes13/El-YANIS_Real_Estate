import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyMetaPillProps {
  icon: LucideIcon;
  label: string;
  variant?: "default" | "rent";
}

export function PropertyMetaPill({
  icon: Icon,
  label,
  variant = "default",
}: PropertyMetaPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-on-surface-variant",
        variant === "default" && "bg-surface-container-low",
        variant === "rent" && "bg-rent-soft text-rent-primary",
      )}
    >
      <Icon className="h-3.5 w-3.5 opacity-80" aria-hidden />
      {label}
    </span>
  );
}
