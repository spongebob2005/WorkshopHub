import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { LogOut, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from './Logo';

export const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Signed out of the admin console');
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', label: 'Overview' },
    { path: '/admin/workshops', label: 'Workshops' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/registrations', label: 'Registrations' },
  ];

  const initials = user?.name
    ?.split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-900/[0.06] bg-gray-50/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Logo to="/admin" tag="Admin" />

          <div className="hidden flex-1 items-center gap-1 md:flex">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative isolate rounded-lg px-3.5 py-2 text-sm transition-colors ${
                    isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="admin-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm ring-1 ring-gray-900/[0.06]"
                      transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                    />
                  )}
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/"
              className="hidden items-center gap-1 rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:flex"
            >
              Student site
              <ArrowUpRight className="size-3.5" />
            </Link>
            <div className="mx-1 hidden h-5 w-px bg-gray-200 sm:block" />
            <div className="flex items-center gap-2.5 px-1">
              <span
                className="flex size-8 items-center justify-center rounded-lg bg-gray-900 text-xs font-semibold text-white"
                title={user?.email}
              >
                {initials}
              </span>
              <div className="hidden leading-tight lg:block">
                <p className="text-sm text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Log out"
              className="press flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <LogOut className="size-4" strokeWidth={1.75} />
              <span className="hidden md:inline">Log out</span>
            </button>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm ${
                  isActive ? 'bg-white text-gray-900 ring-1 ring-gray-900/[0.06]' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
