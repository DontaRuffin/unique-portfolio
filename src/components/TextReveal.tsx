import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, Variants } from 'framer-motion';
import { cn } from '../lib/utils';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: 'char' | 'word' | 'line';
  once?: boolean;
}

export function TextReveal({
  children,
  className,
  delay = 0,
  duration = 0.05,
  variant = 'char',
  once = true,
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-100px' });
  const controls = useAnimation();
  
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);
  
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: duration,
        delayChildren: delay,
      },
    },
  };
  
  const itemVariants: Variants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };
  
  const renderContent = () => {
    if (variant === 'char') {
      return children.split('').map((char, i) => (
        <motion.span
          key={i}
          variants={itemVariants}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ));
    }
    
    if (variant === 'word') {
      return children.split(' ').map((word, i) => (
        <motion.span
          key={i}
          variants={itemVariants}
          className="inline-block mr-[0.25em]"
        >
          {word}
        </motion.span>
      ));
    }
    
    if (variant === 'line') {
      return children.split('\n').map((line, i) => (
        <motion.span
          key={i}
          variants={itemVariants}
          className="block"
        >
          {line}
        </motion.span>
      ));
    }
    
    return children;
  };
  
  return (
    <motion.span
      ref={ref}
      className={cn('inline-block', className)}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {renderContent()}
    </motion.span>
  );
}

// Slide up reveal for larger blocks
interface SlideRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  once?: boolean;
}

export function SlideReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  once = true,
}: SlideRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-50px' });
  
  const getInitial = () => {
    switch (direction) {
      case 'up': return { y: 40, opacity: 0 };
      case 'down': return { y: -40, opacity: 0 };
      case 'left': return { x: 40, opacity: 0 };
      case 'right': return { x: -40, opacity: 0 };
    }
  };
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitial()}
      animate={isInView ? { x: 0, y: 0, opacity: 1 } : getInitial()}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 100,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

// Mask reveal (text slides up from behind a mask)
interface MaskRevealProps {
  children: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function MaskReveal({
  children,
  className,
  delay = 0,
  once = true,
}: MaskRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-50px' });
  
  return (
    <span ref={ref} className={cn('relative inline-block overflow-hidden', className)}>
      <motion.span
        className="inline-block"
        initial={{ y: '100%' }}
        animate={isInView ? { y: 0 } : { y: '100%' }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 100,
          delay,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export default TextReveal;
