import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/guards/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import EventManagementPage from './pages/admin/EventManagementPage';
import TeamManagementPage from './pages/admin/TeamManagementPage';
import TaskManagementPage from './pages/admin/TaskManagementPage';
import ResourceManagementPage from './pages/admin/ResourceManagementPage';
import VendorManagementPage from './pages/admin/VendorManagementPage';
import ApprovalManagementPage from './pages/admin/ApprovalManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import ReportsPage from './pages/admin/ReportsPage';

// Coordinator Pages
import CoordinatorDashboardPage from './pages/coordinator/CoordinatorDashboardPage';
import CoordinatorEventsPage from './pages/coordinator/CoordinatorEventsPage';
import CoordinatorTeamsPage from './pages/coordinator/CoordinatorTeamsPage';
import CoordinatorTasksPage from './pages/coordinator/CoordinatorTasksPage';
import CoordinatorResourcesPage from './pages/coordinator/CoordinatorResourcesPage';
import CoordinatorVendorsPage from './pages/coordinator/CoordinatorVendorsPage';

// Team Lead Pages
import TeamLeadDashboardPage from './pages/teamlead/TeamLeadDashboardPage';
import TeamLeadMembersPage from './pages/teamlead/TeamLeadMembersPage';
import TeamLeadTasksPage from './pages/teamlead/TeamLeadTasksPage';

// Volunteer Pages
import VolunteerDashboardPage from './pages/volunteer/VolunteerDashboardPage';
import VolunteerTasksPage from './pages/volunteer/VolunteerTasksPage';
import VolunteerTeamPage from './pages/volunteer/VolunteerTeamPage';
import VolunteerEventsPage from './pages/volunteer/VolunteerEventsPage';

// Detail Pages
import EventDetailPage from './pages/EventDetailPage';

// Root redirector based on authentication and role
const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'COORDINATOR') return <Navigate to="/coordinator/dashboard" replace />;
  if (user?.role === 'TEAM_LEAD') return <Navigate to="/teamlead/dashboard" replace />;
  return <Navigate to="/volunteer/dashboard" replace />;
};

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes inside AppLayout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/events"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <EventManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/teams"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <TeamManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/tasks"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <TaskManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/resources"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ResourceManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/vendors"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <VendorManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ApprovalManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UserManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AuditLogsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />

            {/* Coordinator Routes */}
            <Route
              path="/coordinator/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR']}>
                  <CoordinatorDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coordinator/events"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR']}>
                  <CoordinatorEventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coordinator/teams"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR']}>
                  <CoordinatorTeamsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coordinator/tasks"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR']}>
                  <CoordinatorTasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coordinator/resources"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR']}>
                  <CoordinatorResourcesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/coordinator/vendors"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR']}>
                  <CoordinatorVendorsPage />
                </ProtectedRoute>
              }
            />

            {/* Team Lead Routes */}
            <Route
              path="/teamlead/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR', 'TEAM_LEAD']}>
                  <TeamLeadDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teamlead/members"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR', 'TEAM_LEAD']}>
                  <TeamLeadMembersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teamlead/tasks"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR', 'TEAM_LEAD']}>
                  <TeamLeadTasksPage />
                </ProtectedRoute>
              }
            />

            {/* Volunteer Routes */}
            <Route
              path="/volunteer/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR', 'TEAM_LEAD', 'VOLUNTEER']}>
                  <VolunteerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer/tasks"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR', 'TEAM_LEAD', 'VOLUNTEER']}>
                  <VolunteerTasksPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer/team"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR', 'TEAM_LEAD', 'VOLUNTEER']}>
                  <VolunteerTeamPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/volunteer/events"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COORDINATOR', 'TEAM_LEAD', 'VOLUNTEER']}>
                  <VolunteerEventsPage />
                </ProtectedRoute>
              }
            />

            {/* Event Console Detail Route */}
            <Route path="/events/:id" element={<EventDetailPage />} />
          </Route>

          {/* Root and Fallback */}
          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
