import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { WorkshopProvider } from './contexts/WorkshopContext';

export default function App() {
  return (
    <AuthProvider>
      <WorkshopProvider>
        <RouterProvider router={router} />
        <Toaster />
      </WorkshopProvider>
    </AuthProvider>
  );
}