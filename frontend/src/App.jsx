
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import DsaExplorer from './pages/DsaExplorer';
import Analyzer from './pages/Analyzer';
import Comparator from './pages/Comparator';
import ComplexityLab from './pages/ComplexityLab';
import CodeFingerprint from './pages/Fingerprint';
import SavedProjects from './pages/SavedProjects';
import AnalysisHistoryPage from './pages/AnalysisHistory';
import LearningCenter from './pages/LearningCenter';
import About from './pages/About';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-content">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="content-body">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dsa-explorer" element={<DsaExplorer />} />
            <Route path="/analyzer" element={<Analyzer />} />
            <Route path="/comparator" element={<Comparator />} />
            <Route path="/complexity-lab" element={<ComplexityLab />} />
            <Route path="/fingerprint" element={<CodeFingerprint />} />
            <Route path="/projects" element={<SavedProjects />} />
            <Route path="/history" element={<AnalysisHistoryPage />} />
            <Route path="/learning-center" element={<LearningCenter />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
