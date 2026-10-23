import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useWorkshops, type LearningContent } from '../contexts/WorkshopContext';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/client';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, FileText, Link2, Lock, PlayCircle, ListChecks } from 'lucide-react';
import { WorkshopCover } from '../components/WorkshopCover';
import { seatStatus } from '../components/WorkshopCard';
import { PageLoader, PageMessage, btn } from '../components/PageState';
import { motion } from 'motion/react';
import { toast } from 'sonner';

const ease = [0.22, 1, 0.36, 1] as const;

type Tab = 'overview' | 'materials' | 'attendees';

interface MaterialRowProps {
  icon: typeof FileText;
  title: string;
  meta?: string;
  action: string;
  unlocked: boolean;
  onOpen: () => void;
}

const MaterialRow = ({ icon: Icon, title, meta, action, unlocked, onOpen }: MaterialRowProps) => (
  <li>
    <button
      type="button"
      onClick={onOpen}
      disabled={!unlocked}
      className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors enabled:hover:bg-gray-50 disabled:cursor-default"
    >
      <Icon className={`size-4 shrink-0 ${unlocked ? 'text-gray-500' : 'text-gray-300'}`} strokeWidth={1.75} />
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-sm ${unlocked ? 'text-gray-900' : 'text-gray-400'}`}>{title}</span>
        {meta && <span className="font-mono text-xs text-gray-400 tabular">{meta}</span>}
      </span>
      {unlocked ? (
        <span className="flex items-center gap-1 text-xs text-gray-500 group-hover:text-indigo-700">
          {action}
          <ArrowUpRight className="size-3.5" />
        </span>
      ) : (
        <Lock className="size-3.5 text-gray-300" />
      )}
    </button>
  </li>
);

export const WorkshopDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkshopById, loading: workshopsLoading } = useWorkshops();
  const { isAuthenticated, user } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [registeredUsers, setRegisteredUsers] = useState<{ id: string; name: string }[]>([]);
  // Material links only come from the server once this user has paid (or is an admin).
  const [unlockedContent, setUnlockedContent] = useState<LearningContent | null>(null);
  const workshop = getWorkshopById(id!);

  useEffect(() => {
    if (!id) return;
    api.get(`/workshops/${id}/attendees`)
      .then(setRegisteredUsers)
      .catch((error) => console.error('Error fetching attendees:', error));
  }, [id]);

  useEffect(() => {
    setUnlockedContent(null);
    if (!id || !isAuthenticated) return;
    // A 403 just means no paid booking yet, so the materials stay locked.
    api.get(`/workshops/${id}/content`)
      .then(setUnlockedContent)
      .catch(() => {});
  }, [id, isAuthenticated, user?.id]);

  if (workshopsLoading) return <PageLoader />;

  if (!workshop) {
    return (
      <PageMessage
        eyebrow="Workshop not found"
        title="That session isn't in the catalog."
        body="It may have been removed or the link is wrong. Everything currently running is on the workshops page."
        actions={
          <Link to="/" className={btn.primary}>
            Browse workshops
          </Link>
        }
      />
    );
  }

  const isUserRegistered = isAuthenticated && registeredUsers.some(u => u.id === user?.id);
  const soldOut = workshop.availableSeats === 0;
  const seatsBooked = workshop.totalSeats - workshop.availableSeats;
  const filled = workshop.totalSeats > 0 ? seatsBooked / workshop.totalSeats : 1;
  const status = seatStatus(workshop.availableSeats, workshop.totalSeats);
  const materialsUnlocked = unlockedContent !== null;
  const content = unlockedContent ?? workshop.learningContent;
  const materialCount = (content?.pdfs?.length ?? 0) + (content?.videos?.length ?? 0) + (content?.mcqs?.length ?? 0);

  const handleRegister = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/payment/${workshop.id}`);
  };

  const openExternalLink = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied');
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'materials', label: 'Materials', count: materialCount },
    { id: 'attendees', label: 'Attendees', count: registeredUsers.length },
  ];

  return (
    <main className="pb-24">
      {/* Hero */}
      <div className="px-3 pt-2 sm:px-4">
        <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-3xl">
          <WorkshopCover category={workshop.category} image={workshop.image} title={workshop.title} className="h-[22rem] md:h-[26rem]" />
          <div className="absolute inset-0 z-[2] bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-gray-950/10" />

          <div className="absolute inset-x-0 top-0 z-[3] flex items-center justify-between p-5 sm:p-6">
            <Link
              to="/"
              className="press flex items-center gap-2 rounded-lg bg-white/10 px-3.5 py-2 text-sm text-white ring-1 ring-white/20 backdrop-blur-md hover:bg-white/20"
            >
              <ArrowLeft className="size-4" />
              All workshops
            </Link>
            <span className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white ring-1 ring-white/20 backdrop-blur-md">
              {workshop.category}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-[3] p-6 sm:p-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mx-auto max-w-6xl"
            >
              <p className="eyebrow mb-3 text-indigo-200">
                {new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <h1 className="max-w-[22ch] text-3xl leading-[1.05] tracking-[-0.03em] text-white md:text-5xl">{workshop.title}</h1>
              <p className="mt-3 text-sm text-white/70">
                Taught by <span className="text-white">{workshop.instructor}</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_20rem] lg:px-8">
        {/* Main column */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease }} className="min-w-0">
          {/* Quick facts */}
          <dl className="grid grid-cols-2 gap-y-5 border-b border-gray-200 pb-6 sm:grid-cols-4">
            {[
              { label: 'Date', value: new Date(workshop.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
              { label: 'Starts', value: workshop.time },
              { label: 'Duration', value: workshop.duration },
              { label: 'Format', value: 'Live online' },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs text-gray-500">{label}</dt>
                <dd className="mt-1 text-sm text-gray-900">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Tabs */}
          <div role="tablist" aria-label="Workshop sections" className="mt-8 flex w-fit gap-1 rounded-xl bg-gray-100 p-1">
            {tabs.map(({ id: tabId, label, count }) => {
              const active = tab === tabId;
              return (
                <button
                  key={tabId}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(tabId)}
                  className={`relative isolate flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm transition-colors ${
                    active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="detail-tab"
                      className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm ring-1 ring-gray-900/[0.06]"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  {label}
                  {count !== undefined && <span className="font-mono text-xs text-gray-400 tabular">{count}</span>}
                </button>
              );
            })}
          </div>

          <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="mt-6" role="tabpanel">
            {tab === 'overview' && (
              <div className="space-y-10">
                <section>
                  <h2 className="text-lg text-gray-900">About this workshop</h2>
                  <p className="mt-3 max-w-[65ch] leading-relaxed text-gray-600">{workshop.description}</p>
                </section>
                {workshop.skills.length > 0 && (
                  <section>
                    <h2 className="text-lg text-gray-900">What you'll practise</h2>
                    <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                      {workshop.skills.map(skill => (
                        <li key={skill} className="flex items-start gap-3 text-sm text-gray-700">
                          <Check className="mt-0.5 size-4 shrink-0 text-indigo-600" strokeWidth={2} />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            )}

            {tab === 'materials' && (
              <div className="rounded-2xl bg-white p-2 ring-1 ring-gray-900/[0.06]">
                {!materialsUnlocked && (
                  <div className="m-1 mb-2 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-600">
                    <Lock className="size-4 shrink-0 text-gray-400" />
                    Readings, videos and quizzes unlock once you've paid for a seat.
                  </div>
                )}
                {[
                  {
                    heading: 'Reading',
                    rows: (content?.pdfs ?? []).map(pdf => ({ icon: FileText, title: pdf.title, action: 'Open', onOpen: () => openExternalLink(pdf.url) })),
                  },
                  {
                    heading: 'Video',
                    rows: (content?.videos ?? []).map(video => ({
                      icon: PlayCircle,
                      title: video.title,
                      meta: video.duration,
                      action: 'Watch',
                      onOpen: () => openExternalLink(video.url),
                    })),
                  },
                  {
                    heading: 'Quizzes',
                    rows: (content?.mcqs ?? []).map((mcq, i) => ({
                      icon: ListChecks,
                      title: mcq.title,
                      meta: `${mcq.questions} questions`,
                      action: 'Start',
                      onOpen: () => navigate(`/workshop/${workshop.id}/quiz/${i}`),
                    })),
                  },
                ]
                  .filter(group => group.rows.length > 0)
                  .map(group => (
                    <section key={group.heading} className="border-t border-gray-100 px-1 pt-3 first:border-t-0 first:pt-1 [&+section]:mt-2">
                      <h3 className="px-3 pb-1 text-xs text-gray-500">{group.heading}</h3>
                      <ul>
                        {group.rows.map(row => (
                          <MaterialRow key={row.title} {...row} unlocked={materialsUnlocked} />
                        ))}
                      </ul>
                    </section>
                  ))}
                {materialCount === 0 && <p className="px-4 py-8 text-sm text-gray-500">The instructor hasn't posted materials yet.</p>}
              </div>
            )}

            {tab === 'attendees' &&
              (registeredUsers.length > 0 ? (
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {registeredUsers.map((u, i) => (
                    <li key={`${u.id}-${i}`} className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-gray-900/[0.06]">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-100 text-xs font-semibold text-indigo-800">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                      <span className="truncate text-sm text-gray-900">{u.name}</span>
                      {u.id === user?.id && <span className="ml-auto rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">You</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center">
                  <p className="text-gray-900">No one has booked yet.</p>
                  <p className="mt-1 text-sm text-gray-500">The first seat is still open.</p>
                </div>
              ))}
          </motion.div>
        </motion.div>

        {/* Booking sidebar */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="space-y-4 lg:sticky lg:top-20 lg:self-start"
        >
          <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-900/[0.06] shadow-[0_12px_32px_-16px_oklch(0.3_0.02_286/0.18)]">
            <p className="text-xs text-gray-500">Price per seat</p>
            <p className="mt-1 font-mono text-3xl text-gray-900 tabular">${workshop.price}</p>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-gray-700">
                  <span className={`size-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
                <span className="font-mono text-gray-400 tabular">
                  {workshop.availableSeats}/{workshop.totalSeats} left
                </span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-gray-100">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: filled }}
                  transition={{ duration: 0.9, ease, delay: 0.3 }}
                  className={`h-full origin-left rounded-full ${status.bar}`}
                />
              </div>
            </div>

            {isUserRegistered ? (
              <div className="mt-5 flex items-center gap-2 rounded-lg bg-indigo-50 px-4 py-3 text-sm text-indigo-800">
                <Check className="size-4" strokeWidth={2} />
                You're booked. See you there.
              </div>
            ) : (
              <button onClick={handleRegister} disabled={soldOut} className={`${btn.primary} group mt-5 w-full justify-between py-3`}>
                {soldOut ? 'Sold out' : isAuthenticated ? 'Book a seat' : 'Sign in to book'}
                {!soldOut && <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />}
              </button>
            )}
            {isUserRegistered && (
              <button onClick={() => setTab('materials')} className={`${btn.secondary} mt-2 w-full`}>
                Open materials
              </button>
            )}

            <p className="mt-4 text-xs text-gray-500">
              {seatsBooked} {seatsBooked === 1 ? 'person has' : 'people have'} booked. Cancel any time from My bookings.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-gray-900/[0.06]">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-sm font-semibold text-white">
              {workshop.instructor
                .split(' ')
                .map(part => part[0])
                .slice(0, 2)
                .join('')}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm text-gray-900">{workshop.instructor}</p>
              <p className="text-xs text-gray-500">Instructor, {workshop.category}</p>
            </div>
          </div>

          <button onClick={copyLink} className={`${btn.ghost} w-full`}>
            <Link2 className="size-4" />
            Copy link to this workshop
          </button>
        </motion.aside>
      </div>
    </main>
  );
};
