import { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { cn } from '../lib/utils';

interface CursorFollowerProps {
  enabled?: boolean;
  className?: string;
}

export function CursorFollower({ enabled = true, className }: CursorFollowerProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [hoverText, setHoverText] = useState('');
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  useEffect(() => {
    if (!enabled) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    // Track hoverable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for interactive elements
      const isLink = target.closest('a');
      const isButton = target.closest('button');
      const isInteractive = target.closest('[data-cursor]');
      
      if (isLink || isButton || isInteractive) {
        setIsHovering(true);
        
        // Get custom text if available
        const cursorText = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
        setHoverText(cursorText || '');
      } else {
        setIsHovering(false);
        setHoverText('');
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [enabled, cursorX, cursorY]);
  
  if (!enabled) return null;
  
  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className={cn(
          "fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference",
          className
        )}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="bg-white"
          animate={{
            width: isHovering ? 60 : isClicking ? 8 : 12,
            height: isHovering ? 60 : isClicking ? 8 : 12,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{ borderRadius: 0 }}
        />
      </motion.div>
      
      {/* Hover text */}
      {hoverText && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999]"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '20px',
            translateY: '-50%',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <span className="px-2 py-1 bg-brutal-black text-brutal-white font-mono text-xs uppercase tracking-wider whitespace-nowrap">
            {hoverText}
          </span>
        </motion.div>
      )}
      
      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="border-2 border-brutal-orange"
          animate={{
            width: isHovering ? 80 : 40,
            height: isHovering ? 80 : 40,
            opacity: isClicking ? 0 : 0.5,
          }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        />
      </motion.div>
    </>
  );
}

export default CursorFollower;
