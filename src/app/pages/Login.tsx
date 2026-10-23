import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { AuthShell, FormError, Spinner, fieldClass } from '../components/AuthShell';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'student' | 'admin'>('student');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Enter your email and password to continue.');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const success = await login(email, password, loginType);
    if (success) {
      toast.success(loginType === 'admin' ? 'Signed in to the admin console' : 'Signed in. Good to see you again.');
      navigate(loginType === 'admin' ? '/admin' : '/', { replace: true });
    } else {
      setError(`That email and password don't match a${loginType === 'admin' ? 'n admin' : ' student'} account.`);
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      heading={
        <>
          Pick up right <span className="text-indigo-700">where you left off.</span>
        </>
      }
      lede="Your bookings, receipts and quiz progress are waiting for you."
      points={['Live sessions capped at small group sizes', 'Pre-workshop quizzes so you arrive ready', 'PDF receipts for every booking']}
      quote={{
        text: 'I shipped my first production React app two weeks after the workshop. The feedback was the useful part.',
        name: 'Ananya Kulkarni',
        role: 'Frontend engineer, Pune',
      }}
    >
      <h1 className="text-3xl tracking-[-0.03em] text-gray-900">Sign in</h1>
      <p className="mt-2 text-gray-500">Choose the account type you're signing in with.</p>

      {/* Account type */}
      <div role="tablist" aria-label="Account type" className="mt-8 grid grid-cols-2 gap-1 rounded-xl bg-gray-100 p-1">
        {(['student', 'admin'] as const).map(type => (
          <button
            key={type}
            type="button"
            role="tab"
            aria-selected={loginType === type}
            onClick={() => {
              setLoginType(type);
              setError('');
            }}
            className={`relative isolate rounded-lg py-2 text-sm capitalize transition-colors ${
              loginType === type ? 'text-gray-900' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {loginType === type && (
              <motion.span
                layoutId="login-type"
                className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm ring-1 ring-gray-900/[0.06]"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
              />
            )}
            {type}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <AnimatePresence>{error && <FormError message={error} />}</AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">
            Email
          </Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" strokeWidth={1.75} />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@college.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              aria-invalid={!!error && !email}
              className={fieldClass}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-gray-700">
            Password
          </Label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" strokeWidth={1.75} />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              aria-invalid={!!error && !password}
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
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="press flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-gray-900 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Spinner />
              Signing in
            </>
          ) : (
            `Sign in as ${loginType}`
          )}
        </button>
      </form>

      {loginType === 'student' && (
        <p className="mt-8 text-sm text-gray-500">
          New here?{' '}
          <Link to="/register" className="font-medium text-gray-900 underline decoration-indigo-300 decoration-2 underline-offset-4 hover:decoration-indigo-600">
            Create a free account
          </Link>
        </p>
      )}
    </AuthShell>
  );
};
