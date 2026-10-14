
import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, Eye, EyeOff, Mail, Lock, User, ArrowRight, Dna } from 'lucide-react';
import '../styles/Login.css';

export default function Login() {
  const { user, isGuest, login, register, loading } = useAuth();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (loading) return <div className="login-loading">Loading CODE DNA...</div>;
  if (user && !isGuest) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'register') await register(username, email, password);
      else await login(email, password);
    } catch (err) {
      setError(err.message || 'Unable to sign in. Check your details.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-page">
      <section className="login-showcase">
        <div className="login-brand">
          <div className="login-brand-icon"><Dna size={27} /></div>
          <span>CODE DNA <b>3.0</b></span>
        </div>
        <div className="login-hero">
          <span className="login-eyebrow">INTELLIGENT CODE ANALYSIS</span>
          <h1>Understand the<br />DNA of your <span>code.</span></h1>
          <p>Analyze algorithms, compare solutions, explore complexity, and discover what makes your code unique.</p>
          <div className="login-feature"><Code2 size={21} /><div><strong>Smart Code Analyzer</strong><small>Explore your code structure and logic.</small></div></div>
          <div className="login-feature"><Dna size={21} /><div><strong>Code Fingerprinting</strong><small>Study similarities between code samples.</small></div></div>
          <div className="login-feature"><ArrowRight size={21} /><div><strong>Learn. Analyze. Improve.</strong><small>Your coding journey starts here.</small></div></div>
        </div>
        <div className="login-footer">BUILT FOR CURIOUS MINDS AND DEVELOPERS</div>
      </section>

      <section className="login-form-side">
        <div className="login-card">
          <div className="login-mobile-brand"><Dna size={27} /> CODE DNA 3.0</div>
          <span className="login-eyebrow">{mode === 'login' ? 'WELCOME BACK' : 'CREATE YOUR ACCOUNT'}</span>
          <h2>{mode === 'login' ? 'Sign in to your workspace' : 'Join CODE DNA'}</h2>
          <p className="login-subtitle">{mode === 'login' ? 'Enter your details to continue.' : 'Create an account to get started.'}</p>

          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <label className="login-label">
                Username
                <div className="login-input-wrap">
                  <User size={18} />
                  <input type="text" placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} minLength={3} required />
                </div>
              </label>
            )}

            <label className="login-label">
              {mode === 'login' ? 'Username or email' : 'Email address'}
              <div className="login-input-wrap">
                <Mail size={18} />
                <input type={mode === 'login' ? 'text' : 'email'} placeholder={mode === 'login' ? 'Enter username or email' : 'you@example.com'} value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </label>

            <label className="login-label">
              Password
              <div className="login-input-wrap">
                <Lock size={18} />
                <input type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} minLength={mode === 'register' ? 6 : undefined} required />
                <button type="button" className="login-eye" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            {error && <div className="login-error">{error}</div>}

            <button className="login-submit" type="submit" disabled={busy}>
              {busy ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              {!busy && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="login-switch">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>
              {mode === 'login' ? 'Create account' : 'Sign in'}
            </button>
          </div>

          <div className="login-divider"><span>OR</span></div>
          <Link to="/" className="login-guest">Continue as guest</Link>
          <p className="login-security">Your coding workspace. Your learning journey.</p>
        </div>
      </section>
    </div>
  );
}
