import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import ForgotPasswordPage from '@auth/pages/ForgotPasswordPage';
import LoginPage from '@auth/pages/LoginPage';
import ResetPasswordPage from '@auth/pages/ResetPasswordPage';
import SignupPage from '@auth/pages/SignupPage';
import VerifyEmailPage from '@auth/pages/VerifyEmailPage';
import DashboardPage from '@dashboard/pages/DashboardPage';
import ClubProfilePage from '@club/pages/ClubProfilePage';
import ExplorePage from '@club/pages/ExplorePage';
import EventsPage from '@club/pages/EventsPage';
import EventCreatePage from '@club/pages/EventCreatePage';
import EventDetailPage from '@club/pages/EventDetailPage';
import ClubsPage from '@club/pages/ClubsPage';
import SocietyProfilePage from '@club/pages/SocietyProfilePage';
import SocietiesPage from '@club/pages/SocietiesPage';
import MembershipsPage from '@club/pages/MembershipsPage';
import ApprovalsPage from '@club/pages/ApprovalsPage';
import AuditPanelPage from '@club/pages/AuditPanelPage';
import GovernancePage from '@club/pages/GovernancePage';
import LeaderboardPage from '@club/pages/LeaderboardPage';
import AdminUsersPage from '@/features/profile/pages/AdminUsersPage';
import ProfilePage from '@/features/profile/pages/ProfilePage';
import SettingsPage from '@/features/profile/pages/SettingsPage';
import HelpPage from '@/features/profile/pages/HelpPage';
import ProtectedRoute from '@/routes/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
        path="/dashboard"
      >
        <Route element={<DashboardPage />} index />
        <Route element={<ExplorePage />} path="explore" />
        <Route element={<EventsPage />} path="events" />
        <Route element={<EventCreatePage />} path="events/create" />
        <Route element={<EventDetailPage />} path="events/:eventId" />
        <Route element={<ClubsPage />} path="clubs" />
        <Route element={<ClubProfilePage />} path="clubs/:clubId" />
        <Route element={<SocietiesPage />} path="societies" />
        <Route element={<SocietyProfilePage />} path="societies/:societyId" />
        <Route element={<ApprovalsPage />} path="approvals" />
        <Route element={<MembershipsPage />} path="memberships" />
        <Route element={<AuditPanelPage />} path="audit" />
        <Route element={<GovernancePage />} path="governance" />
        <Route element={<LeaderboardPage />} path="leaderboard" />
        <Route element={<AdminUsersPage />} path="admin/users" />
        <Route element={<ProfilePage />} path="profile" />
        <Route element={<SettingsPage />} path="settings" />
        <Route element={<HelpPage />} path="help" />
      </Route>

      <Route element={<AuthLayout />}>
        <Route element={<Navigate replace to="/login" />} path="/" />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<ForgotPasswordPage />} path="/forgot-password" />
        <Route element={<ResetPasswordPage />} path="/reset-password" />
        <Route element={<SignupPage />} path="/signup" />
        <Route element={<VerifyEmailPage />} path="/verify-email" />
      </Route>

      <Route element={<Navigate replace to="/login" />} path="*" />
    </Routes>
  );
}

export default AppRoutes;
