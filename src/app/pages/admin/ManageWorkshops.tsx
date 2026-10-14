import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../api/client.ts';
import type { Workshop } from '../../contexts/WorkshopContext';
import { AdminPage, ConfirmAction, SearchField, SkeletonRows, StatRow, tableClass } from '../../components/AdminUI';
import { btn } from '../../components/PageState';
import { Spinner } from '../../components/AuthShell';
import { WorkshopCover } from '../../components/WorkshopCover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../components/ui/dialog';

type AdminWorkshop = Partial<Workshop> & Pick<Workshop, 'id' | 'title' | 'instructor'>;

interface FormState {
  title: string;
  instructor: string;
  category: string;
  date: string;
  time: string;
  duration: string;
  price: string;
  totalSeats: string;
  image: string;
  skills: string;
  description: string;
}

const emptyForm: FormState = {
  title: '',
  instructor: '',
  category: '',
  date: '',
  time: '10:00 AM',
  duration: '3 hours',
  price: '',
  totalSeats: '30',
  image: '',
  skills: '',
  description: '',
};

const toForm = (w: AdminWorkshop): FormState => ({
  title: w.title ?? '',
  instructor: w.instructor ?? '',
  category: w.category ?? '',
  date: w.date ?? '',
  time: w.time ?? '',
  duration: w.duration ?? '',
  price: w.price != null ? String(w.price) : '',
  totalSeats: w.totalSeats != null ? String(w.totalSeats) : '',
  image: w.image ?? '',
  skills: (w.skills ?? []).join(', '),
  description: w.description ?? '',
});

const validate = (f: FormState) => {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!f.title.trim()) errors.title = 'Give the workshop a title.';
  if (!f.instructor.trim()) errors.instructor = 'Who is teaching it?';
  if (!f.category.trim()) errors.category = 'Pick or type a category.';
  if (!f.date) errors.date = 'Choose a date.';
  if (f.price === '' || Number(f.price) < 0 || Number.isNaN(Number(f.price))) errors.price = 'Enter a price (0 for free).';
  if (!Number.isInteger(Number(f.totalSeats)) || Number(f.totalSeats) < 1) errors.totalSeats = 'At least 1 seat.';
  return errors;
};

const inputClass =
  'h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 outline-none transition-[border-color,box-shadow] placeholder:text-gray-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';

