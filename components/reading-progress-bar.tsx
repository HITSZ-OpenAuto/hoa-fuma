'use client';

import { useEffect, useState } from 'react';

/**
 * ReadingProgressBar component
 * Displays a fixed top z-50 gradient scroll progress bar (0% to 100%).
 */
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        const clamped = Math.min(100, Math.max(0, currentProgress));
        setProgress(clamped);
        setIsVisible(clamped > 0);
      } else {
        setProgress(0);
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-[3px] w-full pointer-events-none transition-opacity duration-300"
      aria-hidden="true"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div
        className="h-full w-full origin-left bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 transition-transform duration-100 ease-out"
        style={{ transform: `scaleX(${progress / 100})` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />
    </div>
  );
}
