import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Code2,
  GitCompare,
  TrendingUp,
  Fingerprint,
  FolderCode,
  History,
  GraduationCap,
  Info,
  Cpu,
  LogIn,
  LogOut,
  User,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user, isGuest, openAuthModal, logout } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dsa-explorer', label: 'DSA Explorer', icon: Compass },
    { to: '/analyzer', label: 'C Code Analyzer', icon: Code2, highlight: true },
    { to: '/comparator', label: 'Code Comparator', icon: GitCompare },
    { to: '/complexity-lab', label: 'Complexity Lab', icon: TrendingUp },
    { to: '/fingerprint', label: 'Code Fingerprint', icon: Fingerprint },
    { to: '/projects', label: 'Saved Projects', icon: FolderCode },
    { to: '/history', label: 'Analysis History', icon: History },
    { to: '/learning-center', label: 'DSA Learning Center', icon: GraduationCap },
    { to: '/about', label: 'About Project', icon: Info },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      <aside
        style={{
          width: 'var(--sidebar-width)',
          backgroundColor: 'var(--bg-canvas)',
          borderRight: '1px solid var(--border-subtle)',
          height: '100vh',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.25s ease',
        }}
        className="sidebar-container"
      >
        {/* Brand / Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
              }}
            >
              <Cpu size={20} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.125rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
                CODE DNA <span style={{ color: 'var(--accent-cyan)' }}>3.0</span>
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                DSA Analyzer Platform
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 12px' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', padding: '0 12px 8px', letterSpacing: '0.05em' }}>
            Main Modules
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 500,
                    textDecoration: 'none',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    backgroundColor: isActive
                      ? 'rgba(139, 92, 246, 0.16)'
                      : 'transparent',
                    borderLeft: isActive
                      ? '3px solid var(--accent-purple)'
                      : '3px solid transparent',
                    transition: 'all 0.15s ease',
                  })}
                >
                  <Icon size={18} color="currentColor" />
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(6, 182, 212, 0.15)',
                        color: 'var(--accent-cyan)',
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                      }}
                    >
                      C DSA
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Engine Status & User Bar */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)', background: 'rgba(10, 14, 26, 0.6)' }}>
          {/* C Engine Tag */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 10px',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              marginBottom: '12px',
              fontSize: '0.75rem',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ color: '#6ee7b7', fontWeight: 600 }}>C Engine Ready</span>
            <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: '0.65rem' }}>GCC Native</span>
          </div>

          {/* User profile / guest controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isGuest ? '#334155' : 'var(--accent-purple)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {user?.username ? user.username[0].toUpperCase() : 'G'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f1f5f9', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                  {user?.username || 'Guest'}
                </div>
                <div style={{ fontSize: '0.6875rem', color: isGuest ? 'var(--accent-amber)' : 'var(--accent-emerald)' }}>
                  {isGuest ? 'Guest Mode' : 'Verified Member'}
                </div>
              </div>
            </div>

            {isGuest ? (
              <button
                onClick={() => openAuthModal('login')}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                title="Log In or Register"
              >
                <LogIn size={13} />
                <span>Login</span>
              </button>
            ) : (
              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                title="Logout"
              >
                <LogOut size={13} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
