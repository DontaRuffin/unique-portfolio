import { useCallback, useState } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { cn } from '../lib/utils';

interface RiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

/**
 * Neo-Brutalist Button with Rive Animations
 * 
 * Expects a Rive file with:
 * - State Machine: "ButtonState"
 * - Inputs:
 *   - "IsHovering" (Boolean)
 *   - "IsPressed" (Boolean)
 *   - "IsDisabled" (Boolean)
 */
export function RiveButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
}: RiveButtonProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const { rive, RiveComponent } = useRive({
    src: '/animations/button.riv',
    stateMachines: 'ButtonState',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Fill,
      alignment: Alignment.Center,
    }),
  });
  
  const hoverInput = useStateMachineInput(rive, 'ButtonState', 'IsHovering');
  const pressedInput = useStateMachineInput(rive, 'ButtonState', 'IsPressed');
  const disabledInput = useStateMachineInput(rive, 'ButtonState', 'IsDisabled');
  
  // Update inputs
  if (hoverInput) hoverInput.value = isHovering;
  if (pressedInput) pressedInput.value = isPressed;
  if (disabledInput) disabledInput.value = disabled;
  
  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);
  
  return (
    <button
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden",
        "font-mono font-bold uppercase tracking-wider",
        "border-3 border-brutal-black",
        "transition-all duration-150 ease-out",
        !disabled && "hover:translate-x-[2px] hover:translate-y-[2px]",
        !disabled && "active:translate-x-[4px] active:translate-y-[4px]",
        "shadow-brutal",
        !disabled && "hover:shadow-brutal-hover active:shadow-none",
        disabled && "opacity-50 cursor-not-allowed",
        size === 'sm' && "px-4 py-2 text-xs",
        size === 'md' && "px-6 py-3 text-sm",
        size === 'lg' && "px-8 py-4 text-base",
        variant === 'primary' && "bg-brutal-orange text-white",
        variant === 'secondary' && "bg-brutal-violet text-white",
        variant === 'dark' && "bg-brutal-black text-white",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={handleClick}
      disabled={disabled}
    >
      {/* Rive animation background */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <RiveComponent />
      </div>
      
      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export default RiveButton;
