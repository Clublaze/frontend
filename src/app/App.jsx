import AppProviders from '@/app/AppProviders';
import { selectAuthLoading } from '@auth/authSlice';
import { useAuth } from '@auth/hooks/useAuth';
import AppRoutes from '@/routes/AppRoutes';
import { useSelector } from 'react-redux';

function AppContent() {
  useAuth();
  const isLoading = useSelector(selectAuthLoading);

  if (isLoading) {
    return <div>Initializing session...</div>;
  }

  return <AppRoutes />;
}

function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}

export default App;
