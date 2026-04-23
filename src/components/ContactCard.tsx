import type { LucideIcon } from "lucide-react";

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  href?: string;
  external?: boolean;
}

export function ContactCard({ icon: Icon, title, value, href, external }: ContactCardProps) {
  const inner = (
    <>
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-container text-primary">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-variant">
        {title}
      </h3>
      <p className="mt-1.5 text-sm font-medium text-foreground">{value}</p>
    </>
  );

  const className =
    "luminous-card-quiet block p-6 text-start transition-transform hover:-translate-y-0.5";

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
      >
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
}
