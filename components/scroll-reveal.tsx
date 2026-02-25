'use client';

import type { ComponentProps } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

type MotionDivProps = ComponentProps<typeof motion.div>;

type ScrollRevealProps = MotionDivProps & {
  delay?: number;
};

export function ScrollReveal({
  delay = 0,
  className,
  children,
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
