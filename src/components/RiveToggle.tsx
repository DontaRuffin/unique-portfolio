import { useCallback, useEffect, useState } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { cn } from '../lib/utils';

interface RiveToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Neo-Brutalist Toggle with Rive Animation
 * 
 * Expects a Rive file with:
 * - State Machine: "ToggleState"
 * - Inputs:
 *   - "IsOn" (Boolean): Toggle state
 *   - "IsHovering" (Boolean): Hover state
 *   - "IsDisabled" (Boolean): Disabled state
 */
export function RiveToggle({
  checked = false,
  onChange,
  label,
  disabled = false,
  className,
}: RiveToggleProps) {
  const [isOn, setIsOn] = useState(checked);
  const [isHovering, setIsHovering] = useState(false);
  
  const { rive, RiveComponent } = useRive({
    src: '/animations/toggle.riv',
    stateMachines: 'ToggleState',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });
  
  const onInput = useStateMachineInput(rive, 'ToggleState', 'IsOn');
  const hoverInput = useStateMachineInput(rive, 'ToggleState', 'IsHovering');
  const disabledInput = useStateMachineInput(rive, 'ToggleState', 'IsDisabled');
  
  useEffect(() => {
    setIsOn(checked);
  }, [checked]);
  
  useEffect(() => {
    if (onInput) onInput.value = isOn;
  }, [isOn, onInput]);
  
  useEffect(() => {
    if (hoverInput) hoverInput.value = isHovering;
  }, [isHovering, hoverInput]);
  
  useEffect(() => {
    if (disabledInput) disabledInput.value = disabled;
  }, [disabled, disabledInput]);
  
  const handleToggle = useCallback(() => {
    if (disabled) return;
    const newValue = !isOn;
    setIsOn(newValue);
    onChange?.(newValue);
  }, [disabled, isOn, onChange]);
  
  return (
    <label
      className={cn(
        "inline-flex items-center gap-3 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "relative w-14 h-8 border-3 border-brutal-black",
          "transition-colors duration-150",
          isOn ? "bg-brutal-orange" : "bg-brutal-cream",
          !disabled && "hover:shadow-brutal-sm"
        )}
      >
        {/* Rive animation overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <RiveComponent />
        </div>
        
        {/* Fallback toggle knob (visible if Rive fails to load) */}
        <div
          className={cn(
            "absolute top-1 w-5 h-5 bg-brutal-black border-2 border-brutal-black",
            "transition-transform duration-150",
            isOn ? "translate-x-7" : "translate-x-1"
          )}
        />
      </button>
      
      {label && (
        <span className="font-mono text-sm uppercase tracking-wider">
          {label}
        </span>
      )}
    </label>
  );
}

export default RiveToggle;
