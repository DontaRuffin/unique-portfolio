import { useEffect, useState, useCallback } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { cn } from '../lib/utils';

type IconName = 'menu' | 'close' | 'arrow' | 'check' | 'star' | 'heart' | 'code' | 'rocket';

interface RiveIconProps {
  name: IconName;
  size?: number;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Animated Rive Icon Component
 * 
 * Each icon Rive file should have:
 * - State Machine: "IconState"
 * - Inputs:
 *   - "IsHovering" (Boolean)
 *   - "IsActive" (Boolean)
 *   - "Trigger" (Trigger): For one-shot animations
 */
export function RiveIcon({
  name,
  size = 24,
  isActive = false,
  onClick,
  className,
}: RiveIconProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  const { rive, RiveComponent } = useRive({
    src: `/animations/icons/${name}.riv`,
    stateMachines: 'IconState',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });
  
  const hoverInput = useStateMachineInput(rive, 'IconState', 'IsHovering');
  const activeInput = useStateMachineInput(rive, 'IconState', 'IsActive');
  const triggerInput = useStateMachineInput(rive, 'IconState', 'Trigger');
  
  useEffect(() => {
    if (hoverInput) hoverInput.value = isHovering;
  }, [isHovering, hoverInput]);
  
  useEffect(() => {
    if (activeInput) activeInput.value = isActive;
  }, [isActive, activeInput]);
  
  const handleClick = useCallback(() => {
    if (triggerInput) triggerInput.fire();
    onClick?.();
  }, [triggerInput, onClick]);
  
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center cursor-pointer",
        "transition-transform duration-150",
        "hover:scale-110 active:scale-95",
        className
      )}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
    >
      <RiveComponent />
    </div>
  );
}

export default RiveIcon;
