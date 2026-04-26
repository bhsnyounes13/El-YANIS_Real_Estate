import { useState } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  emptyLabel?: string;
}

const LazyImage = ({ src, alt, className, emptyLabel = "Image indisponible" }: LazyImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const normalizedSrc = src?.trim();

  if (!normalizedSrc || error) {
    return (
      <div
        className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}
      >
        <span className="text-sm">{emptyLabel}</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-muted" />}
      <img
        src={normalizedSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
};

export default LazyImage;
