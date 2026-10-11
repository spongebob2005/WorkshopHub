import { useState, useMemo } from 'react';
import { useWorkshops } from '../contexts/WorkshopContext';
import { WorkshopCard } from '../components/WorkshopCard';
import { WorkshopCover } from '../components/WorkshopCover';
import { Search, X, ArrowRight, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ease = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const CardSkeleton = () => (
  <div className="flex flex-col overflow-hidden rounded-2xl bg-white p-2 ring-1 ring-gray-900/[0.06]">
    <div className="aspect-[16/9] animate-pulse rounded-xl bg-gray-100" />
    <div className="space-y-3 p-3 pt-5">
      <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
      <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
      <div className="mt-6 h-10 w-full animate-pulse rounded-lg bg-gray-100" />
    </div>
  </div>
);

export const Home = () => {
  const { workshops, loading } = useWorkshops();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => {
    const cats = workshops.map(w => w.category);
    return ['all', ...Array.from(new Set(cats))];
  }, [workshops]);

  const filteredWorkshops = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return workshops.filter(workshop => {
      const matchesSearch =
        workshop.title.toLowerCase().includes(term) ||
        workshop.instructor.toLowerCase().includes(term) ||
        workshop.description.toLowerCase().includes(term);
      const matchesCategory = categoryFilter === 'all' || workshop.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [workshops, searchTerm, categoryFilter]);

  const stats = useMemo(
    () => ({
      total: workshops.length,
      categories: new Set(workshops.map(w => w.category)).size,
      open: workshops.filter(w => w.availableSeats > 0).length,
      seats: workshops.reduce((sum, w) => sum + w.availableSeats, 0),
    }),
    [workshops],
  );

  const upcoming = useMemo(
    () =>
      [...workshops]
        .filter(w => w.availableSeats > 0)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3),
    [workshops],
  );

  const hasFilters = searchTerm !== '' || categoryFilter !== 'all';
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
  };

  return (
    <main className="bg-gray-50 pt-2">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-12 sm:px-6 md:pt-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
            <p className="mb-5 text-sm font-medium text-indigo-700">
              {isAuthenticated ? `Welcome back, ${user?.name?.split(' ')[0]}` : 'Small groups, live instructors'}
            </p>
            <h1 className="max-w-[16ch] text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-gray-900 sm:text-5xl lg:text-6xl">
              Learn the craft from people who <span className="text-indigo-700">do it daily.</span>
            </h1>
            <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-gray-500 sm:text-lg">
              Hands-on workshops in development, design, data and cloud. Book a seat, take the pre-quiz, show up ready.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {isAuthenticated ? (
                <a
                  href="#catalog"
                  className="press group flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Browse workshops
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/register')}
                    className="press group flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Create free account
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <Link to="/login" className="rounded-lg px-4 py-3 text-sm text-gray-600 transition-colors hover:text-gray-900">
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Next up */}
          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="min-w-0 self-end rounded-2xl bg-white p-2 ring-1 ring-gray-900/[0.06] shadow-[0_12px_32px_-16px_oklch(0.3_0.02_286/0.18)]"
            aria-label="Next workshops with open seats"
          >
            <div className="flex items-center justify-between px-3 pb-2 pt-2">
              <p className="text-sm font-medium text-gray-900">Next up</p>
              <p className="font-mono text-xs text-gray-500 tabular">{stats.seats} seats open</p>
            </div>
            <ul className="space-y-1">
              {loading &&
                Array.from({ length: 3 }, (_, i) => (
                  <li key={i} className="flex items-center gap-3 rounded-xl p-2">
                    <div className="size-14 animate-pulse rounded-lg bg-gray-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                      <div className="h-2.5 w-1/3 animate-pulse rounded bg-gray-100" />
                    </div>
                  </li>
                ))}
              {upcoming.map(w => (
                <li key={w.id}>
                  <Link
                    to={`/workshop/${w.id}`}
                    className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50"
                  >
                    <WorkshopCover category={w.category} image={w.image} title={w.title} className="size-14 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-gray-900">{w.title}</p>
                      <p className="mt-0.5 font-mono text-xs text-gray-500 tabular">
                        {new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${w.price}
                      </p>
                    </div>
                    <ArrowUpRight className="size-4 text-gray-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gray-900" />
                  </Link>
                </li>
              ))}
              {!loading && upcoming.length === 0 && (
                <li className="px-3 py-6 text-sm text-gray-500">New sessions are being scheduled.</li>
              )}
            </ul>
          </motion.aside>
        </div>

        {/* Stats */}
        <dl className="mt-14 grid grid-cols-2 gap-y-6 border-t border-gray-200 pt-6 sm:grid-cols-4">
          {[
            { value: stats.total, label: 'Workshops' },
            { value: stats.categories, label: 'Disciplines' },
            { value: stats.open, label: 'Open for booking' },
            { value: stats.seats, label: 'Seats available' },
          ].map(({ value, label }) => (
            <div key={label}>
              <dt className="text-xs text-gray-500">{label}</dt>
              <dd className="mt-1 font-mono text-2xl text-gray-900 tabular">
                {loading ? <span className="inline-block h-6 w-10 animate-pulse rounded bg-gray-100 align-middle" /> : value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Catalog */}
      <section id="catalog" className="mx-auto max-w-7xl scroll-mt-20 px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl tracking-[-0.03em] text-gray-900 sm:text-4xl">The catalog</h2>
            <p className="mt-2 max-w-[60ch] text-gray-500">
              Every session is capped so instructors can actually review your work.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search by title, instructor, topic"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              aria-label="Search workshops"
              className="h-11 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 [&::-webkit-search-cancel-button]:hidden"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category filter */}
        <div className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-1 rounded-xl bg-gray-100 p-1 sm:w-auto sm:flex-wrap">
            {categories.map(category => {
              const active = categoryFilter === category;
              return (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  aria-pressed={active}
                  className={`relative isolate whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm transition-colors ${
                    active ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="cat-pill"
                      className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm ring-1 ring-gray-900/[0.06]"
                      transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  {category === 'all' ? 'All' : category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between text-sm">
          <p className="text-gray-500">
            <span className="font-mono text-gray-900 tabular">{filteredWorkshops.length}</span>{' '}
            {filteredWorkshops.length === 1 ? 'workshop' : 'workshops'}
            {categoryFilter !== 'all' && <> in {categoryFilter}</>}
          </p>
          {hasFilters && (
            <button onClick={clearFilters} className="text-gray-500 underline decoration-gray-300 underline-offset-4 hover:text-gray-900">
              Reset filters
            </button>
          )}
        </div>

        {loading ? (
            <div
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }, (_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : filteredWorkshops.length > 0 ? (
            <motion.div
              key={`grid-${categoryFilter}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredWorkshops.map(workshop => (
                <motion.div key={workshop.id} variants={cardVariants}>
                  <WorkshopCard workshop={workshop} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-dashed border-gray-300 px-6 py-20 text-center"
            >
              <p className="font-display text-3xl text-gray-900">Nothing matches that.</p>
              <p className="mx-auto mt-2 max-w-[44ch] text-gray-500">
                {searchTerm ? <>No workshop mentions “{searchTerm}”. </> : null}
                Try a broader term or look across every discipline.
              </p>
              <button
                onClick={clearFilters}
                className="press mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Show all workshops
              </button>
            </motion.div>
          )}
      </section>
    </main>
  );
};
