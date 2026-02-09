import { useEffect } from 'react';
import { useRive, useStateMachineInput, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import { cn } from '../lib/utils';

interface RiveLoaderProps {
  size?: number;
  variant?: 'default' | 'minimal' | 'brutal';
  isLoading?: boolean;
  progress?: number; // 0-100
  className?: string;
}

/**
 * Neo-Brutalist Loading Spinner with Rive
 * 
 * Expects a Rive file with:
 * - State Machine: "LoaderState"
 * - Inputs:
 *   - "IsLoading" (Boolean): Start/stop animation
 *   - "Progress" (Number 0-100): For determinate progress
 *   - "IsComplete" (Boolean): Trigger completion animation
 */
export function RiveLoader({
  size = 48,
  variant = 'default',
  isLoading = true,
  progress,
  className,
}: RiveLoaderProps) {
  const { rive, RiveComponent } = useRive({
    src: '/animations/loader.riv',
    stateMachines: 'LoaderState',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });
  
  const loadingInput = useStateMachineInput(rive, 'LoaderState', 'IsLoading');
  const progressInput = useStateMachineInput(rive, 'LoaderState', 'Progress');
  const completeInput = useStateMachineInput(rive, 'LoaderState', 'IsComplete');
  
  useEffect(() => {
    if (loadingInput) loadingInput.value = isLoading;
  }, [isLoading, loadingInput]);
  
  useEffect(() => {
    if (progressInput && progress !== undefined) {
      progressInput.value = progress;
    }
  }, [progress, progressInput]);
  
  useEffect(() => {
    if (completeInput && progress === 100) {
      completeInput.value = true;
    }
  }, [progress, completeInput]);
  
  return (
    <div 
      className={cn(
        "relative flex items-center justify-center",
        variant === 'brutal' && "border-3 border-brutal-black bg-brutal-white p-2",
        className
      )}
      style={{ width: size, height: size }}
    >
      <RiveComponent />
    </div>
  );
}

export default RiveLoader;
