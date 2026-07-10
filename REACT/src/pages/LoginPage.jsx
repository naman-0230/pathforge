import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Button from '../components/Button';
import { supabase } from '../utils/supabaseClient.js';
import '../styles/auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || '/dashboard';

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      // Map Supabase error messages to user-friendly ones
      if (authError.message.includes('Invalid login credentials')) {
        setError('Wrong email or password. Please try again.');
      } else if (authError.message.includes('Email not confirmed')) {
        setError('Please confirm your email before logging in.');
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    // On success: AppContext's onAuthStateChange fires automatically,
    // pulls the user's data, and sets user state. Navigate to either
    // the page they were trying to reach, or dashboard.
    navigate(redirectTo);
  }

  return (
    <>
      <Nav
        right={
          <>
            <span style={{ fontSize: 13, color: 'var(--text-mid)' }}>No account?</span>
            <Link to="/signup" className="btn btn-primary btn-sm">Sign up free</Link>
          </>
        }
      />

      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Log in to continue your roadmap</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="field">
              <label htmlFor="password">
                Password
                <Link to="/forgot-password" className="field-link">Forgot?</Link>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  style={{ width: '100%', paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-low)',
                    cursor: 'pointer',
                    fontSize: 14,
                    padding: '4px 6px',
                    lineHeight: 1,
                  }}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                fontSize: 12,
                color: 'var(--red, #e35b5b)',
                background: 'rgba(227,91,91,0.08)',
                border: '1px solid rgba(227,91,91,0.2)',
                borderRadius: 6,
                padding: '8px 12px',
              }}>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </Button>
          </form>

          <div className="auth-divider"><span>or</span></div>

          <button
            className="btn auth-google"
            onClick={async () => {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${window.location.origin}/dashboard`,
                },
              });
              if (error) setError(error.message);
            }}
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <p className="auth-footer">
            Don't have an account? <Link to="/onboarding">Sign up free</Link>
          </p>
        </div>
      </div>
    </>
  );
}