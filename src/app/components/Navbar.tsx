import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = isAuthenticated
    ? [
        { to: '/', label: 'Workshops' },
        { to: '/bookings', label: 'My bookings' },
        ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
      ]
    : [];

  const isActive = (path: string) => location.pathname === path;
  const initials = user?.name
    ?.split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <nav
      className={`sticky top-0 z-40 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? 'border-b border-gray-900/[0.06] bg-gray-50/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-gray-50'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Logo />

          {/* Desktop links */}
          <div className="hidden flex-1 items-center gap-1 md:flex">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                aria-current={isActive(to) ? 'page' : undefined}
                className={`relative isolate rounded-lg px-3.5 py-2 text-sm transition-colors ${
                  isActive(to) ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {isActive(to) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm ring-1 ring-gray-900/[0.06]"
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
                  />
                )}
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="hidden items-center gap-2 md:flex">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-100 text-xs font-semibold text-indigo-800">
                    {initials}
                  </span>
                  <span className="text-sm text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="press flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                >
                  <LogOut className="size-4" strokeWidth={1.75} />
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-lg px-3.5 py-2 text-sm text-gray-600 transition-colors hover:text-gray-900">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="press rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-gray-900/[0.06] bg-gray-50 md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`block rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive(to) ? 'bg-white text-gray-900 ring-1 ring-gray-900/[0.06]' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <div className="mt-2 space-y-2 border-t border-gray-200 pt-3">
                {isAuthenticated ? (
                  <>
                    <p className="px-3 text-sm text-gray-500">Signed in as {user?.name}</p>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="size-4" strokeWidth={1.75} />
                      Log out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" className="rounded-lg border border-gray-200 bg-white py-2.5 text-center text-sm text-gray-700">
                      Sign in
                    </Link>
                    <Link to="/register" className="rounded-lg bg-gray-900 py-2.5 text-center text-sm text-white">
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
