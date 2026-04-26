import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LazyImage from "@/components/LazyImage";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  className?: string;
}

export function PropertyGallery({ images, title, className }: PropertyGalleryProps) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrent((i) => (i === images.length - 1 ? 0 : i + 1));

  if (images.length === 0) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="relative overflow-hidden rounded-3xl bg-surface-container">
          <LazyImage src={null} alt="" className="aspect-[4/5] w-full object-cover object-center" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative overflow-hidden rounded-3xl bg-surface-container">
        <LazyImage
          src={images[current]}
          alt={`${title} — ${current + 1}`}
          className="aspect-[4/5] w-full object-cover object-center"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute start-4 top-1/2 z-[1] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground shadow-[var(--shadow-ambient)] backdrop-blur-sm transition hover:bg-card"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute end-4 top-1/2 z-[1] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-card/90 text-foreground shadow-[var(--shadow-ambient)] backdrop-blur-sm transition hover:bg-card"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setCurrent(i)}
              className={cn(
                "relative h-16 w-20 shrink-0 overflow-hidden rounded-xl ring-2 ring-transparent transition",
                i === current && "ring-primary",
              )}
            >
              <LazyImage src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
