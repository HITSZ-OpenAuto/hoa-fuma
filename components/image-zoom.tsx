'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, ZoomIn } from 'lucide-react';

export interface ImageZoomProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  alt?: string;
  src?: string | unknown;
  caption?: string;
}

export function ImageZoom({
  src,
  alt = '',
  caption,
  className = '',
  ...props
}: ImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false);

  const imageSrc = typeof src === 'string' ? src : '';
  const displayCaption = caption || alt;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!imageSrc) return null;

  return (
    <>
      <span className="relative inline-block group cursor-zoom-in my-2 max-w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={alt}
          onClick={() => setIsOpen(true)}
          className={`rounded-lg border border-fd-border transition-transform duration-200 group-hover:scale-[1.01] ${className}`}
          {...props}
        />
        <span
          onClick={() => setIsOpen(true)}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs"
          title="Click to expand"
        >
          <ZoomIn className="w-4 h-4" />
        </span>
        {displayCaption && (
          <span className="block text-center text-xs text-fd-muted-foreground mt-1.5 italic">
            {displayCaption}
          </span>
        )}
      </span>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50 focus:outline-none"
            aria-label="Close image preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-7xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={alt}
              className="max-h-[82vh] max-w-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-200"
            />
            {displayCaption && (
              <p className="mt-3 text-center text-sm font-medium text-white/90 bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-xs">
                {displayCaption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
