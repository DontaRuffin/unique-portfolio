import { useEffect, useRef, useState, useCallback } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';

interface RiveMascotProps {
  className?: string;
  size?: number;
  trackScroll?: boolean;
  trackMouse?: boolean;
}

/**
 * Interactive Rive Mascot Component
 * 
 * This component expects a Rive file with the following state machine structure:
 * - State Machine: "MainState"
 * - Inputs:
 *   - "ScrollPercent" (Number 0-100): Controls scroll-based animations
 *   - "IsHovering" (Boolean): Triggers hover state
 *   - "MouseX" (Number 0-100): Mouse X position for eye tracking
 *   - "MouseY" (Number 0-100): Mouse Y position for eye tracking
 *   - "IsDarkMode" (Boolean): Triggers dark mode appearance
 *   - "Click" (Trigger): Triggers click animation
 */
export function RiveMascot({ 
  className = '', 
  size = 200,
  trackScroll = true,
  trackMouse = true 
}: RiveMascotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  
  const { rive, RiveComponent } = useRive({
    src: '/animations/mascot.riv',
    stateMachines: 'MainState',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });
  
  // State machine inputs
  const scrollInput = useStateMachineInput(rive, 'MainState', 'ScrollPercent');
  const hoverInput = useStateMachineInput(rive, 'MainState', 'IsHovering');
  const mouseXInput = useStateMachineInput(rive, 'MainState', 'MouseX');
  const mouseYInput = useStateMachineInput(rive, 'MainState', 'MouseY');
  const darkModeInput = useStateMachineInput(rive, 'MainState', 'IsDarkMode');
  const clickTrigger = useStateMachineInput(rive, 'MainState', 'Click');
  
  // Track scroll position
  useEffect(() => {
    if (!trackScroll || !scrollInput) return;
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollInput.value = Math.min(100, Math.max(0, scrollPercent));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollInput, trackScroll]);
  
  // Track mouse position for eye movement
  useEffect(() => {
    if (!trackMouse || !mouseXInput || !mouseYInput) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      mouseXInput.value = x;
      mouseYInput.value = y;
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseXInput, mouseYInput, trackMouse]);
  
  // Handle hover state
  useEffect(() => {
    if (hoverInput) {
      hoverInput.value = isHovering;
    }
  }, [isHovering, hoverInput]);
  
  // Handle click
  const handleClick = useCallback(() => {
    if (clickTrigger) {
      clickTrigger.fire();
    }
  }, [clickTrigger]);
  
  // Check for dark mode
  useEffect(() => {
    if (!darkModeInput) return;
    
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark') ||
                     window.matchMedia('(prefers-color-scheme: dark)').matches;
      darkModeInput.value = isDark;
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', checkDarkMode);
    
    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener('change', checkDarkMode);
    };
  }, [darkModeInput]);
  
  return (
    <div 
      ref={containerRef}
      className={`relative cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <RiveComponent />
    </div>
  );
}

export default RiveMascot;
