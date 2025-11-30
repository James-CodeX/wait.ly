import { Bell, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from '../ui/ThemeToggle';
import { useState, useEffect } from 'react';

export default function TopBar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
    // Dispatch custom event to notify Sidebar of the change
    window.dispatchEvent(new CustomEvent('sidebarToggle', { detail: { isCollapsed } }));
  }, [isCollapsed]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <header className="h-[73px] bg-white dark:bg-dark-card border-b border-mint-600/10 dark:border-dark-border px-6 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Collapse Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleCollapse}
          className="p-2 hover:bg-mint-50 dark:hover:bg-dark-hover rounded-lg transition-colors text-mint-600 dark:text-mint-400 flex-shrink-0"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </motion.button>

        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mint-600 dark:text-mint-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-mint-50 dark:bg-dark-bg border border-mint-600/20 dark:border-dark-border rounded-xl text-mint-900 dark:text-dark-text placeholder-mint-900/40 dark:placeholder-dark-text-muted focus:outline-none focus:border-mint-600 dark:focus:border-mint-500 focus:ring-4 focus:ring-mint-600/10 dark:focus:ring-mint-500/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 text-mint-600 dark:text-mint-400 hover:bg-mint-50 dark:hover:bg-dark-hover rounded-lg transition-colors"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-mint-600 dark:bg-mint-500 rounded-full" />
        </motion.button>
      </div>
    </header>
  );
}
