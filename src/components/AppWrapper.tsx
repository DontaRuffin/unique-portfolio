import { useState, useEffect } from 'react';
import { CommandPalette, useCommandPalette } from './CommandPalette';
import { ThemeProvider } from './ThemeProvider';
import { CursorFollower } from './CursorFollower';
import { ScrollProgress } from './ScrollProgress';

interface AppWrapperProps {
  children: React.ReactNode;
  enableCursor?: boolean;
  enableScrollProgress?: boolean;
}

export function AppWrapper({ 
  children,
  enableCursor = true,
  enableScrollProgress = true,
}: AppWrapperProps) {
  const { isOpen, onClose } = useCommandPalette();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <ThemeProvider defaultTheme="light">
      {/* Scroll Progress */}
      {enableScrollProgress && <ScrollProgress variant="bar" position="top" />}
      
      {/* Custom Cursor (desktop only) */}
      {enableCursor && !isMobile && <CursorFollower />}
      
      {/* Command Palette */}
      <CommandPalette isOpen={isOpen} onClose={onClose} />
      
      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-4 left-4 z-40 hidden md:flex items-center gap-2 px-3 py-2 bg-brutal-white border-2 border-brutal-black text-xs font-mono uppercase tracking-wider opacity-50 hover:opacity-100 transition-opacity">
        <kbd className="px-1.5 py-0.5 bg-brutal-cream border border-brutal-black">⌘</kbd>
        <kbd className="px-1.5 py-0.5 bg-brutal-cream border border-brutal-black">K</kbd>
        <span className="text-gray-500">Quick Actions</span>
      </div>
      
      {/* Main Content */}
      {children}
    </ThemeProvider>
  );
}

export default AppWrapper;
