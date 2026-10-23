import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useWorkshops } from '../contexts/WorkshopContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { WorkshopCover } from '../components/WorkshopCover';
import { FormError, Spinner } from '../components/AuthShell';
import { PageLoader, PageMessage, btn } from '../components/PageState';

const ease = [0.22, 1, 0.36, 1] as const;

const inputClass =
  'h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-50 disabled:text-gray-500';

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');

const cardBrand = (number: string) => {
  const n = number.replace(/\s/g, '');
  if (n.startsWith('4')) return 'VISA';
  if (/^5[1-5]/.test(n)) return 'Mastercard';
  if (/^3[47]/.test(n)) return 'Amex';
  return null;
};

export const Payment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWorkshopById, addBooking, updateSeatAvailability, loading: workshopsLoading } = useWorkshops();
  const { user } = useAuth();
  const workshop = getWorkshopById(id!);

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [cardFlipped, setCardFlipped] = useState(false);

  if (workshopsLoading) return <PageLoader />;

  if (!workshop) {
    return (
      <PageMessage
        eyebrow="Checkout"
        title="There's nothing to pay for here."
        body="The workshop in this link no longer exists. Pick another session from the catalog."
        actions={
          <Link to="/" className={btn.primary}>
            Browse workshops
          </Link>
        }
      />
    );
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      setError('Fill in every card field to continue.');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Card number should be 16 digits.');
      return;
    }
    const month = Number(expiryDate.slice(0, 2));
    if (expiryDate.length !== 5 || month < 1 || month > 12) {
      setError('Expiry should look like MM/YY.');
      return;
    }
    if (cvv.length !== 3) {
      setError('CVV is the 3 digits on the back of the card.');
      return;
    }
    setProcessing(true);
    setTimeout(async () => {
      const booking = {
        id: `BKG-${Date.now()}`,
        userId: user!.id,
        userName: user!.name,
        userEmail: user!.email,
        workshopId: workshop.id,
        workshopTitle: workshop.title,
        date: workshop.date,
        price: workshop.price,
        bookingDate: new Date().toISOString(),
        paymentId: `PAY-${Date.now()}`,
        paymentMethod: 'Credit Card',
        status: 'confirmed' as const,
        amount: workshop.price,
      };

      try {
        await addBooking(booking);
        await updateSeatAvailability(workshop.id, 1);
        navigate(`/payment-success/${booking.id}`);
      } catch (err) {
        console.error('Failed booking process', err);
        toast.error("Payment went through but the booking didn't save. Try again.");
        setProcessing(false);
      }
    }, 1800);
  };

  const brand = cardBrand(cardNumber);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <Link to={`/workshop/${id}`} className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900">
        <ArrowLeft className="size-4" />
        Back to workshop
      </Link>

      <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }} className="mt-6">
        <p className="eyebrow text-indigo-700">Checkout</p>
        <h1 className="mt-3 text-3xl tracking-[-0.03em] text-gray-900 sm:text-4xl">Book your seat</h1>
      </motion.header>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_22rem]">
        {/* Card + form */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease }}
          className="grid grid-cols-1 gap-8 md:grid-cols-[17rem_1fr] md:items-start"
          aria-label="Payment details"
        >
          {/* Card preview */}
          <div className="mx-auto w-full max-w-[20rem] md:sticky md:top-24" style={{ perspective: '1000px' }} aria-hidden>
            <motion.div
              animate={{ rotateY: cardFlipped ? 180 : 0 }}
              transition={{ duration: 0.5, ease }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative aspect-[1.586] w-full"
            >
              <div className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-gray-900 p-5 text-white shadow-[0_20px_40px_-20px_oklch(0.2_0.01_286/0.6)]" style={{ backfaceVisibility: 'hidden' }}>
                <div className="flex items-center justify-between">
                  <span className="h-7 w-9 rounded-md bg-indigo-300" />
                  <span className="text-xs font-semibold tracking-widest text-white/80">{brand ?? ''}</span>
                </div>
                <div>
                  <p className="font-mono text-[0.95rem] tracking-[0.12em] text-white/90 tabular">{cardNumber || '•••• •••• •••• ••••'}</p>
                  <div className="mt-3 flex items-end justify-between gap-4 text-xs">
                    <div className="min-w-0">
                      <p className="text-white/40">Card holder</p>
                      <p className="mt-0.5 truncate uppercase tracking-wide">{cardName || 'Your name'}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-white/40">Expires</p>
                      <p className="mt-0.5 font-mono tabular">{expiryDate || 'MM/YY'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gray-900 pt-6" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <div className="h-10 bg-gray-950" />
                <div className="mx-5 mt-5 flex items-center justify-end rounded bg-white/10 p-2">
                  <span className="rounded bg-white px-2.5 py-0.5 font-mono text-sm text-gray-800 tabular">{cvv ? '•'.repeat(cvv.length) : 'CVV'}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <form onSubmit={handlePayment} noValidate className="space-y-5">
            <AnimatePresence>{error && <FormError message={error} />}</AnimatePresence>

            <div>
              <label htmlFor="cardName" className="mb-1.5 block text-gray-700">Name on card</label>
              <input
                id="cardName"
                autoComplete="cc-name"
                placeholder="As printed on the card"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                onFocus={() => setCardFlipped(false)}
                disabled={processing}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="cardNumber" className="mb-1.5 block text-gray-700">Card number</label>
              <input
                id="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                onFocus={() => setCardFlipped(false)}
                maxLength={19}
                disabled={processing}
                className={`${inputClass} font-mono tabular`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiry" className="mb-1.5 block text-gray-700">Expiry</label>
                <input
                  id="expiry"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={e => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 3) value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
                    setExpiryDate(value);
                  }}
                  onFocus={() => setCardFlipped(false)}
                  maxLength={5}
                  disabled={processing}
                  className={`${inputClass} font-mono tabular`}
                />
              </div>
              <div>
                <label htmlFor="cvv" className="mb-1.5 block text-gray-700">CVV</label>
                <input
                  id="cvv"
                  type="password"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="•••"
                  value={cvv}
                  onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                  onFocus={() => setCardFlipped(true)}
                  onBlur={() => setCardFlipped(false)}
                  maxLength={3}
                  disabled={processing}
                  className={`${inputClass} font-mono tabular`}
                />
              </div>
            </div>

            <button type="submit" disabled={processing} className={`${btn.primary} w-full py-3`}>
              {processing ? (
                <>
                  <Spinner />
                  Processing
                </>
              ) : (
                <>
                  <Lock className="size-4" />
                  Pay <span className="font-mono tabular">${workshop.price}</span>
                </>
              )}
            </button>

            <p className="text-xs text-gray-500">
              This is a demo checkout. Any 16-digit number works and nothing is charged.
            </p>
          </form>
        </motion.section>

        {/* Order summary */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease }}
          className="lg:sticky lg:top-24 lg:self-start"
          aria-label="Order summary"
        >
          <div className="rounded-2xl bg-white p-2 ring-1 ring-gray-900/[0.06]">
            <WorkshopCover category={workshop.category} image={workshop.image} title={workshop.title} className="aspect-[16/9] rounded-xl" />
            <div className="p-3 pt-4">
              <p className="text-xs text-gray-500">{workshop.category}</p>
              <h2 className="mt-1 text-base leading-snug text-gray-900">{workshop.title}</h2>
              <p className="mt-1 text-sm text-gray-500">with {workshop.instructor}</p>

              <dl className="mt-5 space-y-2.5 border-t border-gray-100 pt-4 text-sm">
                {[
                  ['Date', new Date(workshop.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })],
                  ['Starts', workshop.time],
                  ['Duration', workshop.duration],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-4">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="text-right text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>

              <dl className="mt-4 space-y-2.5 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">1 seat</dt>
                  <dd className="font-mono text-gray-900 tabular">${workshop.price}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Fees</dt>
                  <dd className="font-mono text-gray-900 tabular">$0.00</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-gray-100 pt-3">
                  <dt className="text-gray-900">Total</dt>
                  <dd className="font-mono text-xl text-gray-900 tabular">${workshop.price}</dd>
                </div>
              </dl>
            </div>
          </div>
        </motion.aside>
      </div>
    </main>
  );
};