export const ManageWorkshops = () => {
  const [workshops, setWorkshops] = useState<AdminWorkshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminWorkshop | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);

  const fetchWorkshops = async () => {
    try {
      setWorkshops(await api.get('/workshops'));
    } catch (error) {
      console.error('Error fetching workshops:', error);
      toast.error("Couldn't load workshops");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const categories = useMemo(() => Array.from(new Set(workshops.map(w => w.category).filter(Boolean))) as string[], [workshops]);

  const visible = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return workshops
      .filter(w => [w.title, w.instructor, w.category].some(v => v?.toLowerCase().includes(q)))
      .sort((a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime());
  }, [workshops, searchQuery]);

  const seatsTotal = workshops.reduce((sum, w) => sum + (w.totalSeats ?? 0), 0);
  const seatsBooked = workshops.reduce((sum, w) => sum + ((w.totalSeats ?? 0) - (w.availableSeats ?? w.totalSeats ?? 0)), 0);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (w: AdminWorkshop) => {
    setEditing(w);
    setForm(toForm(w));
    setErrors({});
    setOpen(true);
  };

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors(errs => ({ ...errs, [key]: undefined }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const totalSeats = Number(form.totalSeats);
    const booked = editing ? (editing.totalSeats ?? 0) - (editing.availableSeats ?? editing.totalSeats ?? 0) : 0;
    const payload = {
      title: form.title.trim(),
      instructor: form.instructor.trim(),
      category: form.category.trim(),
      date: form.date,
      time: form.time.trim(),
      duration: form.duration.trim(),
      price: Number(form.price),
      totalSeats,
      availableSeats: Math.max(0, totalSeats - booked),
      image: form.image.trim(),
      skills: form.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      description: form.description.trim(),
    };

    setSaving(true);
    try {
      if (editing) {
        await api.put(`/workshops/${editing.id}`, payload);
        toast.success('Workshop updated');
      } else {
        await api.post('/workshops', {
          ...payload,
          id: `w-${Date.now()}`,
          learningContent: { pdfs: [], videos: [], mcqs: [] },
        });
        toast.success('Workshop published');
      }
      setOpen(false);
      fetchWorkshops();
    } catch (error) {
      console.error('Error saving workshop:', error);
      toast.error("Couldn't save the workshop");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (w: AdminWorkshop) => {
    try {
      await api.delete(`/workshops/${w.id}`);
      toast.success(`Deleted ${w.title}`);
      fetchWorkshops();
    } catch (error) {
      console.error('Error deleting workshop:', error);
      toast.error("Couldn't delete that workshop");
    }
  };

  const field = (key: keyof FormState, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`wf-${key}`} className="mb-1.5 block text-gray-700">
        {label}
      </label>
      <input
        id={`wf-${key}`}
        value={form[key]}
        onChange={set(key)}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `wf-${key}-error` : undefined}
        className={`${inputClass} ${errors[key] ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'}`}
        {...props}
      />
      {errors[key] && (
        <p id={`wf-${key}-error`} className="mt-1 text-xs text-red-600">
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <AdminPage
      title="Workshops"
      description="Create sessions, adjust seats and pricing, or retire old ones."
      actions={
        <button onClick={openCreate} className={btn.primary}>
          <Plus className="size-4" />
          New workshop
        </button>
      }
    >
      <StatRow
        loading={loading}
        items={[
          { label: 'Workshops', value: workshops.length },
          { label: 'Categories', value: categories.length },
          { label: 'Seats booked', value: seatsBooked },
          { label: 'Fill rate', value: `${seatsTotal ? Math.round((seatsBooked / seatsTotal) * 100) : 0}%` },
        ]}
      />

      <div className="mt-8 flex justify-end">
        <SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Search title, instructor, category" label="Search workshops" className="w-full sm:w-80" />
      </div>

      <div className={tableClass.wrap}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem]">
            <thead>
              <tr>
                <th className={tableClass.th}>Workshop</th>
                <th className={tableClass.th}>Runs</th>
                <th className={`${tableClass.th} text-right`}>Price</th>
                <th className={tableClass.th}>Seats</th>
                <th className={tableClass.th}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows cols={5} />
              ) : visible.length === 0 ? (
                <tr className="border-t border-gray-100">
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-gray-500">
                    {workshops.length === 0 ? 'No workshops yet. Create the first one.' : 'No workshops match that.'}
                  </td>
                </tr>
              ) : (
                visible.map(w => {
                  const total = w.totalSeats ?? 0;
                  const booked = total - (w.availableSeats ?? total);
                  const rate = total > 0 ? booked / total : 0;
                  return (
                    <tr key={w.id} className={tableClass.row}>
                      <td className={`${tableClass.td} max-w-[22rem]`}>
                        <div className="flex items-center gap-3">
                          <WorkshopCover category={w.category ?? ''} image={w.image} title={w.title} className="size-10 shrink-0 rounded-lg" />
                          <div className="min-w-0">
                            <p className="truncate text-sm text-gray-900">{w.title}</p>
                            <p className="truncate text-xs text-gray-500">
                              {w.instructor}
                              {w.category && <> · {w.category}</>}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`${tableClass.td} whitespace-nowrap text-sm text-gray-600`}>
                        {w.date ? new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'}
                        {w.time && <span className="text-gray-400">, {w.time}</span>}
                      </td>
                      <td className={`${tableClass.td} text-right font-mono text-sm text-gray-900 tabular`}>${w.price ?? 0}</td>
                      <td className={`${tableClass.td} w-44`}>
                        <p className="font-mono text-xs text-gray-600 tabular">
                          {booked}/{total}
                        </p>
                        <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-gray-100">
                          <div className={`h-full rounded-full ${rate >= 0.8 ? 'bg-indigo-600' : 'bg-gray-900'}`} style={{ width: `${rate * 100}%` }} />
                        </div>
                      </td>
                      <td className={`${tableClass.td} text-right`}>
                        <div className="flex justify-end gap-1">
                          <Link to={`/workshop/${w.id}`} aria-label={`View ${w.title} on the student site`} className={tableClass.iconButton}>
                            <ArrowUpRight className="size-4" strokeWidth={1.75} />
                          </Link>
                          <button onClick={() => openEdit(w)} aria-label={`Edit ${w.title}`} className={tableClass.iconButton}>
                            <Pencil className="size-4" strokeWidth={1.75} />
                          </button>
                          <ConfirmAction
                            title={`Delete ${w.title}?`}
                            description={
                              booked > 0
                                ? `${booked} ${booked === 1 ? 'student has' : 'students have'} booked this. Their registrations stay on record, but the workshop page will disappear.`
                                : 'It will disappear from the catalog immediately.'
                            }
                            confirmLabel="Delete workshop"
                            onConfirm={() => handleDelete(w)}
                            trigger={
                              <button aria-label={`Delete ${w.title}`} className={tableClass.dangerButton}>
                                <Trash2 className="size-4" strokeWidth={1.75} />
                              </button>
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={next => !saving && setOpen(next)}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-2xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl tracking-[-0.02em]">{editing ? 'Edit workshop' : 'New workshop'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Changes show up in the catalog as soon as you save.' : 'It goes live in the catalog as soon as you publish.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} noValidate className="mt-2 space-y-4">
            {field('title', 'Title', { placeholder: 'e.g. Practical TypeScript for React' })}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {field('instructor', 'Instructor', { placeholder: 'Full name' })}
              <div>
                {field('category', 'Category', { placeholder: 'e.g. Web Development', list: 'wf-categories' })}
                <datalist id="wf-categories">
                  {categories.map(c => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {field('date', 'Date', { type: 'date' })}
              {field('time', 'Start time', { placeholder: '10:00 AM' })}
              <div className="col-span-2 sm:col-span-1">{field('duration', 'Duration', { placeholder: '3 hours' })}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {field('price', 'Price (USD)', { type: 'number', min: 0, step: '0.01', inputMode: 'decimal', placeholder: '49.99' })}
              {field('totalSeats', 'Total seats', { type: 'number', min: 1, step: 1, inputMode: 'numeric' })}
            </div>
            {editing && (
              <p className="-mt-2 text-xs text-gray-500">
                {(editing.totalSeats ?? 0) - (editing.availableSeats ?? editing.totalSeats ?? 0)} seats already booked; open seats are recalculated from the total.
              </p>
            )}
            {field('skills', 'Skills covered', { placeholder: 'Comma separated, e.g. Hooks, Testing, Performance' })}
            {field('image', 'Cover image', { placeholder: 'Image URL, or a few keywords for a stock photo' })}
            <div>
              <label htmlFor="wf-description" className="mb-1.5 block text-gray-700">
                Description
              </label>
              <textarea
                id="wf-description"
                value={form.description}
                onChange={set('description')}
                rows={4}
                placeholder="What will people build or learn?"
                className={`${inputClass} h-auto resize-y border-gray-200 py-2.5 hover:border-gray-300`}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setOpen(false)} disabled={saving} className={btn.ghost}>
                Cancel
              </button>
              <button type="submit" disabled={saving} className={btn.primary}>
                {saving && <Spinner />}
                {editing ? 'Save changes' : 'Publish workshop'}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AdminPage>
  );
};
