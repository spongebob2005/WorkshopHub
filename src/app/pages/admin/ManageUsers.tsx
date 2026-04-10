import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../api/client.ts';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Search, Users, Trash2, Shield, User, Mail, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'student';
  password?: string;
}

export const ManageUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.role || 'student').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    try {
      const data = await api.get('/users');
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (email: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/users/${email}`);
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleToggleRole = async (user: UserData) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin';
    
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    
    try {
      await api.put(`/users/${user.email}`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const admins = filteredUsers.filter(u => u.role === 'admin');
  const students = filteredUsers.filter(u => u.role !== 'admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-2xl">
                <Users className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
                <p className="text-gray-600">{users.length} users total ({admins.length} admins, {students.length} students)</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl border-gray-200 bg-white shadow-sm"
            />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Students</p>
                <p className="text-4xl font-bold">{students.length}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <User className="size-8" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Total Admins</p>
                <p className="text-4xl font-bold">{admins.length}</p>
              </div>
              <div className="bg-white/20 p-4 rounded-xl">
                <Shield className="size-8" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 bg-gray-200 rounded-full" />
                          <div className="h-4 bg-gray-200 rounded w-32" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-48" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-gray-200 rounded w-20" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-8 bg-gray-200 rounded w-24" />
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-full flex items-center justify-center text-white font-semibold ${
                            user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                          }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-500">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="size-4" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'admin' ? <Shield className="size-3" /> : <User className="size-3" />}
                          {user.role || 'student'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleToggleRole(user)}
                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-0 text-xs h-8"
                          >
                            <Edit className="size-3 mr-1" />
                            Toggle Role
                          </Button>
                          <Button
                            onClick={() => handleDelete(user.email)}
                            className="bg-red-50 text-red-600 hover:bg-red-100 border-0 text-xs h-8"
                          >
                            <Trash2 className="size-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6"
        >
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Shield className="size-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Admin Privileges</h3>
              <p className="text-sm text-blue-700">
                Admins can access this dashboard, manage workshops, users, and registrations. 
                Students can only browse and book workshops.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};