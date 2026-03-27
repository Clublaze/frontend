import { createBrowserRouter, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsLoggedIn } from '@store/authSlice'

function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return children
}

function Page({ name }) {
  return (
    <div style={{ padding: 32, fontFamily: 'Arial' }}>
      <h2 style={{ color: '#1e3a8a' }}>{name}</h2>
      <p style={{ color: '#64748b' }}>This page is not built yet.</p>
    </div>
  )
}

export const router = createBrowserRouter([
  // Public routes 
  { path: '/login',    element: <Page name="Login Page" /> },
  { path: '/register', element: <Page name="Register Page" /> },

  // Authenticated routes 
  {
    path: '/',
    element: <ProtectedRoute><Page name="Dashboard Layout" /></ProtectedRoute>,
    children: [
      { index: true,                     element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard',               element: <Page name="Dashboard" /> },

      // Events
      { path: 'events',                  element: <Page name="Event List" /> },
      { path: 'events/new',              element: <Page name="Create Event" /> },
      { path: 'events/:id',              element: <Page name="Event Detail" /> },

      // Approvals
      { path: 'approvals',               element: <Page name="Approval Dashboard" /> },

      // Budget & ECR
      { path: 'budget/:eventId',         element: <Page name="Budget" /> },
      { path: 'ecr/:eventId',            element: <Page name="ECR" /> },

      // Membership
      { path: 'memberships/my',          element: <Page name="My Clubs" /> },
      { path: 'memberships/:clubId',     element: <Page name="Manage Members" /> },

      // Roles & Orgs (admin)
      { path: 'roles',                   element: <Page name="Role Management" /> },
      { path: 'organizations',           element: <Page name="Org Management" /> },

      // Audit
      { path: 'audit',                   element: <Page name="Audit Panel" /> },
    ],
  },

  // Discovery (logged in, no specific role needed)
  {
    path: '/discover',
    element: <ProtectedRoute><Page name="Discover Layout" /></ProtectedRoute>,
    children: [
      { index: true,             element: <Page name="Discover Page" /> },
      { path: 'clubs/:id',       element: <Page name="Club Profile" /> },
      { path: 'events/:id',      element: <Page name="Public Event" /> },
    ],
  },

  // Catch-all 
  { path: '*', element: <Page name="404 — Not Found" /> },
])