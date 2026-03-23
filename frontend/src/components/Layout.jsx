import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Building2, 
  Bell, 
  Settings, 
  Plus, 
  Search, 
  LogOut, 
  ChevronDown,
  Home as HomeIcon,
  HelpCircle
} from 'lucide-react';
import AppTour from './AppTour';

const Layout = ({ children }) => {
  const [user, setUser] = useState({ name: 'User', role: 'seeker' });
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const notificationRef = useRef(null);

  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  useEffect(() => {
    if (isAuthPage || !isLoggedIn) return;

    const fetchData = async () => {
      try {
        const profileRes = await fetch('/api/auth/profile');
        if (profileRes.ok) {
          const userData = await profileRes.json();
          setUser({ name: userData.name, role: localStorage.getItem('role') || 'seeker' });
          
          const notifRes = await fetch('/api/notifications');
          const notifData = await notifRes.json();
          setNotifications(notifData);
          setUnreadCount(notifData.filter(n => !n.isRead).length);
        }
      } catch (err) {
        console.error('Layout fetch error:', err);
      }
    };

    fetchData();

    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [location.pathname, isLoggedIn, isAuthPage]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.clear();
    window.location.href = '/login';
  };

  const menuItems = [
    { icon: HomeIcon, label: 'Home', path: '/' }, // Added Home link
    { icon: Briefcase, label: 'Find Jobs', path: '/jobs' },
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', requiresAuth: true }, // Dashboard requires auth
    { icon: Building2, label: 'Post a Job', path: '/post-job', requiresAuth: true },
    { icon: Users, label: 'Profile', path: '/profile', requiresAuth: true },
    { icon: Bell, label: 'Notifications', path: '/notifications', requiresAuth: true },
    { icon: Settings, label: 'Settings', path: '/settings', requiresAuth: true },
  ];

  if (isAuthPage) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      {/* Sidebar */}
      <aside id="main-sidebar" className="w-64 bg-[#1f2937] text-white flex flex-col fixed h-full z-40 transition-transform">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center text-xl font-bold shadow-lg shadow-brand-primary/20">
              D
            </div>
            <span className="text-xl font-bold tracking-tight">DailyJobs</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isVisible = isLoggedIn || ['/', '/jobs'].includes(item.path);
            
            if (!isVisible) return null;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('restart-tour'))}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all font-medium mb-2 border border-white/5"
          >
            <HelpCircle size={20} />
            <span>Restart Tour</span>
          </button>

          {isLoggedIn && (
            <>
              <div className="flex items-center space-x-3 px-4 py-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-xs font-bold">
                  {user.name ? user.name[0] : 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{user.role}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <AppTour />
        <header id="main-header" className="h-16 bg-white/80 backdrop-blur-md border-b border-brand-border flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center bg-brand-bg rounded-lg border border-brand-border px-3 py-1.5 w-96 max-w-full">
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2"
            />
          </div>

          <div className="flex items-center space-x-4" ref={notificationRef}>
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-brand-bg text-gray-500 relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
              
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-brand-border overflow-hidden z-50">
                  <div className="p-4 border-b border-brand-border">
                    <h3 className="font-bold text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-8 text-center text-xs text-gray-400">No new alerts</p>
                    ) : (
                      notifications.map((notif, i) => (
                        <div key={i} className="p-4 hover:bg-brand-bg border-b border-brand-border last:border-0 flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!notif.isRead ? 'bg-brand-primary' : 'bg-gray-300'}`}></div>
                          <p className="text-xs text-gray-600 leading-normal">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <Link to="/notifications" className="block p-3 text-center text-[10px] font-bold text-brand-primary hover:bg-brand-bg transition-all grayscale" onClick={() => setShowNotifications(false)}>
                    VIEW ALL ACTIVITY
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>
        <section className="p-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;
