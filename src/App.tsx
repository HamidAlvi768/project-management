import './App.css';
import { MainLayout } from './components/layout';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Projects from './pages/Projects';
import Phases from './pages/Phases';
import Tasks from './pages/Tasks';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import { Provider } from 'react-redux';
import { store } from './store/store';

const user = {
  name: "John Smith",
  email: "john@example.com",
  role: "Admin",
  avatar: "https://github.com/shadcn.png"
};

function AppContent() {
  const location = useLocation();
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/customers') {
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
    }
    return [{ label: "Home" }];
  };

  return (
    <MainLayout
      user={user}
      breadcrumbs={getBreadcrumbs()}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/customers" replace />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/projects/:projectId/phases" element={<Phases />} />
        <Route path="/projects/:projectId/phases/:phaseId/tasks" element={<Tasks />} />
      </Routes>
    </MainLayout>
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
