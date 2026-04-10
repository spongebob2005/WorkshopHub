import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../api/client.ts';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Search, Users, GraduationCap, Trash2, Edit2, Plus, X, Calendar, DollarSign, User, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id: string;
  name: string;
  email: string;
  role?: 'admin' | 'student';
  password?: string;
}

interface Workshop {
  id: string;
  title: string;
  instructor: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  category: string;
  seats?: number;
  totalSeats?: number;
  availableSeats?: number;
  enrolled?: number;
  description?: string;
  image?: string;
}

type TabType = 'users' | 'workshops';

export const AdminManagement = () => {
  const [activeTab, setActiveTab] = useState<TabType>('users');
  
  // Users state
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  
  // Workshops state
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState<Workshop[]>([]);
  const [workshopSearchQuery, setWorkshopSearchQuery] = useState('');
  
  // Modal state
  const [showUserModal, setShowUserModal] = useState(false);
  const [showWorkshopModal, setShowWorkshopModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [editingWorkshop, setEditingWorkshop] = useState<Workshop | null>(null);
  const [userFormData, setUserFormData] = useState<Partial<UserData>>({});
  const [workshopFormData, setWorkshopFormData] = useState<Partial<Workshop>>({});
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchWorkshops();
  }, []);

  useEffect(() => {
    const filtered = users.filter(u =>
      u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [userSearchQuery, users]);

  useEffect(() => {
    const filtered = workshops.filter(w =>
      w.title?.toLowerCase().includes(workshopSearchQuery.toLowerCase()) ||
      w.instructor?.toLowerCase().includes(workshopSearchQuery.toLowerCase()) ||
      w.category?.toLowerCase().includes(workshopSearchQuery.toLowerCase())
    );
    setFilteredWorkshops(filtered);
  }, [workshopSearchQuery, workshops]);

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

  const fetchWorkshops = async () => {
    try {
      const data = await api.get('/workshops');
      setWorkshops(data);
      setFilteredWorkshops(data);
    } catch (error) {
      console.error('Error fetching workshops:', error);
      toast.error('Failed to load workshops');
    }
  };

  // User management functions
  const handleDeleteUser = async (email: string) => {
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
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  // Workshop management functions
  const handleDeleteWorkshop = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return;
    
    try {
      await api.delete(`/workshops/${id}`);
      toast.success('Workshop deleted successfully');
      fetchWorkshops();
    } catch (error) {
      console.error('Error deleting workshop:', error);
      toast.error('Failed to delete workshop');
    }
  };

  const handleEditWorkshop = (workshop: Workshop) => {
    setEditingWorkshop(workshop);
    setWorkshopFormData(workshop);
    setShowWorkshopModal(true);
  };

  const handleSaveWorkshop = async () => {
    if (!workshopFormData.title || !workshopFormData.instructor) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingWorkshop) {
        await api.put(`/workshops/${editingWorkshop.id}`, workshopFormData);
        toast.success('Workshop updated successfully');
      } else {
        const newWorkshop = {
          ...workshopFormData,
          id: `w-${Date.now()}`,
          totalSeats: workshopFormData.totalSeats || 50,
          availableSeats: workshopFormData.availableSeats || 50,
          enrolled: 0,
        };
        await api.post('/workshops', newWorkshop);
        toast.success('Workshop created successfully');
      }
      setShowWorkshopModal(false);
      setEditingWorkshop(null);
      setWorkshopFormData({});
      fetchWorkshops();
    } catch (error) {
      console.error('Error saving workshop:', error);
      toast.error('Failed to save workshop');
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Management Dashboard</h1>
          <p className="text-gray-600">Manage users and workshops in one place</p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="size-5" />
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('workshops')}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              activeTab === 'workshops'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <GraduationCap className="size-5" />
            Workshops ({workshops.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users by name or email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl border-gray-200 bg-white shadow-sm"
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">{users.length}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <Users className="size-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Admins</p>
                    <p className="text-3xl font-bold text-gray-900">{admins.length}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-xl">
                    <Shield className="size-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">Students</p>
                    <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <User className="size-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                          <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48" /></td>
                          <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-20" /></td>
                          <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-32" /></td>
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
                          key={user.email}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                                {user.name?.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-gray-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="size-4" />
                              <span className="text-sm">{user.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {user.role === 'admin' ? 'Admin' : 'Student'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleToggleRole(user)}
                                className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-0 text-xs h-8"
                              >
                                <Shield className="size-3 mr-1" />
                                Toggle Role
                              </Button>
                              <Button
                                onClick={() => handleDeleteUser(user.email)}
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
            </div>
          </motion.div>
        )}

        {/* Workshops Tab */}
        {activeTab === 'workshops' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Search and Add Button */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search workshops by title, instructor, or category..."
                  value={workshopSearchQuery}
                  onChange={(e) => setWorkshopSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-gray-200 bg-white shadow-sm"
                />
              </div>
              <Button
                onClick={() => {
                  setEditingWorkshop(null);
                  setWorkshopFormData({});
                  setShowWorkshopModal(true);
                }}
                className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
              >
                <Plus className="size-5 mr-2" />
                Add Workshop
              </Button>
            </div>

            {/* Workshops Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkshops.map((workshop, index) => (
                <motion.div
                  key={workshop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      {workshop.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditWorkshop(workshop)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteWorkshop(workshop.id)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{workshop.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">by {workshop.instructor}</p>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4" />
                      <span>{workshop.date} at {workshop.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="size-4" />
                      <span>${workshop.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="size-4" />
                      <span>{workshop.enrolled || 0} / {workshop.totalSeats || workshop.seats || 50} enrolled</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Workshop Modal */}
        <AnimatePresence>
          {showWorkshopModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingWorkshop ? 'Edit Workshop' : 'Add New Workshop'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowWorkshopModal(false);
                      setEditingWorkshop(null);
                      setWorkshopFormData({});
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="size-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <Input
                      value={workshopFormData.title || ''}
                      onChange={(e) => setWorkshopFormData({ ...workshopFormData, title: e.target.value })}
                      placeholder="Workshop title"
                      className="h-11"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instructor *</label>
                    <Input
                      value={workshopFormData.instructor || ''}
                      onChange={(e) => setWorkshopFormData({ ...workshopFormData, instructor: e.target.value })}
                      placeholder="Instructor name"
                      className="h-11"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <Input
                        type="date"
                        value={workshopFormData.date || ''}
                        onChange={(e) => setWorkshopFormData({ ...workshopFormData, date: e.target.value })}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <Input
                        value={workshopFormData.time || ''}
                        onChange={(e) => setWorkshopFormData({ ...workshopFormData, time: e.target.value })}
                        placeholder="e.g., 10:00 AM"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                      <Input
                        value={workshopFormData.duration || ''}
                        onChange={(e) => setWorkshopFormData({ ...workshopFormData, duration: e.target.value })}
                        placeholder="e.g., 3 hours"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                      <Input
                        type="number"
                        value={workshopFormData.price || ''}
                        onChange={(e) => setWorkshopFormData({ ...workshopFormData, price: parseFloat(e.target.value) })}
                        placeholder="99.99"
                        className="h-11"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seats</label>
                      <Input
                        type="number"
                        value={workshopFormData.totalSeats || workshopFormData.seats || ''}
                        onChange={(e) => {
                          const seats = parseInt(e.target.value);
                          setWorkshopFormData({ 
                            ...workshopFormData, 
                            totalSeats: seats,
                            seats: seats,
                            availableSeats: seats - (workshopFormData.enrolled || 0)
                          });
                        }}
                        placeholder="50"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <Input
                      value={workshopFormData.category || ''}
                      onChange={(e) => setWorkshopFormData({ ...workshopFormData, category: e.target.value })}
                      placeholder="e.g., Web Development"
                      className="h-11"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={workshopFormData.description || ''}
                      onChange={(e) => setWorkshopFormData({ ...workshopFormData, description: e.target.value })}
                      placeholder="Workshop description..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none h-24"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Button
                      onClick={handleSaveWorkshop}
                      className="flex-1 h-11 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0"
                    >
                      {editingWorkshop ? 'Update Workshop' : 'Create Workshop'}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowWorkshopModal(false);
                        setEditingWorkshop(null);
                        setWorkshopFormData({});
                      }}
                      className="px-6 h-11 bg-gray-100 text-gray-700 hover:bg-gray-200 border-0"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
