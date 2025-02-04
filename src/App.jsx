import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/components/pages/dashboard/Dashboard';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  return (
    <ThemeProvider defaultTheme="light" storageKey="finance-theme">
      <MainLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        <Dashboard />
      </MainLayout>
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}

export default App;