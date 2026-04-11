import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '@ds/components/Loader';
import { selectAuthLoading, selectUser } from '@store/authSlice';

function ProtectedRoute({ children }) {
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectAuthLoading);

  if (isLoading) {
    return <Loader fullScreen text="Loading..." />;
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
