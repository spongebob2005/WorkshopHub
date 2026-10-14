import jsPDF from 'jspdf';
import type { Booking, Workshop } from '../contexts/WorkshopContext';

type RGB = [number, number, number];

// Approximations of the zinc / pine tokens in theme.css (jsPDF wants sRGB)
const INK: RGB = [24, 24, 27];
const MUTED: RGB = [113, 113, 122];
const RULE: RGB = [228, 228, 231];
const PINE: RGB = [21, 122, 90];
const PINE_TINT: RGB = [236, 248, 243];

const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

/** Builds and downloads the PDF receipt for a booking. */
export const downloadReceipt = (booking: Booking, workshop: Workshop, user: { name: string; email: string }) => {
  const doc = new jsPDF();

  doc.setFillColor(...INK);
  doc.rect(0, 0, 210, 40, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('WorkshopHub', 20, 21);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(190, 190, 197);
  doc.text('Payment receipt', 20, 30);
  doc.text(booking.id, 190, 30, { align: 'right' });

  let y = 58;
  const section = (title: string, rows: [string, string][]) => {
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(title.toUpperCase(), 20, y);
    y += 9;
    doc.setFontSize(11);
    for (const [label, value] of rows) {
      const lines: string[] = doc.splitTextToSize(value, 115);
      doc.setTextColor(...MUTED);
      doc.text(label, 20, y);
      doc.setTextColor(...INK);
      doc.text(lines, 190, y, { align: 'right' });
      y += 8 + (lines.length - 1) * 5;
    }
    y += 3;
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.3);
    doc.line(20, y, 190, y);
    y += 12;
  };

  section('Booking', [
    ['Booking ID', booking.id],
    ['Payment ID', booking.paymentId],
    ['Booked on', longDate(booking.bookingDate)],
  ]);
  section('Attendee', [
    ['Name', user.name],
    ['Email', user.email],
  ]);
  section('Workshop', [
    ['Title', workshop.title],
    ['Instructor', workshop.instructor],
    ['Category', workshop.category],
    ['Date', longDate(workshop.date)],
    ['Time', `${workshop.time}, ${workshop.duration}`],
  ]);

  doc.setFillColor(...PINE_TINT);
  doc.roundedRect(20, y - 4, 170, 22, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text(booking.status === 'confirmed' ? 'Amount paid' : 'Amount (booking cancelled)', 28, y + 9);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...PINE);
  doc.text(`$${booking.amount.toFixed(2)}`, 182, y + 9, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text('Computer-generated receipt. Payments on WorkshopHub are simulated; no card was charged.', 20, 287);

  doc.save(`receipt-${booking.id}.pdf`);
};
