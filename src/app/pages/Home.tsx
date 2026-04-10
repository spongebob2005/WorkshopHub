import { useState, useMemo, useEffect } from 'react';
import { useWorkshops } from '../contexts/WorkshopContext';
import { WorkshopCard } from '../components/WorkshopCard';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Search, Filter, BookOpen, Users, Zap, Star, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const CATEGORY_COLORS: Record<string, string> = {
  'Web Development': 'bg-blue-100 text-blue-700 border-blue-200',
  'Design': 'bg-pink-100 text-pink-700 border-pink-200',
  'Data Science': 'bg-purple-100 text-purple-700 border-purple-200',
  'Marketing': 'bg-orange-100 text-orange-700 border-orange-200',
  'Cloud Computing': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Mobile Development': 'bg-green-100 text-green-700 border-green-200',
  'Security': 'bg-red-100 text-red-700 border-red-200',
  'Blockchain': 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export const Home = () => {
  const { workshops, loading } = useWorkshops();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const categories = useMemo(() => {
    const cats = workshops.map(w => w.category);
    return ['all', ...Array.from(new Set(cats))];
  }, [workshops]);

  const filteredWorkshops = useMemo(() => {
    return workshops.filter(workshop => {
      const matchesSearch =
        workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workshop.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || workshop.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [workshops, searchTerm, categoryFilter]);

  const stats = useMemo(() => ({
    total: workshops.length,
    categories: new Set(workshops.map(w => w.category)).size,
    available: workshops.filter(w => w.availableSeats > 0).length,
  }), [workshops]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-10 right-10 w-80 h-80 bg-purple-400 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
            className="absolute -bottom-20 left-1/2 w-96 h-72 bg-blue-400 rounded-full blur-3xl"
          />
          {/* Grid dots */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: heroVisible ? 1 : 0, y: heroVisible ? 0 : 40 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Badge */}
            <div className="flex items-center gap-2 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-1.5 rounded-full text-sm"
              >
                <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                Learn from industry experts
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-6xl text-white mb-5 leading-tight tracking-tight">
              Level Up Your Skills{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                  Masterclass
                </span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full origin-left"
                />
              </span>
            </h1>
            <p className="text-lg text-indigo-200 max-w-2xl mb-10 leading-relaxed">
              Join expert-led workshops designed to accelerate your career. Interactive sessions,
              real-world projects, and a vibrant learning community.
            </p>

            {/* CTA Buttons */}
            {!isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-4 mb-12"
              >
                <button
                  onClick={() => navigate('/register')}
                  className="px-7 py-3 bg-white text-indigo-700 rounded-xl font-medium hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-7 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-xl font-medium hover:bg-white/20 transition-all"
                >
                  Sign In
                </button>
              </motion.div>
            )}

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6"
            >
              {[
                { icon: BookOpen, value: stats.total, label: 'Workshops' },
                { icon: TrendingUp, value: stats.categories, label: 'Categories' },
                { icon: Users, value: stats.available, label: 'Open Now' },
                { icon: Zap, value: '100%', label: 'Online' },
              ].map(({ icon: Icon, value, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-3"
                >
                  <div className="bg-white/20 rounded-xl p-2">
                    <Icon className="size-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg leading-none">{value}</div>
                    <div className="text-indigo-200 text-xs mt-0.5">{label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 50C120 40 240 20 360 15C480 10 600 20 720 25C840 30 960 30 1080 25C1200 20 1320 10 1380 5L1440 0V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 size-4.5" />
                <Input
                  placeholder="Search workshops, instructors..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white rounded-xl h-11 transition-all"
                />
              </div>
              <div className="sm:w-56">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl h-11">
                    <div className="flex items-center gap-2">
                      <Filter className="size-4 text-gray-400" />
                      <SelectValue placeholder="All Categories" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 mt-3">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    categoryFilter === category
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200'
                      : category === 'all'
                      ? 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                      : `${CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-600 border-gray-200'} hover:opacity-80`
                  }`}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <motion.p
            key={filteredWorkshops.length}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-500 text-sm"
          >
            Showing{' '}
            <span className="font-semibold text-gray-800">{filteredWorkshops.length}</span>{' '}
            workshop{filteredWorkshops.length !== 1 ? 's' : ''}
            {categoryFilter !== 'all' && (
              <> in <span className="font-semibold text-indigo-600">{categoryFilter}</span></>
            )}
          </motion.p>
          {(searchTerm || categoryFilter !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Workshop Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center py-20"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </motion.div>
          ) : filteredWorkshops.length > 0 ? (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center size-20 bg-indigo-50 rounded-full mb-4">
                <Search className="size-8 text-indigo-300" />
              </div>
              <h3 className="text-xl text-gray-700 mb-2">No workshops found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => { setSearchTerm(''); setCategoryFilter('all'); }}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium"
              >
                Browse all workshops
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};