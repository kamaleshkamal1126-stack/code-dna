import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Play, Activity, Sparkles, Plus, GitCompare } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [healthStatus, setHealthStatus] = useState({ connected: true, engine: 'Checking...' });

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await api.health.check();
        setHealthStatus({
          connected: res.database?.connected ?? true,
          engine: res.c_analysis_engine?.status || 'Active',
        });
      } catch (err) {
        setHealthStatus({ connected: false, engine: 'Offline' });
      }
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = (path) => {
    switch (path) {
      case '/': return 'Executive Dashboard';
      case '/dsa-explorer': return 'DSA Explorer & Curriculum';
      case '/analyzer': return 'C Code Analyzer';
      case '/comparator': return 'Dual Code Comparator';
      case '/complexity-lab': return 'Algorithm Complexity Lab';
      case '/fingerprint': return 'Code Fingerprint & Hasher';
      case '/projects': return 'Saved DSA Projects';
      case '/history': return 'Analysis Audit History';
      case '/learning-center': return 'DSA Learning Center';
      case '/about': return 'About CODE DNA 3.0';
      default: return 'CODE DNA 3.0';
    }
  };

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        backgroundColor: 'rgba(10, 14, 26, 0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 80,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onToggleSidebar}
          className="btn btn-secondary btn-sm"
          style={{ display: 'none', padding: '8px' }}
          id="mobile-sidebar-toggle"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff' }}>
            {getPageTitle(location.pathname)}
          </h1>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Understand the Structure • Analyze the Complexity • Discover the Code
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Backend & C Engine Status indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: '20px',
            background: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: healthStatus.connected ? '#10b981' : '#f43f5e',
              boxShadow: healthStatus.connected ? '0 0 8px #10b981' : '0 0 8px #f43f5e',
            }}
          />
          <span style={{ fontWeight: 500 }}>
            {healthStatus.connected ? 'API Online' : 'API Connecting...'}
          </span>
          <span style={{ color: 'var(--border-subtle)' }}>|</span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
            {healthStatus.engine}
          </span>
        </div>

        {/* Action button */}
        <button
          onClick={() => navigate('/analyzer')}
          className="btn btn-primary btn-sm"
        >
          <Plus size={15} />
          <span>New Analysis</span>
        </button>
      </div>
    </header>
  );
}
