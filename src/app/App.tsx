import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { WorkshopProvider } from './contexts/WorkshopContext';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import ErrorBoundary from './components/ErrorBoundary';
import { MotionConfig } from 'motion/react';

export default function App() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
      <AuthProvider>
        <WorkshopProvider>
          <RouterProvider router={router} />
          <Toaster position="bottom-right" />
          <Analytics />
          <SpeedInsights />
        </WorkshopProvider>
      </AuthProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}