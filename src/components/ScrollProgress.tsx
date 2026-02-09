import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { cn } from '../lib/utils';

interface ScrollProgressProps {
  variant?: 'bar' | 'track' | 'circle';
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function ScrollProgress({
  variant = 'bar',
  position = 'top',
  className,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  if (variant === 'bar') {
    const isHorizontal = position === 'top' || position === 'bottom';
    
    return (
      <motion.div
        className={cn(
          "fixed z-50 bg-brutal-orange",
          position === 'top' && "top-0 left-0 right-0 h-1 origin-left",
          position === 'bottom' && "bottom-0 left-0 right-0 h-1 origin-left",
          position === 'left' && "top-0 left-0 bottom-0 w-1 origin-top",
          position === 'right' && "top-0 right-0 bottom-0 w-1 origin-top",
          className
        )}
        style={{
          scaleX: isHorizontal ? scaleX : 1,
          scaleY: !isHorizontal ? scaleY : 1,
        }}
      />
    );
  }
  
  if (variant === 'track') {
    return (
      <div
        className={cn(
          "fixed z-50",
          position === 'left' && "left-6 top-1/2 -translate-y-1/2",
          position === 'right' && "right-6 top-1/2 -translate-y-1/2",
          className
        )}
      >
        <div className="relative w-1 h-48 bg-brutal-black">
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-brutal-orange border-2 border-brutal-black"
            style={{
              top: useSpring(scrollYProgress, { stiffness: 100, damping: 30 }),
            }}
          />
        </div>
      </div>
    );
  }
  
  if (variant === 'circle') {
    return (
      <div
        className={cn(
          "fixed z-50",
          position === 'bottom' && "bottom-6 right-6",
          position === 'top' && "top-20 right-6",
          className
        )}
      >
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#000"
            strokeWidth="6"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#FF6B35"
            strokeWidth="6"
            strokeLinecap="square"
            strokeDasharray="283"
            style={{
              strokeDashoffset: useSpring(
                scrollYProgress.get() * -283 + 283,
                { stiffness: 100, damping: 30 }
              ),
            }}
          />
        </svg>
        <motion.span
          className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold"
          style={{ rotate: 90 }}
        >
          {Math.round(scrollYProgress.get() * 100)}%
        </motion.span>
      </div>
    );
  }
  
  return null;
}

export default ScrollProgress;
