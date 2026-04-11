import { Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import LoginPage from '@auth/pages/LoginPage';
import SignupPage from '@auth/pages/SignupPage';
import VerifyEmailPage from '@auth/pages/VerifyEmailPage';
import DashboardPage from '@dashboard/pages/DashboardPage';
import ExplorePage from '@club/pages/ExplorePage';
import EventsPage from '@club/pages/EventsPage';
import EventCreatePage from '@club/pages/EventCreatePage';
import EventDetailPage from '@club/pages/EventDetailPage';
import ClubsPage from '@club/pages/ClubsPage';
import SocietiesPage from '@club/pages/SocietiesPage';
import MembershipsPage from '@club/pages/MembershipsPage';
import ApprovalsPage from '@club/pages/ApprovalsPage';
import AuditPanelPage from '@club/pages/AuditPanelPage';
import GovernancePage from '@club/pages/GovernancePage';
import LeaderboardPage from '@club/pages/LeaderboardPage';
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
        <Route element={<SocietiesPage />} path="societies" />
        <Route element={<ApprovalsPage />} path="approvals" />
        <Route element={<MembershipsPage />} path="memberships" />
        <Route element={<AuditPanelPage />} path="audit" />
        <Route element={<GovernancePage />} path="governance" />
        <Route element={<LeaderboardPage />} path="leaderboard" />
        <Route element={<ProfilePage />} path="profile" />
        <Route element={<SettingsPage />} path="settings" />
        <Route element={<HelpPage />} path="help" />
      </Route>

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
