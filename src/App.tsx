import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { ActiveWorkout } from './pages/ActiveWorkout';
import { SessionHistory } from './pages/SessionHistory';
import { Exercises } from './pages/Exercises';
import { Tutorials } from './pages/Tutorials';
import { AICoach } from './pages/AICoach';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { useEffect, useState } from 'react';
import { authService } from './services/auth.service';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuth(authService.isAuthenticated());
    
    // Apply theme on load
    const theme = localStorage.getItem("theme");
    if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  if (isAuth === null) return null; // Or a loading spinner

  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
             <Route index element={<Dashboard />} />
             <Route path="workout" element={<ActiveWorkout />} />
             <Route path="history" element={<SessionHistory />} />
             <Route path="exercises" element={<Exercises />} />
             <Route path="tutorials" element={<Tutorials />} />
             <Route path="coach" element={<AICoach />} />
             <Route path="settings" element={<Settings />} />
             
             {/* Fallback inside layout */}
             <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          
          {/* Global Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
