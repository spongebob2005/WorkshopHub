import { projectId, publicAnonKey } from "/utils/supabase/info";

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-008fe078`;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${publicAnonKey}`,
};

// Check if backend is available
let backendAvailable = true;
let backendCheckPromise: Promise<boolean> | null = null;

const checkBackend = async (): Promise<boolean> => {
  if (backendCheckPromise) return backendCheckPromise;
  
  backendCheckPromise = (async () => {
    try {
      const res = await fetch(`${BASE_URL}/health`, { headers });
      backendAvailable = res.ok;
      return backendAvailable;
    } catch {
      backendAvailable = false;
      return false;
    }
  })();
  
  return backendCheckPromise;
};

// Initialize backend check
checkBackend();

// LocalStorage fallback functions
const getFromStorage = (key: string): any[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (key: string, data: any[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

export const api = {
  get: async (endpoint: string) => {
    const isBackendUp = await checkBackend();
    
    if (!isBackendUp) {
      console.log(`Using localStorage fallback for GET ${endpoint}`);
      
      // Parse endpoint to get resource type
      if (endpoint === '/users') {
        return getFromStorage('users');
      } else if (endpoint === '/workshops') {
        return getFromStorage('workshops');
      } else if (endpoint === '/bookings') {
        return getFromStorage('bookings');
      } else if (endpoint === '/admin/stats') {
        const users = getFromStorage('users');
        const workshops = getFromStorage('workshops');
        const bookings = getFromStorage('bookings');
        
        const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.amount || 0), 0);
        const adminUsers = users.filter((u: any) => u.role === 'admin');
        const studentUsers = users.filter((u: any) => u.role !== 'admin');
        
        return {
          totalUsers: users.length,
          totalAdmins: adminUsers.length,
          totalStudents: studentUsers.length,
          totalWorkshops: workshops.length,
          totalBookings: bookings.length,
          totalRevenue,
        };
      }
      
      return [];
    }
    
    console.log(`Fetching GET ${BASE_URL}${endpoint}`);
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, { headers });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`GET ${endpoint} failed with status ${res.status}: ${text}`);
      }
      return await res.json();
    } catch (e) {
      console.error(`API GET Error:`, e);
      backendAvailable = false;
      // Retry with localStorage
      return api.get(endpoint);
    }
  },
  
  post: async (endpoint: string, body: any) => {
    const isBackendUp = await checkBackend();
    
    if (!isBackendUp) {
      console.log(`Using localStorage fallback for POST ${endpoint}`);
      
      if (endpoint === '/login') {
        const users = getFromStorage('users');
        const foundUser = users.find((u: any) => u.email === body.email && u.password === body.password && (u.role || 'student') === body.role);
        if (!foundUser) {
          return { success: false, error: 'Invalid credentials' };
        }
        const userWithoutPassword = { ...foundUser };
        delete userWithoutPassword.password;
        return { success: true, user: userWithoutPassword };
      } else if (endpoint === '/users') {
        const users = getFromStorage('users');
        users.push(body);
        saveToStorage('users', users);
        return { success: true, user: body };
      } else if (endpoint === '/workshops') {
        const workshops = getFromStorage('workshops');
        workshops.push(body);
        saveToStorage('workshops', workshops);
        return { success: true, workshop: body };
      } else if (endpoint === '/bookings') {
        const bookings = getFromStorage('bookings');
        bookings.push(body);
        saveToStorage('bookings', bookings);
        
        // Update workshop enrolled count
        if (body.workshopId) {
          const workshops = getFromStorage('workshops');
          const workshopIndex = workshops.findIndex(w => w.id === body.workshopId);
          if (workshopIndex !== -1) {
            workshops[workshopIndex].enrolled = (workshops[workshopIndex].enrolled || 0) + 1;
            workshops[workshopIndex].availableSeats = (workshops[workshopIndex].availableSeats || workshops[workshopIndex].totalSeats) - 1;
            saveToStorage('workshops', workshops);
          }
        }
        
        return { success: true, booking: body };
      } else if (endpoint === '/workshops/init') {
        const workshops = getFromStorage('workshops');
        if (workshops.length === 0) {
          saveToStorage('workshops', body.workshops);
        }
        return { success: true, count: body.workshops.length };
      }
      
      return { success: true };
    }
    
    console.log(`Fetching POST ${BASE_URL}${endpoint}`);
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        if (res.status >= 500) {
          backendAvailable = false;
          return api.post(endpoint, body);
        }
        return { success: false, error: text };
      }
      return await res.json();
    } catch (e) {
      console.error(`API POST Error:`, e);
      backendAvailable = false;
      return api.post(endpoint, body);
    }
  },
  
  put: async (endpoint: string, body: any) => {
    const isBackendUp = await checkBackend();
    
    if (!isBackendUp) {
      console.log(`Using localStorage fallback for PUT ${endpoint}`);
      
      if (endpoint.startsWith('/users/')) {
        const email = endpoint.split('/users/')[1];
        const users = getFromStorage('users');
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...body };
          saveToStorage('users', users);
          return { success: true, user: users[userIndex] };
        }
        return { error: 'User not found' };
      } else if (endpoint.startsWith('/workshops/')) {
        const id = endpoint.split('/workshops/')[1];
        const workshops = getFromStorage('workshops');
        const workshopIndex = workshops.findIndex(w => w.id === id);
        if (workshopIndex !== -1) {
          workshops[workshopIndex] = { ...workshops[workshopIndex], ...body };
          saveToStorage('workshops', workshops);
          return { success: true, workshop: workshops[workshopIndex] };
        }
        return { error: 'Workshop not found' };
      }
      
      return { success: true };
    }
    
    console.log(`Fetching PUT ${BASE_URL}${endpoint}`);
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`PUT ${endpoint} failed with status ${res.status}: ${text}`);
      }
      return await res.json();
    } catch (e) {
      console.error(`API PUT Error:`, e);
      backendAvailable = false;
      return api.put(endpoint, body);
    }
  },
  
  delete: async (endpoint: string) => {
    const isBackendUp = await checkBackend();
    
    if (!isBackendUp) {
      console.log(`Using localStorage fallback for DELETE ${endpoint}`);
      
      if (endpoint.startsWith('/users/')) {
        const email = endpoint.split('/users/')[1];
        const users = getFromStorage('users');
        const filtered = users.filter(u => u.email !== email);
        saveToStorage('users', filtered);
        return { success: true };
      } else if (endpoint.startsWith('/workshops/')) {
        const id = endpoint.split('/workshops/')[1];
        const workshops = getFromStorage('workshops');
        const filtered = workshops.filter(w => w.id !== id);
        saveToStorage('workshops', filtered);
        return { success: true };
      } else if (endpoint.startsWith('/bookings/')) {
        const id = endpoint.split('/bookings/')[1];
        const bookings = getFromStorage('bookings');
        const filtered = bookings.filter(b => b.id !== id);
        saveToStorage('bookings', filtered);
        return { success: true };
      }
      
      return { success: true };
    }
    
    console.log(`Fetching DELETE ${BASE_URL}${endpoint}`);
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`DELETE ${endpoint} failed with status ${res.status}: ${text}`);
      }
      return await res.json();
    } catch (e) {
      console.error(`API DELETE Error:`, e);
      backendAvailable = false;
      return api.delete(endpoint);
    }
  },
};
