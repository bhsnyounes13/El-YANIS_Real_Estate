import { useState, useEffect, ImgHTMLAttributes } from 'react';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  placeholder?: string;
}

export default function LazyImage({ 
  src, 
  placeholder = 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
  alt,
  className,
  ...props 
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!src) {
      setImageSrc(placeholder);
      setIsLoaded(true);
      return;
    }

    const img = new Image();
    img.src = src;
    
    const handleLoad = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
    
    const handleError = () => {
      setImageSrc(placeholder);
      setIsLoaded(true);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src, placeholder]);

  return (
    <img
      src={imageSrc || placeholder}
      alt={alt}
      className={`${className || ''} ${isLoaded ? '' : 'animate-pulse'}`}
      loading="lazy"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = placeholder;
      }}
      {...props}
    />
  );
}