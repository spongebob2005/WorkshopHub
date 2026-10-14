import { ReactNode } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'motion/react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from './ui/alert-dialog';

const ease = [0.22, 1, 0.36, 1] as const;

/** Page wrapper + title row shared by every admin screen. */
export const AdminPage = ({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) => (
  <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 sm:px-6 md:pt-12 lg:px-8">
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <h1 className="text-3xl tracking-[-0.03em] text-gray-900">{title}</h1>
        <p className="mt-1.5 text-gray-500">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </motion.header>
    {children}
  </main>
);

export const StatRow = ({ items, loading }: { items: { label: string; value: ReactNode }[]; loading?: boolean }) => (
  <dl className={`mt-8 grid grid-cols-2 gap-y-6 border-y border-gray-200 py-6 ${items.length >= 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
    {items.map(({ label, value }) => (
      <div key={label}>
        <dt className="text-xs text-gray-500">{label}</dt>
        <dd className="mt-1 font-mono text-2xl text-gray-900 tabular">
          {loading ? <span className="inline-block h-6 w-12 animate-pulse rounded bg-gray-100 align-middle" /> : value}
        </dd>
      </div>
    ))}
  </dl>
);

export const SearchField = ({
  value,
  onChange,
  placeholder,
  label,
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
    <input
      type="search"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label}
      className="h-10 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-9 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 [&::-webkit-search-cancel-button]:hidden"
    />
    {value && (
      <button
        onClick={() => onChange('')}
        aria-label="Clear search"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
      >
        <X className="size-3.5" />
      </button>
    )}
  </div>
);

/** Segmented filter matching the catalog's category switcher. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  id,
}: {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  id: string;
}) {
  return (
    <div role="tablist" className="flex w-fit gap-1 rounded-xl bg-gray-100 p-1">
      {options.map(option => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`relative isolate flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors ${
              active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {active && (
              <motion.span
                layoutId={id}
                className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm ring-1 ring-gray-900/[0.06]"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
              />
            )}
            {option.label}
            {option.count !== undefined && <span className="font-mono text-xs text-gray-400 tabular">{option.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

/** Wraps a trigger in an accessible confirm dialog (replaces window.confirm). */
export const ConfirmAction = ({
  trigger,
  title,
  description,
  confirmLabel,
  destructive = true,
  onConfirm,
}: {
  trigger: ReactNode;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
    <AlertDialogContent className="rounded-2xl">
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={onConfirm}
          className={`rounded-lg ${destructive ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-900 hover:bg-indigo-700'}`}
        >
          {confirmLabel}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export const tableClass = {
  wrap: 'mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-gray-900/[0.06]',
  th: 'px-5 py-3 text-left text-xs font-normal text-gray-500',
  td: 'px-5 py-3.5 align-middle',
  row: 'border-t border-gray-100 transition-colors hover:bg-gray-50/70',
  iconButton: 'rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:pointer-events-none disabled:opacity-40',
  dangerButton: 'rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:pointer-events-none disabled:opacity-40',
};

export const SkeletonRows = ({ cols, rows = 5 }: { cols: number; rows?: number }) => (
  <>
    {Array.from({ length: rows }, (_, i) => (
      <tr key={i} className="border-t border-gray-100">
        {Array.from({ length: cols }, (_, j) => (
          <td key={j} className="px-5 py-4">
            <div className={`h-3.5 animate-pulse rounded bg-gray-100 ${j === 0 ? 'w-40' : 'w-20'}`} />
          </td>
        ))}
      </tr>
    ))}
  </>
);
