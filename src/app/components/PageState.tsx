import { ReactNode } from 'react';

/** Shared button looks, matching the navbar / home CTAs. */
export const btn = {
  primary:
    'press inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400',
  secondary:
    'press inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 hover:border-gray-300 hover:text-gray-900',
  ghost:
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm text-gray-600 transition-colors hover:text-gray-900',
};

export const PageLoader = () => (
  <div className="flex min-h-[60dvh] items-center justify-center" role="status" aria-label="Loading">
    <span className="size-6 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
  </div>
);

interface PageMessageProps {
  eyebrow: string;
  title: ReactNode;
  body: ReactNode;
  actions?: ReactNode;
}

/** Full-page message for not-found / restricted states, in the 404 page's style. */
export const PageMessage = ({ eyebrow, title, body, actions }: PageMessageProps) => (
  <main className="mx-auto flex min-h-[60dvh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
    <p className="eyebrow text-indigo-700">{eyebrow}</p>
    <h1 className="mt-4 max-w-[20ch] text-4xl tracking-[-0.035em] text-gray-900 sm:text-5xl">{title}</h1>
    <p className="mt-4 max-w-[52ch] text-gray-500">{body}</p>
    {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
  </main>
);
