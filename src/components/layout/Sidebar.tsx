import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Code2,
  Mail,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronLeft,
  LogOut,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/waitlist', icon: Users, label: 'Waitlist' },
  { to: '/embed', icon: Code2, label: 'Embed' },
  { to: '/emails', icon: Mail, label: 'Emails' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  const projectId = searchParams.get('project') || localStorage.getItem('selectedProjectId') || '';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Listen for toggle events from TopBar
    const handleToggle = (event: CustomEvent) => {
      setIsCollapsed(event.detail.isCollapsed);
    };
    window.addEventListener('sidebarToggle', handleToggle as EventListener);
    return () => window.removeEventListener('sidebarToggle', handleToggle as EventListener);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-br from-mint-600 to-mint-500 text-white p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? '16rem' : isCollapsed ? '6rem' : '16rem',
          x: isMobile && !isOpen ? '-100%' : 0,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={`${
          isMobile ? 'fixed' : 'fixed'
        } inset-y-0 left-0 z-40 bg-white dark:bg-dark-card border-r border-mint-600/10 dark:border-dark-border flex flex-col shadow-xl lg:shadow-none overflow-x-hidden`}
      >
        {/* Header */}
        <div className="h-[73px] px-4 py-4 border-b border-mint-600/10 dark:border-dark-border flex items-center justify-center">
          {/* Logo */}
          <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'gap-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-mint-600 to-mint-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.h1
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl font-bold bg-gradient-to-r from-mint-600 to-mint-500 bg-clip-text text-transparent whitespace-nowrap"
                >
                  Wait.ly
                </motion.h1>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Back to Projects */}
        {(!isCollapsed || isMobile) && (
          <div className="px-3 py-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/projects')}
              className="w-full flex items-center gap-2 text-mint-600 dark:text-mint-400 hover:bg-mint-50 dark:hover:bg-dark-hover px-3 py-2 rounded-lg transition-all"
            >
              <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-medium">All Projects</span>
            </motion.button>
          </div>
        )}

        {isCollapsed && !isMobile && (
          <div className="px-3 py-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/projects')}
              className="w-full p-2.5 hover:bg-mint-50 dark:hover:bg-dark-hover rounded-lg transition-colors text-mint-600 dark:text-mint-400 flex items-center justify-center"
              title="All Projects"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              to={projectId ? `${item.to}?project=${projectId}` : item.to}
              onClick={() => isMobile && setIsOpen(false)}
              title={isCollapsed && !isMobile ? item.label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center ${
                  isCollapsed && !isMobile ? 'justify-center' : 'gap-3'
                } px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-mint-600 to-mint-500 text-white shadow-lg shadow-mint-600/20'
                    : 'text-mint-900 dark:text-dark-text hover:bg-mint-50 dark:hover:bg-dark-hover'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <AnimatePresence>
                    {(!isCollapsed || isMobile) && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-2 px-3 py-2 bg-mint-900 dark:bg-dark-card text-white dark:text-dark-text text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-xl border border-mint-600/20 dark:border-dark-border z-50">
                      {item.label}
                    </div>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-mint-600/10 dark:border-dark-border">
          <div
            className={`flex items-center ${
              isCollapsed && !isMobile ? 'justify-center' : 'gap-3'
            } mb-3 px-3 py-2`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-mint-600 to-mint-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 min-w-0 overflow-hidden"
                >
                  <p className="font-semibold text-mint-900 dark:text-dark-text truncate text-sm">
                    {user?.user_metadata?.name || 'User'}
                  </p>
                  <p className="text-xs text-mint-900/70 dark:text-dark-text-muted truncate">
                    {user?.email}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignOut}
            title={isCollapsed && !isMobile ? 'Sign Out' : undefined}
            className={`w-full flex items-center ${
              isCollapsed && !isMobile ? 'justify-center' : 'gap-3'
            } px-3 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all font-medium`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <AnimatePresence>
              {(!isCollapsed || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="whitespace-nowrap"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
