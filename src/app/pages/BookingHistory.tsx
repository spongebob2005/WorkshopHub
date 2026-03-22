import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useWorkshops } from '../contexts/WorkshopContext';
import { useAuth } from '../contexts/AuthContext';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from '../components/ui/alert-dialog';
import {
  Calendar, Clock, DollarSign, X, Eye, Download, BookOpen,
  CheckCircle2, XCircle, Filter, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

type FilterTab = 'all' | 'confirmed' | 'cancelled';

export const BookingHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getBookingsByUser, getWorkshopById, cancelBooking } = useWorkshops();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const userBookings = user ? getBookingsByUser(user.id) : [];

  const filteredBookings = userBookings.filter(b => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  const stats = {
    total: userBookings.length,
    confirmed: userBookings.filter(b => b.status === 'confirmed').length,
    cancelled: userBookings.filter(b => b.status === 'cancelled').length,
    spent: userBookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.amount, 0),
  };

  const handleCancelBooking = (bookingId: string) => {
    cancelBooking(bookingId);
    toast.success('Booking cancelled. Your seat has been released.');
  };

  const downloadReceipt = (bookingId: string) => {
    const booking = userBookings.find(b => b.id === bookingId);
    const workshop = booking ? getWorkshopById(booking.workshopId) : null;
    if (!booking || !workshop || !user) return;

    const doc = new jsPDF();

    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 50, 'F');
    doc.setFillColor(124, 58, 237);
    doc.rect(105, 0, 105, 50, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.text('WorkshopHub', 20, 22);
    doc.setFontSize(12);
    doc.text('Payment Receipt', 20, 36);

    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);

    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.text('BOOKING INFORMATION', 20, 73);

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(11);
    doc.text(`Booking ID: ${booking.id}`, 20, 84);
    doc.text(`Payment ID: ${booking.paymentId}`, 20, 94);
    doc.text(`Booking Date: ${new Date(booking.bookingDate).toLocaleDateString()}`, 20, 104);

    doc.line(20, 114, 190, 114);

    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.text('CUSTOMER INFORMATION', 20, 126);

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(11);
    doc.text(`Name: ${user.name}`, 20, 137);
    doc.text(`Email: ${user.email}`, 20, 147);

    doc.line(20, 157, 190, 157);

    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.text('WORKSHOP DETAILS', 20, 169);

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(11);
    doc.text(`Title: ${workshop.title}`, 20, 180);
    doc.text(`Instructor: ${workshop.instructor}`, 20, 190);
    doc.text(`Date: ${new Date(workshop.date).toLocaleDateString()}`, 20, 200);
    doc.text(`Time: ${workshop.time}`, 20, 210);
    doc.text(`Duration: ${workshop.duration}`, 20, 220);

    doc.line(20, 240, 190, 240);

    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.text('PAYMENT SUMMARY', 20, 252);

    doc.setFillColor(238, 242, 255);
    doc.roundedRect(20, 258, 170, 22, 3, 3, 'F');
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(13);
    doc.text(`Amount Paid: $${booking.amount}`, 28, 272);
    doc.setTextColor(22, 163, 74);
    doc.text(`Status: ${booking.status.toUpperCase()}`, 130, 272);

    doc.setFillColor(249, 250, 251);
    doc.rect(0, 283, 210, 14, 'F');
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    doc.text('Thank you for choosing WorkshopHub!', 20, 291);

    doc.save(`receipt-${booking.id}.pdf`);
  };

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'all', label: 'All Bookings', count: stats.total },
    { id: 'confirmed', label: 'Confirmed', count: stats.confirmed },
    { id: 'cancelled', label: 'Cancelled', count: stats.cancelled },
  ];

  if (userBookings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-500 mb-10">Manage and track your workshop registrations</p>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center size-24 bg-indigo-50 rounded-full mb-6"
              >
                <BookOpen className="size-12 text-indigo-300" />
              </motion.div>
              <h2 className="text-xl text-gray-700 mb-2">No Bookings Yet</h2>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                You haven't registered for any workshops yet. Browse our expert-led sessions and get started!
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-200/50 font-medium"
              >
                Browse Workshops
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl text-gray-900 mb-1">My Bookings</h1>
          <p className="text-gray-500">Track and manage your workshop registrations</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Bookings', value: stats.total, icon: BookOpen, color: 'bg-indigo-50 text-indigo-600', iconBg: 'bg-indigo-100' },
            { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle2, color: 'bg-green-50 text-green-600', iconBg: 'bg-green-100' },
            { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'bg-red-50 text-red-500', iconBg: 'bg-red-100' },
            { label: 'Total Spent', value: `$${stats.spent.toFixed(2)}`, icon: TrendingUp, color: 'bg-purple-50 text-purple-600', iconBg: 'bg-purple-100' },
          ].map(({ label, value, icon: Icon, color, iconBg }) => (
            <div key={label} className={`${color.split(' ')[0]} rounded-2xl p-4 border border-white`}>
              <div className={`${iconBg} rounded-xl p-2 w-fit mb-3`}>
                <Icon className={`size-4 ${color.split(' ')[1]}`} />
              </div>
              <p className={`text-2xl font-semibold ${color.split(' ')[1]}`}>{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 bg-white rounded-2xl p-1.5 border border-gray-100 shadow-sm mb-6 w-fit"
        >
          {tabs.map(({ id, label, count }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? 'text-indigo-700 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
              <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium ${
                activeTab === id ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Booking Cards */}
        <AnimatePresence mode="popLayout">
          {filteredBookings.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 bg-white rounded-2xl border border-gray-100"
            >
              <Filter className="size-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">No {activeTab} bookings found</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking, index) => {
                const workshop = getWorkshopById(booking.workshopId);
                if (!workshop) return null;
                const isConfirmed = booking.status === 'confirmed';

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.06 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Card header with status indicator */}
                    <div className={`h-1 w-full ${isConfirmed ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-gray-200'}`} />

                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                              isConfirmed
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-gray-100 text-gray-500 border border-gray-200'
                            }`}>
                              {isConfirmed
                                ? <CheckCircle2 className="size-3" />
                                : <XCircle className="size-3" />
                              }
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            <span className="text-xs text-gray-400 font-mono">{booking.id}</span>
                          </div>
                          <h3 className="text-base font-semibold text-gray-900">{workshop.title}</h3>
                          <p className="text-sm text-gray-500 mt-0.5">by {workshop.instructor}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-400">Amount</p>
                          <p className={`text-xl font-bold ${isConfirmed ? 'text-indigo-600' : 'text-gray-400'}`}>
                            ${booking.amount}
                          </p>
                        </div>
                      </div>

                      {/* Info row */}
                      <div className="flex flex-wrap gap-4 py-3 border-y border-gray-50 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="size-3.5 text-indigo-400" />
                          {new Date(workshop.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="size-3.5 text-indigo-400" />
                          {workshop.time}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="size-3.5 text-indigo-400" />
                          Paid on {new Date(booking.bookingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => navigate(`/workshop/${workshop.id}`)}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="size-3.5" />
                          View Workshop
                        </button>

                        <button
                          onClick={() => downloadReceipt(booking.id)}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                          <Download className="size-3.5" />
                          Receipt
                        </button>

                        {isConfirmed && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors ml-auto">
                                <X className="size-3.5" />
                                Cancel Booking
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel your registration for{' '}
                                  <strong>{workshop.title}</strong>? This action cannot be undone and your seat will be released.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-xl">Keep Booking</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="bg-red-600 hover:bg-red-700 rounded-xl"
                                >
                                  Yes, Cancel
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
