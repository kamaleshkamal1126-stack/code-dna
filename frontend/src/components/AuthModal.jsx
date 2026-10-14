import React, { useState } from 'react';
import { X, Lock, User, Mail, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, authMode, setAuthMode, closeAuthModal, login, register } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (authMode === 'login') {
        await login(identifier, password);
      } else {
        await register(username, email, password);
      }
      closeAuthModal();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div className="modal-content animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(139, 92, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-purple-light)',
              }}
            >
              {authMode === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {authMode === 'login' ? 'Developer Login' : 'Create Account'}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                {authMode === 'login'
                  ? 'Access your saved C algorithms and persistent audit history'
                  : 'Join CODE DNA 3.0 to synchronize DSA projects'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="btn btn-secondary btn-sm"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fda4af',
              fontSize: '0.8125rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {authMode === 'register' ? (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Username
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="e.g. kamalesh_dev"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    className="form-input"
                    style={{ paddingLeft: '38px' }}
                    placeholder="student@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Username or Email
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="Enter username or email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                className="form-input"
                style={{ paddingLeft: '38px' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading
              ? 'Authenticating...'
              : authMode === 'login'
              ? 'Log In to Workspace'
              : 'Complete Registration'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
          {authMode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => { setAuthMode('register'); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-purple-light)', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => { setAuthMode('login'); setError(''); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-purple-light)', cursor: 'pointer', fontWeight: 600 }}
              >
                Log In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
