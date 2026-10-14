
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Dna, Code2, GitCompare, ShieldCheck,
  Eye, EyeOff, Mail, Lock, User, ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';

export default function Login() {
  const {
    user, isGuest, isLoading, login, register
  } = useAuth();

  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return <div className="login-loading">Loading CODE DNA...</div>;
  }

  if (user && !isGuest) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(identifier.trim(), password);
      } else {
        await register(username.trim(), email.trim(), password);
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <section className="login-intro">
        <div className="login-brand">
          <div className="login-brand-icon"><Dna size={28} /></div>
          <span>CODE <b>DNA</b><small>3.0</small></span>
        </div>

        <div className="login-hero">
          <div className="login-tag">YOUR CODE. YOUR SIGNATURE.</div>
          <h1>Code smarter.<br /><span>Grow faster.</span></h1>
          <p>
            Understand your code, discover patterns, compare implementations,
            and strengthen your problem-solving skills.
          </p>

          <div className="login-features">
            <div><Code2 /><span><b>Code Analyzer</b><small>Explore code structure and metrics</small></span></div>
            <div><GitCompare /><span><b>Code Comparator</b><small>Compare code submissions</small></span></div>
            <div><ShieldCheck /><span><b>Your Workspace</b><small>Keep your projects and history</small></span></div>
          </div>
        </div>

        <div className="login-footer">CODE DNA 3.0 · DEVELOPER WORKSPACE</div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="login-mobile-brand"><Dna size={25} /> CODE DNA 3.0</div>

          <div className="login-heading">
            <div className="login-heading-icon">
              {mode === 'login' ? <Lock /> : <User />}
            </div>
            <h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
            <p>
              {mode === 'login'
                ? 'Sign in to continue to your workspace.'
                : 'Join CODE DNA and save your coding progress.'}
            </p>
          </div>

          {error && <div className="login-error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {mode === 'register' && (
              <>
                <label htmlFor="username">Username</label>
                <div className="login-input-wrap">
                  <User size={18} />
                  <input
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    minLength={3}
                    autoComplete="username"
                    required
                  />
                </div>

                <label htmlFor="email">Email address</label>
                <div className="login-input-wrap">
                  <Mail size={18} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </>
            )}

            {mode === 'login' && (
              <>
                <label htmlFor="identifier">Username or email</label>
                <div className="login-input-wrap">
                  <User size={18} />
                  <input
                    id="identifier"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="Enter username or email"
                    autoComplete="username"
                    required
                  />
                </div>
              </>
            )}

            <label htmlFor="password">Password</label>
            <div className="login-input-wrap">
              <Lock size={18} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                minLength={mode === 'register' ? 6 : undefined}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
              <button
                type="button"
                className="login-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button className="login-submit" type="submit" disabled={loading}>
              {loading
                ? 'Please wait...'
                : mode === 'login' ? 'Sign in to workspace' : 'Create account'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="login-switch">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
            >
              {mode === 'login' ? 'Create account' : 'Sign in'}
            </button>
          </div>

          <div className="login-security">
            <ShieldCheck size={15} />
            Passwords are securely hashed by the backend.
          </div>
        </div>
      </section>
    </div>
  );
}
