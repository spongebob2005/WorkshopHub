import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { LogOut, User, Calendar, Home, BookOpen, Menu, X, Sparkles, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
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
        { to: '/', label: 'Workshops', icon: Home },
        { to: '/bookings', label: 'My Bookings', icon: Calendar },
        ...(isAdmin ? [{ to: '/admin', label: 'Admin Dashboard', icon: Shield }] : []),
      ]
    : [];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-indigo-500/5'
            : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-sm opacity-40 group-hover:opacity-70 transition-opacity" />
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                  <Sparkles className="size-5 text-white" />
                </div>
              </div>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-semibold text-xl tracking-tight">
                WorkshopHub
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}>
                  <div
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-200 ${
                      isActive(to)
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/60'
                    }`}
                  >
                    <Icon className="size-4" />
                    {label}
                    {isActive(to) && (
                      <motion.div
                        layoutId="navUnderline"
                        className="absolute bottom-1 left-4 right-4 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
                    <div className="size-7 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="size-3.5 text-white" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{user?.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all"
                  >
                    <LogOut className="size-3.5 mr-1.5" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/login')}
                    className="text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    Login
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate('/register')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-md shadow-indigo-200"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                      isActive(to)
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-gray-100 mt-2 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
                        <User className="size-4" />
                        {user?.name}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full text-red-600 border-red-200"
                      >
                        <LogOut className="size-3.5 mr-1.5" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => navigate('/login')}
                      >
                        Login
                      </Button>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                        onClick={() => navigate('/register')}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for mobile menu overlap prevention */}
      <div className="hidden" />
    </>
  );
};