import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

export default function NotFoundPage() {
  const { user } = useApp();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-base)',
      gap: 16,
      textAlign: 'center',
      padding: 24,
    }}>
      <div style={{ fontSize: 56 }}>⚒</div>
      <h1 style={{
        fontSize: 22,
        fontWeight: 600,
        letterSpacing: '-0.04em',
        color: 'var(--text-high)',
      }}>
        Page not found
      </h1>
      <p style={{
        fontSize: 13,
        color: 'var(--text-mid)',
        maxWidth: 340,
        lineHeight: 1.7,
      }}>
        This page doesn't exist or was moved. Let's get you back on track.
      </p>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {user ? (
          <Link to="/dashboard" className="btn btn-primary">
            Go to Dashboard
          </Link>
        ) : (
          <Link to="/" className="btn btn-primary">
            Go home
          </Link>
        )}
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-low)', marginTop: 4 }}>
        PathForge · Error 404
      </p>
    </div>
  );
}