import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';

const ease = [0.22, 1, 0.36, 1] as const;

interface AuthShellProps {
  heading: ReactNode;
  lede: string;
  points: string[];
  quote: { text: string; name: string; role: string };
  children: ReactNode;
}

/** Split layout shared by the sign-in and register screens. */
export const AuthShell = ({ heading, lede, points, quote, children }: AuthShellProps) => (
  <div className="flex min-h-[100dvh] bg-gray-50">
    <motion.aside
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="hidden p-3 lg:flex lg:w-[46%]"
    >
      <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-3xl bg-white p-12 ring-1 ring-gray-900/[0.06]">
        <div className="relative z-10">
          <Logo />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease }}
          className="relative z-10"
        >
          <h2 className="max-w-[14ch] text-5xl font-semibold leading-[1.05] tracking-[-0.035em] text-gray-900">{heading}</h2>
          <p className="mt-5 max-w-[42ch] leading-relaxed text-gray-500">{lede}</p>
          <ul className="mt-10 space-y-3">
            {points.map(point => (
              <li key={point} className="flex items-start gap-3 text-sm text-gray-700">
                <Check className="mt-0.5 size-4 shrink-0 text-indigo-600" strokeWidth={2} />
                {point}
              </li>
            ))}
          </ul>
        </motion.div>

        <figure className="relative z-10 max-w-[46ch] border-t border-gray-100 pt-6">
          <blockquote className="text-lg leading-snug text-gray-800">“{quote.text}”</blockquote>
          <figcaption className="mt-3 text-sm text-gray-500">
            {quote.name}, {quote.role}
          </figcaption>
        </figure>
      </div>
    </motion.aside>

    <main id="main" className="flex flex-1 flex-col px-6 py-6 sm:px-10">
      <div className="flex items-center justify-between">
        <div className="lg:invisible">
          <Logo />
        </div>
        <Link to="/" className="flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900">
          <ArrowLeft className="size-4" />
          Back to workshops
        </Link>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="mx-auto flex w-full max-w-[25rem] flex-1 flex-col justify-center py-12"
      >
        {children}
      </motion.div>
    </main>
  </div>
);

export const Spinner = () => (
  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden />
);

export const FormError = ({ message }: { message: string }) => (
  <motion.div
    role="alert"
    initial={{ opacity: 0, y: -6 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
  >
    <AlertCircle className="mt-0.5 size-4 shrink-0" />
    {message}
  </motion.div>
);

export const fieldClass =
  'h-11 rounded-lg border-gray-200 bg-white pl-10 shadow-[0_1px_0_rgb(0_0_0/0.02)] focus-visible:border-indigo-400 focus-visible:ring-4 focus-visible:ring-indigo-100';
