import { useEffect, useMemo, useState } from 'react';
import { ShieldCheck, ShieldOff, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../../api/client.ts';
import { useAuth } from '../../contexts/AuthContext';
import { AdminPage, ConfirmAction, SearchField, Segmented, SkeletonRows, StatRow, tableClass } from '../../components/AdminUI';

interface UserData {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'student';
  createdAt?: string;
}

type RoleFilter = 'all' | 'student' | 'admin';

export const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setUsers(await api.get('/users'));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error("Couldn't load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const admins = users.filter(u => u.role === 'admin');
  const students = users.filter(u => u.role !== 'admin');

  const visible = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return users.filter(u => {
      const role = u.role === 'admin' ? 'admin' : 'student';
      return (roleFilter === 'all' || role === roleFilter) && (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    });
  }, [users, searchQuery, roleFilter]);

  const handleDelete = async (user: UserData) => {
    try {
      await api.delete(`/users/${user.email}`);
      toast.success(`Removed ${user.name}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error("Couldn't delete that user");
    }
  };

  const handleToggleRole = async (user: UserData) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    try {
      await api.put(`/users/${user.email}`, { role: newRole });
      toast.success(`${user.name} is now ${newRole === 'admin' ? 'an admin' : 'a student'}`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error("Couldn't change that role");
    }
  };

  return (
    <AdminPage title="Users" description="Everyone with an account. Admins can open this console; students can browse and book.">
      <StatRow
        loading={loading}
        items={[
          { label: 'Accounts', value: users.length },
          { label: 'Students', value: students.length },
          { label: 'Admins', value: admins.length },
        ]}
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented
          id="user-role"
          value={roleFilter}
          onChange={setRoleFilter}
          options={[
            { value: 'all', label: 'All', count: users.length },
            { value: 'student', label: 'Students', count: students.length },
            { value: 'admin', label: 'Admins', count: admins.length },
          ]}
        />
        <SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Search name or email" label="Search users" className="sm:w-72" />
      </div>

      <div className={tableClass.wrap}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem]">
            <thead>
              <tr>
                <th className={tableClass.th}>Name</th>
                <th className={tableClass.th}>Email</th>
                <th className={tableClass.th}>Role</th>
                <th className={`${tableClass.th} text-right`}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows cols={4} />
              ) : visible.length === 0 ? (
                <tr className="border-t border-gray-100">
                  <td colSpan={4} className="px-5 py-12 text-center text-sm text-gray-500">
                    No users match that.
                  </td>
                </tr>
              ) : (
                visible.map(user => {
                  const isAdmin = user.role === 'admin';
                  const isSelf = user.email === currentUser?.email;
                  return (
                    <tr key={user.email} className={tableClass.row}>
                      <td className={tableClass.td}>
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold ${
                              isAdmin ? 'bg-gray-900 text-white' : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-900">{user.name}</span>
                          {isSelf && <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">You</span>}
                        </div>
                      </td>
                      <td className={`${tableClass.td} text-sm text-gray-600`}>{user.email}</td>
                      <td className={tableClass.td}>
                        <span className="flex items-center gap-1.5 text-sm text-gray-700">
                          <span className={`size-1.5 rounded-full ${isAdmin ? 'bg-gray-900' : 'bg-indigo-500'}`} />
                          {isAdmin ? 'Admin' : 'Student'}
                        </span>
                      </td>
                      <td className={`${tableClass.td} text-right`}>
                        <div className="flex justify-end gap-1">
                          <ConfirmAction
                            destructive={false}
                            title={isAdmin ? `Remove admin access for ${user.name}?` : `Make ${user.name} an admin?`}
                            description={
                              isAdmin
                                ? 'They keep their account and bookings but lose access to this console.'
                                : 'Admins can edit workshops, change roles and delete accounts.'
                            }
                            confirmLabel={isAdmin ? 'Make student' : 'Make admin'}
                            onConfirm={() => handleToggleRole(user)}
                            trigger={
                              <button
                                disabled={isSelf}
                                title={isSelf ? "You can't change your own role" : isAdmin ? 'Make student' : 'Make admin'}
                                aria-label={isAdmin ? `Make ${user.name} a student` : `Make ${user.name} an admin`}
                                className={tableClass.iconButton}
                              >
                                {isAdmin ? <ShieldOff className="size-4" strokeWidth={1.75} /> : <ShieldCheck className="size-4" strokeWidth={1.75} />}
                              </button>
                            }
                          />
                          <ConfirmAction
                            title={`Delete ${user.name}'s account?`}
                            description="This removes their login. Their past bookings stay in the registrations list."
                            confirmLabel="Delete account"
                            onConfirm={() => handleDelete(user)}
                            trigger={
                              <button
                                disabled={isSelf}
                                title={isSelf ? "You can't delete your own account here" : 'Delete'}
                                aria-label={`Delete ${user.name}`}
                                className={tableClass.dangerButton}
                              >
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
    </AdminPage>
  );
};
