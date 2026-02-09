import { cn } from '../lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'highlight' | 'dark';
  hover?: boolean;
  children: ReactNode;
}

export function NeoCard({ 
  variant = 'default', 
  hover = true,
  className, 
  children, 
  ...props 
}: CardProps) {
  return (
    <div
      className={cn(
        // Base styles
        "relative border-3 border-brutal-black",
        "transition-all duration-150 ease-out",
        
        // Shadow
        "shadow-brutal",
        
        // Hover effect
        hover && "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-brutal-hover cursor-pointer",
        
        // Variants
        variant === 'default' && "bg-brutal-white",
        variant === 'highlight' && "bg-brutal-orange text-white",
        variant === 'dark' && "bg-brutal-black text-white",
        
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardHeader({ className, children, ...props }: CardHeaderProps) {
  return (
    <div className={cn("p-6 border-b-3 border-brutal-black", className)} {...props}>
      {children}
    </div>
  );
}

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <div className={cn("p-6", className)} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <div className={cn("p-6 border-t-3 border-brutal-black bg-brutal-cream", className)} {...props}>
      {children}
    </div>
  );
}

export default NeoCard;
