import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Home,
  FolderOpen,
  User,
  Mail,
  Moon,
  Sun,
  Github,
  Linkedin,
  FileText,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '../lib/utils';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  shortcut?: string[];
  action: () => void;
  category: 'navigation' | 'actions' | 'social' | 'notes';
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Command items
  const commands: CommandItem[] = [
    // Navigation
    {
      id: 'home',
      label: 'Home',
      description: 'Go to homepage',
      icon: <Home className="w-4 h-4" />,
      shortcut: ['G', 'H'],
      action: () => { window.location.href = '/'; onClose(); },
      category: 'navigation',
    },
    {
      id: 'work',
      label: 'Work',
      description: 'View projects',
      icon: <FolderOpen className="w-4 h-4" />,
      shortcut: ['G', 'W'],
      action: () => { window.location.href = '/#work'; onClose(); },
      category: 'navigation',
    },
    {
      id: 'garden',
      label: 'Digital Garden',
      description: 'Explore notes',
      icon: <Sparkles className="w-4 h-4" />,
      shortcut: ['G', 'G'],
      action: () => { window.location.href = '/garden'; onClose(); },
      category: 'navigation',
    },
    {
      id: 'about',
      label: 'About',
      description: 'Learn about me',
      icon: <User className="w-4 h-4" />,
      shortcut: ['G', 'A'],
      action: () => { window.location.href = '/#about'; onClose(); },
      category: 'navigation',
    },
    // Actions
    {
      id: 'contact',
      label: 'Contact',
      description: 'Send an email',
      icon: <Mail className="w-4 h-4" />,
      shortcut: ['C'],
      action: () => { window.location.href = 'mailto:donta.ruffin@gmail.com'; onClose(); },
      category: 'actions',
    },
    {
      id: 'theme',
      label: 'Toggle Theme',
      description: isDark ? 'Switch to light mode' : 'Switch to dark mode',
      icon: isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      shortcut: ['T'],
      action: () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
      },
      category: 'actions',
    },
    // Social
    {
      id: 'github',
      label: 'GitHub',
      description: 'View my code',
      icon: <Github className="w-4 h-4" />,
      action: () => { window.open('https://github.com/dontaruffin', '_blank'); onClose(); },
      category: 'social',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      description: 'Connect with me',
      icon: <Linkedin className="w-4 h-4" />,
      action: () => { window.open('https://www.dontaruffin.com/in/dontaruffin', '_blank'); onClose(); },
      category: 'social',
    },
    // Notes (sample - would be dynamic)
    {
      id: 'note-design-engineering',
      label: 'Design Engineering',
      description: 'Note about design engineering',
      icon: <FileText className="w-4 h-4" />,
      action: () => { window.location.href = '/garden/design-engineering'; onClose(); },
      category: 'notes',
    },
    {
      id: 'note-webgpu',
      label: 'WebGPU Deep Dive',
      description: 'Note about WebGPU',
      icon: <FileText className="w-4 h-4" />,
      action: () => { window.location.href = '/garden/webgpu-deep-dive'; onClose(); },
      category: 'notes',
    },
  ];
  
  // Filter commands based on search
  const filteredCommands = commands.filter(cmd => {
    const searchLower = search.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.description?.toLowerCase().includes(searchLower) ||
      cmd.category.toLowerCase().includes(searchLower)
    );
  });
  
  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);
  
  const categoryLabels: Record<string, string> = {
    navigation: 'Navigation',
    actions: 'Actions',
    social: 'Social',
    notes: 'Notes',
  };
  
  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, filteredCommands, selectedIndex, onClose]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);
  
  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50"
          >
            <div className="mx-4 bg-brutal-white border-3 border-brutal-black shadow-brutal-lg overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b-3 border-brutal-black">
                <Search className="w-5 h-5 text-gray-500" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent font-mono text-sm outline-none placeholder:text-gray-400"
                />
                <kbd className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider border-2 border-brutal-black bg-brutal-cream">
                  ESC
                </kbd>
              </div>
              
              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto">
                {Object.entries(groupedCommands).length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <p className="font-mono text-sm text-gray-500">No results found</p>
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(([category, items]) => (
                    <div key={category}>
                      <div className="px-4 py-2 bg-brutal-cream border-b border-gray-200">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-gray-500">
                          {categoryLabels[category]}
                        </span>
                      </div>
                      {items.map((item) => {
                        const globalIndex = filteredCommands.indexOf(item);
                        const isSelected = globalIndex === selectedIndex;
                        
                        return (
                          <button
                            key={item.id}
                            onClick={item.action}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                              isSelected ? "bg-brutal-orange text-white" : "hover:bg-brutal-cream"
                            )}
                          >
                            <span className={cn(
                              "flex-shrink-0",
                              isSelected ? "text-white" : "text-gray-600"
                            )}>
                              {item.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-sm font-medium truncate">
                                {item.label}
                              </p>
                              {item.description && (
                                <p className={cn(
                                  "text-xs truncate",
                                  isSelected ? "text-white/70" : "text-gray-500"
                                )}>
                                  {item.description}
                                </p>
                              )}
                            </div>
                            {item.shortcut && (
                              <div className="flex gap-1">
                                {item.shortcut.map((key, i) => (
                                  <kbd
                                    key={i}
                                    className={cn(
                                      "px-1.5 py-0.5 text-[10px] font-mono uppercase border",
                                      isSelected 
                                        ? "border-white/30 text-white/70" 
                                        : "border-brutal-black bg-brutal-cream"
                                    )}
                                  >
                                    {key}
                                  </kbd>
                                ))}
                              </div>
                            )}
                            <ArrowRight className={cn(
                              "w-4 h-4 flex-shrink-0",
                              isSelected ? "text-white" : "text-gray-400"
                            )} />
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
              
              {/* Footer */}
              <div className="px-4 py-2 bg-brutal-cream border-t-3 border-brutal-black flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-[10px] font-mono uppercase text-gray-500">
                    <kbd className="px-1 border border-gray-400">↑↓</kbd> Navigate
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-mono uppercase text-gray-500">
                    <kbd className="px-1 border border-gray-400">↵</kbd> Select
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase text-gray-500">
                  Cmd+K to toggle
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook to handle Cmd+K
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  return { isOpen, setIsOpen, onClose: () => setIsOpen(false) };
}

export default CommandPalette;
