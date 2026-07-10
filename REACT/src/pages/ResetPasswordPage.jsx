import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Button from '../components/Button';
import { supabase } from '../utils/supabaseClient.js';
import '../styles/auth.css';

// ResetPasswordPage — the user lands here after clicking the reset link
// in their email. Supabase automatically validates the token in the URL
// and establishes a session. We just need to call updateUser with the
// new password.
export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);

    // Redirect to dashboard after a brief moment
    setTimeout(() => navigate('/dashboard'), 2000);
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
            <h1>Set new password</h1>
            <p>Choose a strong password for your account.</p>
          </div>

          {success ? (
            <div style={{
              padding: 20,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}>
              <div style={{ fontSize: 32 }}>✅</div>
              <div style={{ fontSize: 14, color: 'var(--green)', fontWeight: 500 }}>
                Password updated
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-mid)' }}>
                Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="password">New password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Min 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
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

              <div className="field">
                <label htmlFor="confirm-password">Confirm password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirm-password"
                  placeholder="Type it again"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
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
                {loading ? 'Updating...' : 'Update password'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}