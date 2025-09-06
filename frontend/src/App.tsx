import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';

import { LoadingSpinner } from './components/common/LoadingSpinner.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { useAuth } from './hooks/useAuth.ts';
import { usePageTitle } from './hooks/usePageTitle.ts';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { KanbanPage } from './pages/KanbanPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { ProjectDetailPage } from './pages/ProjectDetailPage.tsx';
import { ProjectSettingsPage } from './pages/ProjectSettingsPage.tsx';
import { ProjectsPage } from './pages/ProjectsPage.tsx';
import { SprintsPage } from './pages/SprintsPage.tsx';
import { TaskDetailsPage } from './pages/TaskDetailsPage.tsx';
import { TasksPage } from './pages/TasksPage.tsx';
import { TeamManagePage } from './pages/TeamManagePage.tsx';
import { theme } from './theme/theme.js';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          position: 'relative',
          zIndex: 1,
          paddingTop: '64px', // Add top padding to account for fixed navbar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

const AppRoutes: React.FC = () => {
  const { currentUser, loading } = useAuth();

  // This hook will automatically update the page title based on the current route
  usePageTitle();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/dashboard" /> : <LoginPage />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectDetailPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/team"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TeamManagePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProjectSettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/kanban"
        element={
          <ProtectedRoute>
            <AppLayout>
              <KanbanPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/tasks/:taskId"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TaskDetailsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/tasks"
        element={
          <ProtectedRoute>
            <AppLayout>
              <TasksPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId/sprints"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SprintsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
