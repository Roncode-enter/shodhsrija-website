
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Departments from './pages/Departments';
import Research from './pages/Research';
import Membership from './pages/Membership';
import Donations from './pages/Donations';
import ReportIssue from './pages/ReportIssue';
import Contact from './pages/Contact';

// Styles
import './styles/globals.css';

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('morning');

  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('shodhsrija-theme') || 'morning';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('shodhsrija-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Header theme={theme} onThemeChange={toggleTheme} />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/research" element={<Research />} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/donate" element={<Donations />} />
                <Route path="/report-issue" element={<ReportIssue />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>

            <Footer />
          </div>

          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
              },
            }}
          />
        </Router>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
