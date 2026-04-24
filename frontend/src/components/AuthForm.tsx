import React, { useState } from 'react';
import { login, signup } from '../api';

export const AuthForm: React.FC<{ onAuthSuccess: () => void }> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        await signup({ fullname, email, password });
      }
      onAuthSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ justifyContent: 'center', marginBottom: '1rem' }}>{isLogin ? 'Login' : 'Join Us'}</h2>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit} className="form-group" style={{ gap: '1rem' }}>
        {!isLogin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required={!isLogin}
            />
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label>Email Address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button type="submit" className="btn" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
          {loading ? 'Processing...' : (isLogin ? 'Login Securely' : 'Sign Up')}
        </button>

        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(null); }}
            style={{ color: 'var(--primary)', textDecoration: 'none' }}
          >
            {isLogin ? 'Create Account!' : 'Log right in!'}
          </a>
        </div>
      </form>
    </div>
  );
};
