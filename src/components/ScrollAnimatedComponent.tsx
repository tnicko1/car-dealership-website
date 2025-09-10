'use client';

import { motion, Variants } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';

interface ScrollAnimatedComponentProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const scrollVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, 0.05, 0.01, 0.9],
    },
  },
};

const ScrollAnimatedComponent = forwardRef<HTMLDivElement, ScrollAnimatedComponentProps>(
  ({ children, className, delay = 0 }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          ...scrollVariants,
          visible: {
            ...scrollVariants.visible,
            transition: { ...(scrollVariants.visible as any).transition, delay },
          },
        }}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollAnimatedComponent.displayName = 'ScrollAnimatedComponent';

export default ScrollAnimatedComponent;