import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { Workshop } from '../contexts/WorkshopContext';
import { WorkshopCover } from './WorkshopCover';
import { motion } from 'motion/react';

interface WorkshopCardProps {
  workshop: Workshop;
}

export const seatStatus = (available: number, total: number) => {
  const left = total > 0 ? available / total : 0;
  if (available === 0) return { label: 'Sold out', dot: 'bg-gray-400', bar: 'bg-gray-400' };
  if (left <= 0.2) return { label: `Only ${available} left`, dot: 'bg-red-500', bar: 'bg-red-500' };
  if (left <= 0.5) return { label: 'Filling up', dot: 'bg-amber-500', bar: 'bg-amber-500' };
  return { label: 'Open', dot: 'bg-emerald-500', bar: 'bg-gray-900' };
};

export const WorkshopCard = ({ workshop }: WorkshopCardProps) => {
  const navigate = useNavigate();
  const soldOut = workshop.availableSeats === 0;
  const filled = workshop.totalSeats > 0 ? 1 - workshop.availableSeats / workshop.totalSeats : 1;
  const status = seatStatus(workshop.availableSeats, workshop.totalSeats);
  const date = new Date(workshop.date);

  return (
    <motion.article
      whileHover={soldOut ? undefined : { y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onClick={() => !soldOut && navigate(`/workshop/${workshop.id}`)}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-gray-900/[0.06] transition-shadow duration-300 ${
        soldOut ? 'opacity-70' : 'cursor-pointer hover:shadow-[0_18px_40px_-18px_oklch(0.3_0.05_40/0.35)]'
      }`}
    >
      {/* Cover */}
      <div className="relative m-2 mb-0">
        <WorkshopCover
          category={workshop.category}
          image={workshop.image}
          title={workshop.title}
          className="aspect-[16/9] rounded-xl"
          imageClassName="transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 z-10 rounded-md bg-white/90 px-2 py-1 text-[11px] font-medium text-gray-800 backdrop-blur">
          {workshop.category}
        </div>
        <div className="absolute right-3 top-3 z-10 rounded-md bg-gray-950/80 px-2 py-1 font-mono text-xs text-white tabular backdrop-blur">
          ${workshop.price}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 pt-4">
        <div className="mb-3 flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-3.5" strokeWidth={1.75} />
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="h-3 w-px bg-gray-200" />
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" strokeWidth={1.75} />
            {workshop.duration}
          </span>
        </div>

        <h3 className="mb-1.5 text-[1.05rem] leading-snug text-gray-900 line-clamp-2">{workshop.title}</h3>
        <p className="mb-4 text-sm text-gray-500">with {workshop.instructor}</p>

        <p className="mb-5 text-sm leading-relaxed text-gray-600 line-clamp-2">{workshop.description}</p>

        {workshop.skills.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {workshop.skills.slice(0, 3).map(skill => (
              <span key={skill} className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {skill}
              </span>
            ))}
            {workshop.skills.length > 3 && (
              <span className="rounded-md px-1.5 py-0.5 text-xs text-gray-400">+{workshop.skills.length - 3}</span>
            )}
          </div>
        )}

        {/* Footer pinned to bottom so CTAs line up across the grid */}
        <div className="mt-auto border-t border-gray-100 pt-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-gray-700">
              <span className={`size-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>
            <span className="font-mono text-gray-400 tabular">
              {workshop.totalSeats - workshop.availableSeats}/{workshop.totalSeats} booked
            </span>
          </div>
          <div className="h-1 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: filled }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              className={`h-full origin-left rounded-full ${status.bar}`}
            />
          </div>

          <button
            onClick={e => {
              e.stopPropagation();
              navigate(`/workshop/${workshop.id}`);
            }}
            disabled={soldOut}
            className="press mt-4 flex w-full items-center justify-between rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-white hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400"
          >
            {soldOut ? 'Sold out' : 'View workshop'}
            {!soldOut && (
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
};
