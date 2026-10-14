import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWorkshops } from '../contexts/WorkshopContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Check, Download } from 'lucide-react';
import { motion } from 'motion/react';
import canvasConfetti from 'canvas-confetti';
import { WorkshopCover } from '../components/WorkshopCover';
import { PageLoader, PageMessage, btn } from '../components/PageState';
import { downloadReceipt } from '../lib/receipt';

const ease = [0.22, 1, 0.36, 1] as const;

// Pine tints plus zinc, so the burst stays on-palette
const CONFETTI = ['#0f6b4f', '#2f9e78', '#8fd8b9', '#d4f1e4', '#27272a'];

export const PaymentSuccess = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { bookings, getWorkshopById, loading } = useWorkshops();
  const { user } = useAuth();
  const confettiFired = useRef(false);

  const booking = bookings.find(b => b.id === bookingId);
  const workshop = booking ? getWorkshopById(booking.workshopId) : null;

  useEffect(() => {
    if (!booking || confettiFired.current) return;
    confettiFired.current = true;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    canvasConfetti({ particleCount: 90, spread: 70, startVelocity: 38, origin: { y: 0.35 }, colors: CONFETTI, disableForReducedMotion: true });
  }, [booking]);

  if (loading) return <PageLoader />;

  if (!booking || !workshop) {
    return (
      <PageMessage
        eyebrow="Booking not found"
        title="We couldn't find that booking."
        body="If you just paid, it may still be saving. Your confirmed bookings are always listed under My bookings."
        actions={
          <>
            <Link to="/bookings" className={btn.primary}>
              My bookings
            </Link>
            <Link to="/" className={btn.ghost}>
              Browse workshops
            </Link>
          </>
        }
      />
    );
  }

  const workshopDate = new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 pt-12 sm:px-6 md:pt-20">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
        <motion.span
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
          className="flex size-11 items-center justify-center rounded-xl bg-indigo-600 text-white"
        >
          <Check className="size-5" strokeWidth={2.5} />
        </motion.span>
        <p className="eyebrow mt-6 text-indigo-700">Booking confirmed</p>
        <h1 className="mt-3 text-4xl tracking-[-0.035em] text-gray-900 sm:text-5xl">You're in.</h1>
        <p className="mt-4 max-w-[48ch] text-gray-500">
          Your seat for <span className="text-gray-900">{workshop.title}</span> is reserved. The materials and quizzes are unlocked on the workshop page.
        </p>
      </motion.div>

      {/* Ticket */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease }}
        className="mt-10 overflow-hidden rounded-2xl bg-white ring-1 ring-gray-900/[0.06] shadow-[0_12px_32px_-16px_oklch(0.3_0.02_286/0.18)]"
        aria-label="Booking details"
      >
        <div className="flex items-center gap-4 p-4">
          <WorkshopCover category={workshop.category} image={workshop.image} title={workshop.title} className="size-16 shrink-0 rounded-lg" />
          <div className="min-w-0">
            <p className="truncate text-gray-900">{workshop.title}</p>
            <p className="mt-0.5 text-sm text-gray-500">with {workshop.instructor}</p>
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-dashed border-gray-200 p-5 text-sm sm:grid-cols-3">
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-xs text-gray-500">When</dt>
            <dd className="mt-1 text-gray-900">{workshopDate}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Starts</dt>
            <dd className="mt-1 text-gray-900">{workshop.time}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">Paid</dt>
            <dd className="mt-1 font-mono text-gray-900 tabular">${booking.amount}</dd>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <dt className="text-xs text-gray-500">Booking ID</dt>
            <dd className="mt-1 truncate font-mono text-xs text-gray-700">{booking.id}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs text-gray-500">Payment ID</dt>
            <dd className="mt-1 truncate font-mono text-xs text-gray-700">{booking.paymentId}</dd>
          </div>
        </dl>

        <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/60 p-4 sm:flex-row">
          <Link to={`/workshop/${workshop.id}`} className={`${btn.primary} group flex-1`}>
            Go to workshop
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button onClick={() => user && downloadReceipt(booking, workshop, user)} className={`${btn.secondary} flex-1`}>
            <Download className="size-4" />
            Receipt (PDF)
          </button>
        </div>
      </motion.section>

      <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <Link to="/bookings" className="text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-gray-900">
          View all my bookings
        </Link>
        <Link to="/" className="text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-gray-900">
          Keep browsing
        </Link>
      </div>
    </main>
  );
};
