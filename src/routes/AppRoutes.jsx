import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import LoginPage from '@auth/pages/LoginPage';
import SignupPage from '@auth/pages/SignupPage';
import VerifyEmailPage from '@auth/pages/VerifyEmailPage';
import ProtectedRoute from '@/routes/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <div>Dashboard</div>
          </ProtectedRoute>
        }
        path="/dashboard"
      />

      <Route element={<AuthLayout />}>
        <Route element={<Navigate replace to="/login" />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<SignupPage />} path="/signup" />
        <Route element={<VerifyEmailPage />} path="/verify-email" />
      </Route>

      <Route element={<Navigate replace to="/login" />} path="*" />
    </Routes>
  );
}

export default AppRoutes;
