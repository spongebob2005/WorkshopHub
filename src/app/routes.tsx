import { createBrowserRouter, Link } from 'react-router-dom';
import { LogoMark } from './components/Logo';
import { Navbar } from './components/Navbar';
import { AdminNavbar } from './components/AdminNavbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminProtectedRoute } from './components/AdminProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { WorkshopDetails } from './pages/WorkshopDetails';
import { QuizPage } from './pages/QuizPage';
import { Payment } from './pages/Payment';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { BookingHistory } from './pages/BookingHistory';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageWorkshops } from './pages/admin/ManageWorkshops';
import { ManageRegistrations } from './pages/admin/ManageRegistrations';
import { ManageUsers } from './pages/admin/ManageUsers';

const SkipLink = () => (
  <a
    href="#main"
    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
  >
    Skip to content
  </a>
);

const Footer = () => (
  <footer className="border-t border-gray-200">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div className="flex items-center gap-2.5">
        <LogoMark className="size-6 text-gray-900" />
        <span>WorkshopHub · LP-II mini project</span>
      </div>
      <nav className="flex gap-5" aria-label="Footer">
        <Link to="/" className="transition-colors hover:text-gray-900">Workshops</Link>
        <Link to="/bookings" className="transition-colors hover:text-gray-900">My bookings</Link>
        <span className="font-mono text-xs text-gray-400 tabular">© {new Date().getFullYear()}</span>
      </nav>
    </div>
  </footer>
);

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-gray-50">
      <SkipLink />
      <Navbar />
      <div id="main" className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-[100dvh] bg-gray-50">
      <SkipLink />
      <AdminNavbar />
      <div id="main">{children}</div>
    </div>
  );
};

const NotFound = () => (
  <main className="mx-auto flex min-h-[70dvh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
    <p className="eyebrow text-indigo-700">Error 404</p>
    <h1 className="mt-4 max-w-[18ch] text-5xl tracking-[-0.035em] text-gray-900 sm:text-6xl">
      This page <span className="text-indigo-700">isn't on the schedule.</span>
    </h1>
    <p className="mt-5 max-w-[50ch] text-gray-500">
      The link may be old, or the workshop may have been removed. The catalog has everything that's currently running.
    </p>
    <div className="mt-8 flex flex-wrap gap-3">
      <Link to="/" className="press rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
        Browse workshops
      </Link>
      <Link to="/bookings" className="rounded-lg px-4 py-2.5 text-sm text-gray-600 transition-colors hover:text-gray-900">
        View my bookings
      </Link>
    </div>
  </main>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
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
    path: '/workshop/:workshopId/quiz/:quizIndex',
    element: (
      <Layout>
        <QuizPage />
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
    path: '/admin',
    element: (
      <AdminLayout>
        <AdminProtectedRoute>
          <AdminDashboard />
        </AdminProtectedRoute>
      </AdminLayout>
    ),
  },
  {
    path: '/admin/workshops',
    element: (
      <AdminLayout>
        <AdminProtectedRoute>
          <ManageWorkshops />
        </AdminProtectedRoute>
      </AdminLayout>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <AdminLayout>
        <AdminProtectedRoute>
          <ManageUsers />
        </AdminProtectedRoute>
      </AdminLayout>
    ),
  },
  {
    path: '/admin/registrations',
    element: (
      <AdminLayout>
        <AdminProtectedRoute>
          <ManageRegistrations />
        </AdminProtectedRoute>
      </AdminLayout>
    ),
  },
  {
    path: '*',
    element: (
      <Layout>
        <NotFound />
      </Layout>
    ),
  },
]);