import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useWorkshops } from '../contexts/WorkshopContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { ShieldCheck, User, BookOpen, DollarSign, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminDashboard = () => {
  const { bookings, workshops } = useWorkshops();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !isAdmin) {
    navigate('/login', { replace: true });
    return null;
  }

  const users = useMemo(() => {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
  }, []);

  const enrichedBookings = useMemo(() => {
    return bookings
      .map(booking => {
        const workshop = workshops.find(w => w.id === booking.workshopId);
        const bookingUser = users.find((u: any) => u.id === booking.userId) || {
          name: 'Unknown',
          email: 'unknown@example.com',
        };
        return {
          ...booking,
          workshopTitle: workshop?.title || 'Unknown workshop',
          workshopCategory: workshop?.category || 'Unknown',
          userName: bookingUser.name,
          userEmail: bookingUser.email,
        };
      })
      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
  }, [bookings, workshops, users]);

  const totalRevenue = useMemo(
    () => enrichedBookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.amount, 0),
    [enrichedBookings]
  );

  const participantsByCategory = useMemo(() => {
    const grouped: Record<string, Set<string>> = {};
    enrichedBookings.forEach(booking => {
      if (booking.status !== 'confirmed') return;
      const category = booking.workshopCategory || 'Unknown';
      grouped[category] = grouped[category] || new Set();
      grouped[category].add(booking.userName);
    });
    return Object.entries(grouped).map(([category, names]) => ({
      category,
      names: Array.from(names),
    }));
  }, [enrichedBookings]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">User enrolments and workshop bookings overview</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-indigo-50 text-indigo-700 px-4 py-2 text-sm font-medium">
              Total Bookings: {enrichedBookings.length}
            </div>
            <div className="rounded-xl bg-green-50 text-green-700 px-4 py-2 text-sm font-medium">
              Revenue: ${totalRevenue.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Participants by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {participantsByCategory.length > 0 ? (
              participantsByCategory.map(group => (
                <div key={group.category} className="border border-gray-100 p-3 rounded-xl bg-gray-50">
                  <p className="text-xs uppercase tracking-wider text-gray-500">{group.category}</p>
                  <p className="font-semibold text-gray-800 text-sm mt-1 mb-2">{group.names.length} participants</p>
                  <ul className="text-xs text-gray-600 leading-tight space-y-0.5">
                    {group.names.slice(0, 4).map(name => (
                      <li key={name}>• {name}</li>
                    ))}
                    {group.names.length > 4 && <li>+{group.names.length - 4} more</li>}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No confirmed participants yet.</p>
            )}
          </div>
        </div>

        <div className="overflow-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">User</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Workshop</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Booked On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enrichedBookings.map(booking => (
                <tr key={booking.id}>
                  <td className="px-4 py-3 text-gray-700">{booking.userName}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{booking.userEmail}</td>
                  <td className="px-4 py-3 text-indigo-700 font-medium">{booking.workshopTitle}</td>
                  <td className="px-4 py-3 text-gray-600">{booking.workshopCategory}</td>
                  <td className={`px-4 py-3 text-sm font-semibold ${booking.status === 'confirmed' ? 'text-green-700' : 'text-red-600'}`}>
                    {booking.status}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-700">${booking.amount.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(booking.bookingDate).toLocaleString()}</td>
                </tr>
              ))}
              {enrichedBookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No bookings yet. Admins can review once users purchase courses.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <Button onClick={() => navigate('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
