import { createBrowserRouter } from 'react-router';
import { AuthProvider } from './contexts/AuthContext';
import { WorkshopProvider } from './contexts/WorkshopContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { WorkshopDetails } from './pages/WorkshopDetails';
import { Payment } from './pages/Payment';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { BookingHistory } from './pages/BookingHistory';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <WorkshopProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          {children}
        </div>
      </WorkshopProvider>
    </AuthProvider>
  );
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthProvider><Login /></AuthProvider>,
  },
  {
    path: '/register',
    element: <AuthProvider><Register /></AuthProvider>,
  },
  {
    path: '/',
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: '/workshop/:id',
    element: (
      <Layout>
        <WorkshopDetails />
      </Layout>
    ),
  },
  {
    path: '/payment/:id',
    element: (
      <Layout>
        <ProtectedRoute>
          <Payment />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/payment-success/:bookingId',
    element: (
      <Layout>
        <ProtectedRoute>
          <PaymentSuccess />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '/bookings',
    element: (
      <Layout>
        <ProtectedRoute>
          <BookingHistory />
        </ProtectedRoute>
      </Layout>
    ),
  },
  {
    path: '*',
    element: (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl mb-4">404 - Page Not Found</h1>
            <p className="text-gray-600">The page you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    ),
  },
]);