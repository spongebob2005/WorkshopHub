import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { AuthShell, FormError, Spinner, fieldClass } from '../components/AuthShell';

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
  const strengthColors = ['', 'bg-red-500', 'bg-amber-500', 'bg-indigo-500', 'bg-emerald-600'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !password || !confirmPassword) {
      setError('Fill in every field to create your account.');
      return;
    }
    if (password !== confirmPassword) {
      setError("The two passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError('Use at least 6 characters for your password.');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const success = await register(name, email, password);
    if (success) {
      toast.success('Account created. Welcome to WorkshopHub.');
      navigate('/', { replace: true });
    } else {
      setError('An account with this email already exists. Try signing in instead.');
      setIsLoading(false);
    }
  };

  const mismatch = confirmPassword !== '' && password !== confirmPassword;
  const matches = confirmPassword !== '' && password === confirmPassword;

  return (
    <AuthShell
      heading={
        <>
          Your first seat is <span className="text-indigo-700">a minute away.</span>
        </>
      }
      lede="Make an account to book workshops, take the readiness quizzes and keep your receipts in one place."
      points={['Eight disciplines, taught by working practitioners', 'Secure checkout with instant confirmation', 'Download a PDF receipt for every booking']}
      quote={{
        text: 'Small enough that the instructor knew my name by the second hour.',
        name: 'Rohan Deshpande',
        role: 'Data analyst, Mumbai',
      }}
    >
      <h1 className="text-3xl tracking-[-0.03em] text-gray-900">Create your account</h1>
      <p className="mt-2 text-gray-500">Free to join. You only pay when you book.</p>

      <div className="mt-8">
        <AnimatePresence>{error && <FormError message={error} />}</AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-gray-700">Full name</Label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" strokeWidth={1.75} />
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="Priya Sharma"
              value={name}
              onChange={e => setName(e.target.value)}
              className={fieldClass}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" strokeWidth={1.75} />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@college.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={fieldClass}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700">Password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" strokeWidth={1.75} />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`${fieldClass} pr-10`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {password && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 pt-1">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= strength ? strengthColors[strength] : 'bg-gray-200'}`}
                  />
                ))}
              </div>
              <span className="w-12 text-right text-xs text-gray-500">{strengthLabels[strength]}</span>
            </motion.div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-gray-700">Confirm password</Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" strokeWidth={1.75} />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Type it again"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              aria-invalid={mismatch}
              className={`${fieldClass} pr-16`}
              disabled={isLoading}
            />
            {matches && <Check className="absolute right-10 top-1/2 size-4 -translate-y-1/2 text-emerald-600" />}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {mismatch && <p className="text-xs text-red-600">Passwords don't match yet.</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="press mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gray-900 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Spinner />
              Creating account
            </>
          ) : (
            'Create account'
          )}
        </button>
      </form>

      <p className="mt-8 text-sm text-gray-500">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-gray-900 underline decoration-indigo-300 decoration-2 underline-offset-4 hover:decoration-indigo-600">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
};
