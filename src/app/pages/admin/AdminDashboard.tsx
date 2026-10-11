import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { api } from '../../api/client.ts';
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, Activity } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalAdmins: number;
  totalStudents: number;
  totalWorkshops: number;
  totalBookings: number;
  totalRevenue: number;
}

export const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.get('/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = stats ? [
    { 
      title: 'Total Students', 
      value: stats.totalStudents, 
      icon: Users, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-900'
    },
    { 
      title: 'Total Workshops', 
      value: stats.totalWorkshops, 
      icon: GraduationCap, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-900'
    },
    { 
      title: 'Total Bookings', 
      value: stats.totalBookings, 
      icon: BookOpen, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-900'
    },
    { 
      title: 'Total Revenue', 
      value: `$${stats.totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-900'
    },
  ] : [];

  const quickLinks = [
    { title: 'Manage Workshops', path: '/admin/workshops', icon: GraduationCap, color: 'purple' },
    { title: 'Manage Users', path: '/admin/users', icon: Users, color: 'blue' },
    { title: 'View Registrations', path: '/admin/registrations', icon: BookOpen, color: 'green' },
  ];

  return (
    <div className="min-h-[100dvh] bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gray-900 p-3 rounded-xl">
              <Activity className="size-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl tracking-[-0.03em] text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Bookings, revenue and activity across every workshop.</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 ring-1 ring-gray-900/[0.06] animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4" />
                <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 ring-1 ring-gray-900/[0.06] hover:shadow-xl transition-all group"
              >
                <div className={`${stat.bgColor} p-3 rounded-xl inline-flex mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`size-6 ${stat.textColor}`} />
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-3xl font-mono tabular text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-8 ring-1 ring-gray-900/[0.06]"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="size-5 text-purple-600" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Link
                  to={link.path}
                  className="group flex h-full flex-col rounded-xl bg-gray-50 p-6 ring-1 ring-gray-900/[0.06] transition-all hover:bg-white hover:shadow-[0_18px_40px_-18px_oklch(0.3_0.05_40/0.35)]"
                >
                  <span className="mb-6 flex size-10 items-center justify-center rounded-lg bg-gray-900 text-white transition-colors group-hover:bg-indigo-700"><link.icon className="size-5" strokeWidth={1.75} /></span>
                  <h3 className="font-semibold text-gray-900">{link.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">Open <span className="transition-transform group-hover:translate-x-0.5">→</span></p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white rounded-2xl p-8 ring-1 ring-gray-900/[0.06]"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
              <div className="size-2 bg-green-500 rounded-full animate-pulse" />
              <div>
                <p className="text-sm font-medium text-gray-900">Database</p>
                <p className="text-xs text-gray-600">Connected and operational</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
              <div className="size-2 bg-blue-500 rounded-full animate-pulse" />
              <div>
                <p className="text-sm font-medium text-gray-900">API Server</p>
                <p className="text-xs text-gray-600">All endpoints responding</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};