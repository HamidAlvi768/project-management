import './App.css';
import { MainLayout } from './components/layout';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Projects from './pages/Projects';
import Phases from './pages/Phases';
import Tasks from './pages/Tasks';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Settings from './pages/Settings';
import CustomUnits from './pages/Settings/CustomUnits';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { LoginPage } from './pages/Login';
import { ForgotPasswordPage } from './pages/ForgotPassword';
import { Dashboard } from './pages/Dashboard';

const user = {
  name: "John Smith",
  email: "john@example.com",
  role: "Admin",
  avatar: "https://github.com/shadcn.png"
};

// Simple authentication check - replace with your actual auth logic
const isAuthenticated = () => {
  return true; // For now, always return true to allow access
};

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function AppContent() {
  const location = useLocation();
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/dashboard') {
      return [
        { label: "Home", href: "/" },
        { label: "Dashboard" }
      ];
    } else if (path === '/customers') {
      return [
        { label: "Home", href: "/" },
        { label: "Customers" }
      ];
    } else if (path === '/projects') {
      return [
        { label: "Home", href: "/" },
        { label: "Projects" }
      ];
    } else if (path === '/inventory') {
      return [
        { label: "Home", href: "/" },
        { label: "Inventory" }
      ];
    } else if (path === '/settings') {
      return [
        { label: "Home", href: "/" },
        { label: "Settings" }
      ];
    } else if (path === '/settings/custom-units') {
      return [
        { label: "Home", href: "/" },
        { label: "Settings", href: "/settings" },
        { label: "Custom Units" }
      ];
    } else if (path.includes('/phases')) {
      return [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: "Phases" }
      ];
    } else if (path.includes('/tasks')) {
      return [
        { label: "Home", href: "/" },
        { label: "Projects", href: "/projects" },
        { label: "Phases", href: location.pathname.split('/tasks')[0] },
        { label: "Tasks" }
      ];
    } else if (path === '/login') {
      return [
        { label: "Home", href: "/" },
        { label: "Login" }
      ];
    } else if (path === '/forgot-password') {
      return [
        { label: "Home", href: "/" },
        { label: "Forgot Password" }
      ];
    }
    return [{ label: "Home" }];
  };

  return (
    <Routes>
      <Route
        path="/*"
        element={
          <MainLayout
            user={user}
            breadcrumbs={getBreadcrumbs()}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <ProtectedRoute>
                    <Inventory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/custom-units"
                element={
                  <ProtectedRoute>
                    <CustomUnits />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:projectId/phases"
                element={
                  <ProtectedRoute>
                    <Phases />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:projectId/phases/:phaseId/tasks"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </MainLayout>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </Provider>
  );
}

export default App;
