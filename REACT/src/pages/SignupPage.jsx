import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Button from '../components/Button';
import { supabase } from '../utils/supabaseClient.js';
import { pushUserData, clearLocalData } from '../utils/sync.js';
import { saveJSON } from '../utils/storage.js';
import '../styles/auth.css';
import { usePageTitle } from '../utils/usePageTitle.js';

// getPasswordStrength — returns 0-4 score and a label.
// 0: empty, 1: too short, 2: weak, 3: good, 4: strong
function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '' };
  if (password.length < 8) return { score: 1, label: 'Too short', color: 'var(--red, #e35b5b)' };

  let score = 1;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const capped = Math.min(score, 4);
  const labels = ['', 'Too short', 'Weak', 'Good', 'Strong'];
  const colors = ['', 'var(--red, #e35b5b)', 'var(--amber, #f59e0b)', 'var(--green, #3fae63)', 'var(--green, #3fae63)'];
  return { score: capped, label: labels[capped], color: colors[capped] };
}

export default function SignupPage() {
  usePageTitle('Sign up');

  const location = useLocation();
  const onboardingData = location.state;

  const [name, setName] = useState(onboardingData?.name || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(password);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    // Sign up with Supabase. Name is stored in user_metadata so it's
    // part of the session object — no separate DB call needed to get it.
    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
          pending_onboarding: onboardingData ? {
            selectedTopics: onboardingData.selectedTopics,
            deadline: onboardingData.deadline,
            hoursPerDay: onboardingData.hoursPerDay,
            dsaLevel: onboardingData.dsaLevel,
          } : null,
        },
      },
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        setError('An account with this email already exists. Try logging in.');
      } else if (authError.message.includes('Password should be')) {
        setError('Password is too weak. Try adding numbers or symbols.');
      } else {
        setError(authError.message);
      }
      setLoading(false);
      return;
    }

    // Clear any leftover guest/old data from localStorage before setting
    // up the new account. Without this, the old guest session's progress
    // gets pushed as the new user's initial blob.
    clearLocalData();

    // Save onboarding data to localStorage so the app has it immediately.
    // This is the ONLY data the new account starts with — everything else
    // is blank. Gets synced to Supabase on the pushUserData() call below.
    if (onboardingData) {
      const { name: _n, ...roadmapPrefs } = onboardingData;
      saveJSON('pathforge:roadmapSetup', roadmapPrefs);
    }

    // With email confirmation ON, Supabase doesn't sign the user in
    // immediately. They need to click the confirmation link first.
    if (data.user && !data.session) {
      // Email confirmation required — user exists but no session yet.
      // Do NOT push data here — there's no authenticated session, so
      // the push would fail with 401. The first push happens
      // automatically after the user confirms their email and logs in
      // (AppContext pulls, finds nothing, user starts fresh, first
      // change triggers a push).
      setError(null);
      setLoading(false);
      setEmailSent(true);
      return;
    }

    // Session exists (confirmation disabled or auto-confirmed) —
    // push the initial blob and navigate.
    if (data.user && data.session) {
      await pushUserData(data.user.id);
    }

    navigate('/dashboard');
  }

  return (
    <>
      <Nav
        right={
          <>
            <span className="nav-helper-text">Already have an account?</span>
            <Link to="/login" className="btn btn-sm nav-cta">Log in</Link>
          </>
        }
      />

      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-header">
            <h1>{onboardingData ? 'Unlock your roadmap' : 'Create your account'}</h1>
            <p>
              {onboardingData
                ? `Your ${onboardingData.selectedTopics?.length || ''} topic roadmap is ready — just enter your email to save it.`
                : 'Start building your DSA roadmap in 2 minutes'}
            </p>
          </div>

          {emailSent ? (
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
                We sent a confirmation link to <strong style={{ color: 'var(--text-high)' }}>{email}</strong>.
                Click the link to activate your account, then come back and log in.
              </p>
              <Link to="/login" className="btn btn-primary" style={{ marginTop: 8 }}>
                Go to login →
              </Link>
            </div>
          ) : (
            <>
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="name">{onboardingData ? 'Your name' : 'Full name'}</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
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
                  <label htmlFor="password">Password</label>
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
                  {/* Password strength indicator */}
                  {password.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{
                        display: 'flex',
                        gap: 4,
                        marginBottom: 4,
                      }}>
                        {[1, 2, 3, 4].map((bar) => (
                          <div
                            key={bar}
                            style={{
                              flex: 1,
                              height: 3,
                              borderRadius: 2,
                              background: passwordStrength.score >= bar
                                ? passwordStrength.color
                                : 'var(--border)',
                              transition: 'background 0.2s ease',
                            }}
                          />
                        ))}
                      </div>
                      <span style={{
                        fontSize: 11,
                        color: passwordStrength.color,
                        fontFamily: 'var(--font-mono)',
                      }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
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
                  {loading
                    ? 'Creating account...'
                    : onboardingData ? 'Unlock my roadmap →' : 'Create account'}
                </Button>
                <p style={{ fontSize: 11, color: 'var(--text-low)', textAlign: 'center', marginTop: 4 }}>
                  By signing up, you agree to our Terms and Privacy Policy.
                </p>
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
            </>
          )}
          <p className="auth-footer">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </div>
    </>
  );
}