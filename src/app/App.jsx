import AppProviders from '@/app/AppProviders';
import Loader from '@ds/components/Loader';
import { selectAuthLoading } from '@store/authSlice';
import { useAuth } from '@auth/hooks/useAuth';
import AppRoutes from '@/routes/AppRoutes';
import { useSelector } from 'react-redux';

function AppContent() {
  useAuth();
  const isLoading = useSelector(selectAuthLoading);

  if (isLoading) {
    return <Loader fullScreen text="Initializing session..." />;
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
