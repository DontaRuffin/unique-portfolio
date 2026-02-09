import { cn } from '../lib/utils';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function NeoButton({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        // Base styles
        "relative inline-flex items-center justify-center",
        "font-mono font-bold uppercase tracking-wider",
        "border-3 border-brutal-black",
        "transition-all duration-150 ease-out",
        "hover:translate-x-[2px] hover:translate-y-[2px]",
        "active:translate-x-[4px] active:translate-y-[4px]",
        
        // Shadow states
        "shadow-brutal hover:shadow-brutal-hover active:shadow-none",
        
        // Size variants
        size === 'sm' && "px-4 py-2 text-xs",
        size === 'md' && "px-6 py-3 text-sm",
        size === 'lg' && "px-8 py-4 text-base",
        
        // Color variants
        variant === 'primary' && "bg-brutal-orange text-white",
        variant === 'secondary' && "bg-brutal-violet text-white",
        variant === 'dark' && "bg-brutal-black text-white",
        variant === 'ghost' && "bg-transparent text-brutal-black hover:bg-brutal-black hover:text-white",
        
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default NeoButton;
