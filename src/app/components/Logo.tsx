import { Link } from 'react-router-dom';

interface LogoProps {
  to?: string;
  /** Light text for dark backgrounds */
  inverted?: boolean;
  tag?: string;
}

export const LogoMark = ({ className = 'size-8' }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden>
    <rect width="32" height="32" rx="8" fill="currentColor" />
    <g fill="var(--color-gray-400)">
      <rect x="8.4" y="7.4" width="4" height="3.6" rx="1" />
      <rect x="14" y="7.4" width="4" height="3.6" rx="1" />
      <rect x="8.4" y="21" width="4" height="3.6" rx="1" />
      <rect x="14" y="21" width="4" height="3.6" rx="1" />
      <rect x="19.6" y="21" width="4" height="3.6" rx="1" />
    </g>
    <g fill="var(--color-indigo-300)">
      <rect x="19.6" y="7.4" width="4" height="3.6" rx="1" />
      <rect x="7.4" y="13" width="17.2" height="6" rx="3" />
    </g>
  </svg>
);

export const Logo = ({ to = '/', inverted = false, tag }: LogoProps) => (
  <Link to={to} className="group flex items-center gap-2.5" aria-label="WorkshopHub home">
    <LogoMark className={`size-8 transition-transform duration-300 group-hover:-rotate-6 ${inverted ? 'text-white/10' : 'text-gray-900'}`} />
    <span className={`text-[1.05rem] font-semibold tracking-tight ${inverted ? 'text-white' : 'text-gray-900'}`}>
      Workshop<span className={`font-display ${inverted ? 'text-indigo-300' : 'text-indigo-600'}`}>hub</span>
    </span>
    {tag && (
      <span className="eyebrow ml-1 rounded border border-gray-200 px-1.5 py-0.5 text-[10px] text-gray-500">{tag}</span>
    )}
  </Link>
);
