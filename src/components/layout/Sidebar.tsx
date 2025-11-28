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

  // Get project ID from URL or localStorage
  const projectId = searchParams.get('project') || localStorage.getItem('selectedProjectId') || '';

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-mint-600 text-white p-2 rounded-xl shadow-mint"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-mint-900/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`${
          isMobile 
            ? `fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'fixed inset-y-0 left-0'
        } w-64 bg-white border-r border-mint-600/10 p-6 flex flex-col overflow-y-auto`}
      >
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-mint-600 hover:bg-mint-50 px-3 py-2 rounded-lg transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">All Projects</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-mint-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-mint-900">Wait.ly</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={projectId ? `${item.to}?project=${projectId}` : item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-mint-600 text-white shadow-mint'
                    : 'text-mint-900 hover:bg-mint-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 border-t border-mint-600/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="w-10 h-10 bg-mint-600 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-mint-900 truncate">
                {user?.user_metadata?.name || 'User'}
              </p>
              <p className="text-sm text-mint-900/70 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-mint-900 hover:bg-mint-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
