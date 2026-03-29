import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { InstallPrompt } from './components/PWA';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetails from './pages/PropertyDetails';
import Agents from './pages/Agents';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PropertyForm from './pages/PropertyForm';
import ProtectedRoute from './components/ProtectedRoute';

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Navbar currentPage="" onNavigate={() => {}} />
      <main>{children}</main>
      <Footer onNavigate={() => {}} />
    </div>
  );
}

function AppContent() {
  const { language } = useLanguage();
  
  return (
    <>
      <InstallPrompt language={language} />
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<MainLayout><Home onNavigate={() => {}} /></MainLayout>} />
              <Route path="/listings" element={<MainLayout><Listings onNavigate={() => {}} /></MainLayout>} />
              <Route path="/property/:id" element={<MainLayout><PropertyDetails propertyId="" onNavigate={() => {}} /></MainLayout>} />
              <Route path="/agents" element={<MainLayout><Agents /></MainLayout>} />
              <Route path="/about" element={<MainLayout><About /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
              <Route path="/services" element={<MainLayout><Services /></MainLayout>} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/properties/new" element={<ProtectedRoute><PropertyForm /></ProtectedRoute>} />
              <Route path="/admin/properties/edit/:id" element={<ProtectedRoute><PropertyForm /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
