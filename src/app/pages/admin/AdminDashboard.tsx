import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { api } from '../../api/client.ts';
import { useWorkshops } from '../../contexts/WorkshopContext';
import { AdminPage, StatRow } from '../../components/AdminUI';
import { WorkshopCover } from '../../components/WorkshopCover';

const ease = [0.22, 1, 0.36, 1] as const;

interface Stats {
  totalUsers: number;
  totalAdmins: number;
  totalStudents: number;
  totalWorkshops: number;
  totalBookings: number;
  totalRevenue: number;
}

const relativeTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const { workshops, bookings, loading: catalogLoading } = useWorkshops();

  useEffect(() => {
    api
      .get('/admin/stats')
      .then(setStats)
      .catch(error => console.error('Error fetching stats:', error))
      .finally(() => setLoading(false));
  }, []);

  const fillRates = useMemo(
    () =>
      workshops
        .map(w => ({ ...w, booked: w.totalSeats - w.availableSeats, rate: w.totalSeats > 0 ? (w.totalSeats - w.availableSeats) / w.totalSeats : 0 }))
        .sort((a, b) => b.rate - a.rate),
    [workshops],
  );

  const recent = useMemo(
    () =>
      [...bookings]
        .filter(b => b.bookingDate)
        .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
        .slice(0, 6),
    [bookings],
  );

  const totalSeats = workshops.reduce((sum, w) => sum + w.totalSeats, 0);
  const bookedSeats = workshops.reduce((sum, w) => sum + (w.totalSeats - w.availableSeats), 0);

  return (
    <AdminPage title="Overview" description="Bookings, revenue and seat fill across every workshop.">
      <StatRow
        loading={loading}
        items={[
          { label: 'Students', value: stats?.totalStudents ?? 0 },
          { label: 'Workshops', value: stats?.totalWorkshops ?? 0 },
          { label: 'Bookings', value: stats?.totalBookings ?? 0 },
          { label: 'Revenue', value: `$${(stats?.totalRevenue ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}` },
        ]}
      />

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Seat fill */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease }}
          aria-labelledby="fill-heading"
        >
          <div className="flex items-baseline justify-between">
            <h2 id="fill-heading" className="text-lg text-gray-900">Seat fill</h2>
            <p className="font-mono text-xs text-gray-500 tabular">
              {bookedSeats}/{totalSeats} seats booked
            </p>
          </div>
          <ul className="mt-4 rounded-2xl bg-white p-2 ring-1 ring-gray-900/[0.06]">
            {catalogLoading &&
              Array.from({ length: 5 }, (_, i) => (
                <li key={i} className="flex items-center gap-3 p-2.5">
                  <div className="size-10 animate-pulse rounded-lg bg-gray-100" />
                  <div className="h-3 flex-1 animate-pulse rounded bg-gray-100" />
                </li>
              ))}
            {fillRates.map((w, i) => (
              <li key={w.id}>
                <Link to={`/workshop/${w.id}`} className="group flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-gray-50">
                  <WorkshopCover category={w.category} image={w.image} title={w.title} className="size-10 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="truncate text-sm text-gray-900">{w.title}</p>
                      <p className="shrink-0 font-mono text-xs text-gray-500 tabular">
                        {w.booked}/{w.totalSeats}
                      </p>
                    </div>
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-100">
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: w.rate }}
                        transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.03 }}
                        className={`h-full origin-left rounded-full ${w.rate >= 0.8 ? 'bg-indigo-600' : 'bg-gray-900'}`}
                      />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
            {!catalogLoading && fillRates.length === 0 && <li className="p-6 text-sm text-gray-500">No workshops yet.</li>}
          </ul>
        </motion.section>

        {/* Recent bookings */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18, ease }}
          aria-labelledby="recent-heading"
        >
          <div className="flex items-baseline justify-between">
            <h2 id="recent-heading" className="text-lg text-gray-900">Recent bookings</h2>
            <Link to="/admin/registrations" className="flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900">
              All
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
          <ol className="mt-4 rounded-2xl bg-white p-2 ring-1 ring-gray-900/[0.06]">
            {recent.map(b => {
              const workshop = workshops.find(w => w.id === b.workshopId);
              const cancelled = b.status === 'cancelled';
              return (
                <li key={b.id} className="flex items-start gap-3 rounded-xl p-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xs font-semibold text-indigo-800">
                    {(b.userName || '?').charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-gray-900">
                      {b.userName || 'Unknown student'}
                      <span className="text-gray-500"> {cancelled ? 'cancelled' : 'booked'}</span>
                    </p>
                    <p className="truncate text-xs text-gray-500">{workshop?.title ?? b.workshopTitle ?? 'Removed workshop'}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className={`font-mono text-xs tabular ${cancelled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>${b.amount}</p>
                    <p className="text-xs text-gray-400">{relativeTime(b.bookingDate)}</p>
                  </div>
                </li>
              );
            })}
            {!catalogLoading && recent.length === 0 && <li className="p-6 text-sm text-gray-500">No bookings yet.</li>}
          </ol>
        </motion.section>
      </div>
    </AdminPage>
  );
};
