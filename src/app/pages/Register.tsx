import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, CheckCircle2, Shield, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

const perks = [
  { icon: Star, text: 'Access to 8+ expert-led workshops' },
  { icon: Shield, text: 'Secure payment processing' },
  { icon: CheckCircle2, text: 'Instant booking confirmation & receipts' },
];

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const passwordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const success = await register(name, email, password);
    if (success) {
      toast.success('Account created successfully! Welcome aboard.');
      navigate('/', { replace: true });
    } else {
      setError('Email already registered');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex-col justify-between p-12"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 9, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-400 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 11, repeat: Infinity, delay: 2 }}
            className="absolute bottom-10 -left-20 w-72 h-72 bg-purple-400 rounded-full blur-3xl"
          />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
            <Sparkles className="size-6 text-white" />
          </div>
          <span className="text-white text-xl font-semibold">WorkshopHub</span>
        </div>

        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl text-white mb-4 leading-tight">
              Start your{' '}
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                learning journey
              </span>{' '}
              today
            </h2>
            <p className="text-indigo-200 text-base mb-10 leading-relaxed">
              Create your free account and unlock access to premium workshops taught by industry leaders.
            </p>
            <div className="space-y-4">
              {perks.map(({ icon: Icon, text }, i) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="bg-white/15 rounded-full p-1.5">
                    <Icon className="size-4 text-green-300" />
                  </div>
                  <p className="text-white/90 text-sm">{text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative">
          <div className="flex -space-x-3">
            {['bg-indigo-300', 'bg-purple-300', 'bg-blue-300', 'bg-pink-300'].map((color, i) => (
              <div key={i} className={`size-9 ${color} rounded-full border-2 border-white/40 flex items-center justify-center`}>
                <User className="size-4 text-white/70" />
              </div>
            ))}
          </div>
          <p className="text-indigo-200 text-sm mt-2">Join 500+ learners this month</p>
        </div>
      </motion.div>

      {/* Right Panel */}
      <motion.div
        initial={{ x: 60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 bg-gray-50 overflow-y-auto"
      >
        <div className="w-full max-w-md py-6">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
              <Sparkles className="size-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              WorkshopHub
            </span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-100 p-8">
            <div className="mb-7">
              <h1 className="text-3xl text-gray-900 mb-2">Create account ✨</h1>
              <p className="text-gray-500">Start learning in just a few seconds</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm"
                >
                  <span className="size-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-gray-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-gray-700">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {/* Password strength */}
                {password && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength ? strengthColors[strength] : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs mt-1 ${strength >= 3 ? 'text-green-600' : strength >= 2 ? 'text-blue-600' : 'text-red-500'}`}>
                      {strengthLabels[strength]} password
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 h-11 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors ${
                      confirmPassword && password !== confirmPassword ? 'border-red-300 focus:border-red-400' : ''
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                  {confirmPassword && password === confirmPassword && (
                    <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 size-4 text-green-500" />
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl border-0 shadow-lg shadow-indigo-200/50 text-base transition-all mt-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="size-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Creating account...
                  </span>
                ) : (
                  'Create Free Account'
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
