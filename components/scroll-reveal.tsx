'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

type ScrollRevealProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
};

export function ScrollReveal({
  delay = 0,
  className,
  children,
  onDrag,
  onDragStart,
  onDragEnd,
  onAnimationStart,
  onAnimationEnd,
  ...props
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        ease: 'easeOut',
        delay: delay / 1000,
      }}
      className={cn('will-change-[transform,opacity]', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
