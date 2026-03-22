import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useWorkshops } from '../contexts/WorkshopContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { CheckCircle2, Download, Calendar, ArrowRight, Sparkles, Clock, DollarSign, Hash } from 'lucide-react';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import canvasConfetti from 'canvas-confetti';

export const PaymentSuccess = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { bookings, getWorkshopById } = useWorkshops();
  const { user } = useAuth();
  const confettiFired = useRef(false);

  const booking = bookings.find(b => b.id === bookingId);
  const workshop = booking ? getWorkshopById(booking.workshopId) : null;

  useEffect(() => {
    if (booking && !confettiFired.current) {
      confettiFired.current = true;
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        canvasConfetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f59e0b'],
        });
        canvasConfetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f59e0b'],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [booking]);

  const downloadReceipt = () => {
    if (!booking || !workshop || !user) return;

    const doc = new jsPDF();

    // Gradient header simulation
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, 210, 50, 'F');
    doc.setFillColor(124, 58, 237);
    doc.rect(105, 0, 105, 50, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(26);
    doc.text('WorkshopHub', 20, 22);
    doc.setFontSize(12);
    doc.text('Payment Receipt', 20, 36);

    // Divider
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 60, 190, 60);

    // Booking Details
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.text('BOOKING INFORMATION', 20, 73);

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(11);
    doc.text(`Booking ID: ${booking.id}`, 20, 84);
    doc.text(`Payment ID: ${booking.paymentId}`, 20, 94);
    doc.text(`Booking Date: ${new Date(booking.bookingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 104);

    doc.line(20, 114, 190, 114);

    // Customer Details
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.text('CUSTOMER INFORMATION', 20, 126);

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(11);
    doc.text(`Name: ${user.name}`, 20, 137);
    doc.text(`Email: ${user.email}`, 20, 147);

    doc.line(20, 157, 190, 157);

    // Workshop Details
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.text('WORKSHOP DETAILS', 20, 169);

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(11);
    doc.text(`Title: ${workshop.title}`, 20, 180);
    doc.text(`Instructor: ${workshop.instructor}`, 20, 190);
    doc.text(`Category: ${workshop.category}`, 20, 200);
    doc.text(`Date: ${new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, 20, 210);
    doc.text(`Time: ${workshop.time}`, 20, 220);
    doc.text(`Duration: ${workshop.duration}`, 20, 230);

    doc.line(20, 240, 190, 240);

    // Payment Summary
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

    // Footer
    doc.setFillColor(249, 250, 251);
    doc.rect(0, 283, 210, 14, 'F');
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    doc.text('Thank you for choosing WorkshopHub! • workshophub.com', 20, 291);
    doc.text('This is a computer-generated receipt.', 150, 291);

    doc.save(`receipt-${booking.id}.pdf`);
  };

  if (!booking || !workshop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Booking not found</h2>
          <Button onClick={() => navigate('/')}>Back to Workshops</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Success card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white rounded-3xl shadow-2xl shadow-indigo-200/40 border border-white overflow-hidden"
        >
          {/* Top banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [-20, -60] }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 1.5 }}
                  className="absolute"
                  style={{ left: `${15 + i * 14}%`, bottom: '20%' }}
                >
                  <Sparkles className="size-5 text-white/40" />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
              className="relative inline-flex items-center justify-center size-20 bg-white/20 rounded-full mb-4"
            >
              <CheckCircle2 className="size-12 text-white" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h1 className="text-3xl text-white mb-1">Payment Successful!</h1>
              <p className="text-indigo-200">Your workshop registration is confirmed 🎉</p>
            </motion.div>
          </div>

          {/* Workshop info */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg text-gray-900 mb-1">{workshop.title}</h2>
            <p className="text-sm text-gray-500">by {workshop.instructor}</p>
          </div>

          {/* Booking details grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="p-6"
          >
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: Hash, label: 'Booking ID', value: booking.id, mono: true },
                { icon: Hash, label: 'Payment ID', value: booking.paymentId, mono: true },
                {
                  icon: Calendar, label: 'Workshop Date',
                  value: new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' })
                },
                { icon: Clock, label: 'Time', value: workshop.time },
                {
                  icon: DollarSign, label: 'Amount Paid',
                  value: `$${booking.amount}`, highlight: true
                },
                {
                  icon: CheckCircle2, label: 'Status',
                  value: booking.status.toUpperCase(), success: true
                },
              ].map(({ icon: Icon, label, value, mono, highlight, success }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                    <Icon className="size-3.5" />
                    <p className="text-xs">{label}</p>
                  </div>
                  <p className={`text-sm font-medium truncate ${
                    highlight ? 'text-indigo-600' :
                    success ? 'text-green-600' :
                    mono ? 'font-mono text-xs text-gray-600' :
                    'text-gray-800'
                  }`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadReceipt}
                className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors text-sm font-medium"
              >
                <Download className="size-4" />
                Download Receipt
              </button>
              <button
                onClick={() => navigate('/bookings')}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all text-sm font-medium shadow-md shadow-indigo-200/50"
              >
                <Calendar className="size-4" />
                My Bookings
              </button>
            </div>

            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-1.5 mt-3 text-sm text-gray-400 hover:text-indigo-600 transition-colors py-1.5"
            >
              Browse more workshops
              <ArrowRight className="size-3.5" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
