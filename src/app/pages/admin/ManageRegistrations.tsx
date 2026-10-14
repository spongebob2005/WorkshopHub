import { useEffect, useMemo, useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../api/client.ts';
import { AdminPage, ConfirmAction, SearchField, Segmented, SkeletonRows, StatRow, tableClass } from '../../components/AdminUI';
import { btn } from '../../components/PageState';

interface Registration {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  workshopId: string;
  workshopTitle?: string;
  date?: string;
  price?: number;
  amount?: number;
  status?: 'confirmed' | 'cancelled';
  paymentId?: string;
  paymentMethod?: string;
  bookingDate?: string;
}

type StatusFilter = 'all' | 'confirmed' | 'cancelled';

const amountOf = (b: Registration) => b.amount ?? b.price ?? 0;
const shortDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

export const ManageRegistrations = () => {
  const [bookings, setBookings] = useState<Registration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setBookings(await api.get('/bookings'));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error("Couldn't load registrations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const visible = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return bookings
      .filter(b => {
        const status = b.status ?? 'confirmed';
        const matches =
          b.userName?.toLowerCase().includes(q) || b.userEmail?.toLowerCase().includes(q) || b.workshopTitle?.toLowerCase().includes(q);
        return (statusFilter === 'all' || status === statusFilter) && (q === '' || matches);
      })
      .sort((a, b) => new Date(b.bookingDate ?? 0).getTime() - new Date(a.bookingDate ?? 0).getTime());
  }, [bookings, searchQuery, statusFilter]);

  const confirmed = bookings.filter(b => b.status !== 'cancelled');
  const revenue = confirmed.reduce((sum, b) => sum + amountOf(b), 0);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/bookings/${id}`);
      toast.success('Registration deleted');
      fetchBookings();
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error("Couldn't delete that registration");
    }
  };

  const exportToCSV = () => {
    if (visible.length === 0) {
      toast.error('Nothing to export');
      return;
    }
    const headers = ['Booking ID', 'Student', 'Email', 'Workshop', 'Workshop date', 'Amount', 'Status', 'Payment ID', 'Booked on'];
    const rows = visible.map(b => [
      b.id,
      b.userName ?? '',
      b.userEmail ?? '',
      b.workshopTitle ?? '',
      b.date ?? '',
      amountOf(b),
      b.status ?? 'confirmed',
      b.paymentId ?? '',
      b.bookingDate ? new Date(b.bookingDate).toISOString().slice(0, 10) : '',
    ]);
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `registrations_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${visible.length} ${visible.length === 1 ? 'row' : 'rows'}`);
  };

  return (
    <AdminPage
      title="Registrations"
      description="Every booking made through checkout, newest first."
      actions={
        <button onClick={exportToCSV} className={btn.secondary}>
          <Download className="size-4" />
          Export CSV
        </button>
      }
    >
      <StatRow
        loading={loading}
        items={[
          { label: 'Registrations', value: bookings.length },
          { label: 'Active', value: confirmed.length },
          { label: 'Revenue', value: `$${revenue.toLocaleString('en-US', { maximumFractionDigits: 2 })}` },
          { label: 'Avg. per booking', value: `$${confirmed.length ? (revenue / confirmed.length).toFixed(2) : '0.00'}` },
        ]}
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented
          id="reg-status"
          value={statusFilter}
          onChange={setStatusFilter}
          options={[
            { value: 'all', label: 'All', count: bookings.length },
            { value: 'confirmed', label: 'Confirmed', count: confirmed.length },
            { value: 'cancelled', label: 'Cancelled', count: bookings.length - confirmed.length },
          ]}
        />
        <SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Search student or workshop" label="Search registrations" className="sm:w-72" />
      </div>

      <div className={tableClass.wrap}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem]">
            <thead>
              <tr>
                <th className={tableClass.th}>Student</th>
                <th className={tableClass.th}>Workshop</th>
                <th className={tableClass.th}>Booked</th>
                <th className={tableClass.th}>Status</th>
                <th className={`${tableClass.th} text-right`}>Amount</th>
                <th className={tableClass.th}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows cols={6} />
              ) : visible.length === 0 ? (
                <tr className="border-t border-gray-100">
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-gray-500">
                    {bookings.length === 0 ? 'No one has booked yet.' : 'No registrations match that.'}
                  </td>
                </tr>
              ) : (
                visible.map(b => {
                  const cancelled = b.status === 'cancelled';
                  return (
                    <tr key={b.id} className={tableClass.row}>
                      <td className={tableClass.td}>
                        <p className="text-sm text-gray-900">{b.userName || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{b.userEmail}</p>
                      </td>
                      <td className={`${tableClass.td} max-w-[18rem]`}>
                        <p className="truncate text-sm text-gray-900">{b.workshopTitle || b.workshopId}</p>
                        {b.date && <p className="text-xs text-gray-500">Runs {shortDate(b.date)}</p>}
                      </td>
                      <td className={`${tableClass.td} text-sm text-gray-600`}>{shortDate(b.bookingDate)}</td>
                      <td className={tableClass.td}>
                        <span className="flex items-center gap-1.5 text-sm text-gray-700">
                          <span className={`size-1.5 rounded-full ${cancelled ? 'bg-gray-400' : 'bg-emerald-500'}`} />
                          {cancelled ? 'Cancelled' : 'Confirmed'}
                        </span>
                      </td>
                      <td className={`${tableClass.td} text-right font-mono text-sm tabular ${cancelled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                        ${amountOf(b)}
                      </td>
                      <td className={`${tableClass.td} text-right`}>
                        <ConfirmAction
                          title="Delete this registration?"
                          description={
                            <>
                              This permanently removes {b.userName || 'the student'}'s booking for {b.workshopTitle || 'this workshop'} from the records.
                            </>
                          }
                          confirmLabel="Delete"
                          onConfirm={() => handleDelete(b.id)}
                          trigger={
                            <button aria-label={`Delete registration ${b.id}`} className={tableClass.dangerButton}>
                              <Trash2 className="size-4" strokeWidth={1.75} />
                            </button>
                          }
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminPage>
  );
};
