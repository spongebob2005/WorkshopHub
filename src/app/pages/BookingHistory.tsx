import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkshops, Booking, Workshop } from '../contexts/WorkshopContext';
import { useAuth } from '../contexts/AuthContext';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import { ArrowRight, ArrowUpRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { WorkshopCover } from '../components/WorkshopCover';
import { PageLoader, btn } from '../components/PageState';
import { downloadReceipt } from '../lib/receipt';

const ease = [0.22, 1, 0.36, 1] as const;

type FilterTab = 'all' | 'confirmed' | 'cancelled';

interface BookingRowProps {
  booking: Booking;
  workshop: Workshop;
  onCancel: () => void;
  onReceipt: () => void;
}

const BookingRow = ({ booking, workshop, onCancel, onReceipt }: BookingRowProps) => {
  const cancelled = booking.status === 'cancelled';
  const date = new Date(workshop.date);
  const state = cancelled ? { label: 'Cancelled', dot: 'bg-gray-400' } : { label: 'Confirmed', dot: 'bg-emerald-500' };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease }}
      className={`flex flex-col gap-4 rounded-2xl bg-white p-3 ring-1 ring-gray-900/[0.06] sm:flex-row sm:items-center ${cancelled ? 'opacity-70' : ''}`}
    >
      {/* Date block */}
      <div className="flex items-center gap-4 sm:w-auto">
        <div className="relative shrink-0">
          <WorkshopCover category={workshop.category} image={workshop.image} title={workshop.title} className="size-20 rounded-xl" />
          <div className="absolute inset-x-1.5 bottom-1.5 z-10 rounded-md bg-white/95 py-0.5 text-center font-mono text-[11px] text-gray-900 tabular backdrop-blur">
            {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>

        <div className="min-w-0 flex-1 sm:hidden">
          <p className="line-clamp-2 text-sm text-gray-900">{workshop.title}</p>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1.5 text-gray-700">
            <span className={`size-1.5 rounded-full ${state.dot}`} />
            {state.label}
          </span>
          <span className="h-3 w-px bg-gray-200" />
          <span>{workshop.time}</span>
          <span className="h-3 w-px bg-gray-200" />
          <span className="font-mono tabular">${booking.amount}</span>
        </div>
        <Link to={`/workshop/${workshop.id}`} className="mt-1.5 hidden truncate text-gray-900 hover:text-indigo-700 sm:block">
          {workshop.title}
        </Link>
        <p className="mt-0.5 truncate text-sm text-gray-500">
          with {workshop.instructor} · booked {new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1 border-t border-gray-100 pt-3 sm:border-0 sm:pt-0">
        <button onClick={onReceipt} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
          <Download className="size-4" strokeWidth={1.75} />
          Receipt
        </button>
        {!cancelled && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-red-50 hover:text-red-700">Cancel</button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your seat for <span className="text-gray-900">{workshop.title}</span> will go back on sale. You can book again later if seats are still open.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-lg">Keep my seat</AlertDialogCancel>
                <AlertDialogAction onClick={onCancel} className="rounded-lg bg-red-600 hover:bg-red-700">
                  Cancel booking
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <Link
          to={`/workshop/${workshop.id}`}
          aria-label={`Open ${workshop.title}`}
          className="ml-auto rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:ml-0"
        >
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </motion.li>
  );
};

export const BookingHistory = () => {
  const { user } = useAuth();
  const { getBookingsByUser, getWorkshopById, cancelBooking, loading } = useWorkshops();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  if (loading) return <PageLoader />;

  const rows = (user ? getBookingsByUser(user.id) : [])
    .map(booking => {
      const workshop = getWorkshopById(booking.workshopId);
      return workshop ? { booking, workshop } : null;
    })
    .filter((row): row is { booking: Booking; workshop: Workshop } => row !== null)
    .sort((a, b) => new Date(a.workshop.date).getTime() - new Date(b.workshop.date).getTime());

  const groups: Record<FilterTab, typeof rows> = {
    all: rows,
    confirmed: rows.filter(r => r.booking.status === 'confirmed'),
    cancelled: rows.filter(r => r.booking.status === 'cancelled'),
  };
  const spent = rows.filter(r => r.booking.status === 'confirmed').reduce((sum, r) => sum + r.booking.amount, 0);
  const visible = groups[activeTab];

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      toast.success('Booking cancelled. Your seat has been released.');
    } catch {
      toast.error("Couldn't cancel the booking. Try again.");
    }
  };

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const emptyCopy: Record<FilterTab, string> = {
    all: 'No bookings yet.',
    confirmed: 'No active bookings right now.',
    cancelled: 'No cancelled bookings.',
  };

  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-6 md:pt-14 lg:px-8">
      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
        <h1 className="text-3xl tracking-[-0.03em] text-gray-900 sm:text-4xl">My bookings</h1>
        <p className="mt-2 text-gray-500">Seats you've reserved, receipts, and anything you've cancelled.</p>
      </motion.header>

      <dl className="mt-10 grid grid-cols-2 gap-y-6 border-y border-gray-200 py-6 sm:grid-cols-4">
        {[
          { label: 'Bookings', value: groups.all.length },
          { label: 'Confirmed', value: groups.confirmed.length },
          { label: 'Cancelled', value: groups.cancelled.length },
          { label: 'Total spent', value: `$${spent.toFixed(2)}` },
        ].map(({ label, value }) => (
          <div key={label}>
            <dt className="text-xs text-gray-500">{label}</dt>
            <dd className="mt-1 font-mono text-2xl text-gray-900 tabular">{value}</dd>
          </div>
        ))}
      </dl>

      {rows.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-gray-300 px-6 py-20 text-center">
          <p className="font-display text-3xl text-gray-900">No bookings yet.</p>
          <p className="mx-auto mt-2 max-w-[44ch] text-gray-500">When you reserve a seat it shows up here, along with its receipt.</p>
          <Link to="/" className={`${btn.primary} group mt-6`}>
            Browse workshops
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      ) : (
        <>
          <div className="-mx-4 mt-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <div role="tablist" aria-label="Filter bookings" className="flex w-max gap-1 rounded-xl bg-gray-100 p-1">
              {tabs.map(({ id, label }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveTab(id)}
                    className={`relative isolate flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm transition-colors ${
                      active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="booking-tab"
                        className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm ring-1 ring-gray-900/[0.06]"
                        transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                      />
                    )}
                    {label}
                    <span className="font-mono text-xs text-gray-400 tabular">{groups[id].length}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <ul className="mt-6 space-y-3" role="tabpanel">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map(({ booking, workshop }) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  workshop={workshop}
                  onCancel={() => handleCancelBooking(booking.id)}
                  onReceipt={() => user && downloadReceipt(booking, workshop, user)}
                />
              ))}
            </AnimatePresence>
          </ul>
          {visible.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center text-sm text-gray-500">
              {emptyCopy[activeTab]}
              {activeTab === 'confirmed' && (
                <>
                  {' '}
                  <Link to="/" className="text-gray-900 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-900">
                    Find a workshop
                  </Link>
                </>
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
};
