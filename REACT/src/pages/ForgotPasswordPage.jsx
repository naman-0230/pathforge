import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Button from '../components/Button';
import { supabase } from '../utils/supabaseClient.js';
import '../styles/auth.css';

// ForgotPasswordPage — sends a password reset email via Supabase.
// The email contains a link that redirects to /reset-password with
// a token in the URL. Supabase handles the token generation and
// validation — we just need to provide the redirect URL.
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        // After clicking the reset link in the email, the user lands here.
        // Supabase appends a token to the URL automatically.
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  return (
    <>
      <Nav
        right={
          <Link to="/login" className="btn btn-sm">Back to login</Link>
        }
      />

      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Reset your password</h1>
            <p>Enter your email and we'll send you a reset link.</p>
          </div>

          {sent ? (
            <div style={{
              padding: 20,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ fontSize: 32 }}>📬</div>
              <div style={{ fontSize: 14, color: 'var(--text-high)', fontWeight: 500 }}>
                Check your email
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-mid)', lineHeight: 1.6 }}>
                We sent a password reset link to <strong style={{ color: 'var(--text-high)' }}>{email}</strong>.
                Click the link in the email to set a new password.
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-low)', marginTop: 8 }}>
                Didn't get it? Check your spam folder, or{' '}
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-mid)',
                    cursor: 'pointer',
                    fontSize: 11,
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
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
                {loading ? 'Sending...' : 'Send reset link'}
              </Button>
            </form>
          )}

          <p className="auth-footer">
            Remember your password? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
}