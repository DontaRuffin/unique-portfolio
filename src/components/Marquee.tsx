import { cn } from '../lib/utils';

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export function Marquee({
  children,
  direction = 'left',
  speed = 'normal',
  className,
}: MarqueeProps) {
  const speedMap = {
    slow: '40s',
    normal: '25s',
    fast: '15s',
  };

  return (
    <div
      className={cn(
        "flex overflow-hidden whitespace-nowrap border-y-3 border-brutal-black bg-brutal-black text-brutal-white",
        className
      )}
    >
      <div
        className="flex animate-marquee"
        style={{
          animationDuration: speedMap[speed],
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

export function MarqueeItem({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center px-8 py-3 font-mono text-sm uppercase tracking-widest">
      {children}
      <span className="ml-8 text-brutal-orange">◆</span>
    </span>
  );
}

export default Marquee;
