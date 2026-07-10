import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import { useApp } from './context/AppContext.jsx';
import { LoadingSkeleton, MiniSkeleton } from './components/SkeletonScreen.jsx';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import RoadmapPage from './pages/RoadmapPage';
import ProblemPage from './pages/ProblemPage';
import RevisionPage from './pages/RevisionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import FundamentalsPage from './pages/FundamentalsPage';
import TopicFundamentalsPage from './pages/TopicFundamentalsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function ProblemPageRoute() {
  const { id } = useParams();
  return <ProblemPage key={id} />;
}

// ProtectedRoute — wraps any route that requires authentication.
// If the user is not logged in, redirects to /login and preserves
// the intended destination so login can redirect back after success.
function ProtectedRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

// PublicOnlyRoute — wraps routes that should NOT be accessible when
// already logged in (login, signup, onboarding). Redirects to dashboard.
function PublicOnlyRoute({ children }) {
  const { user } = useApp();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  const { loading, syncing } = useApp();

  if (loading) {
    return <MiniSkeleton />;
  }

  if (syncing) {
    return <LoadingSkeleton />;
  }

    return (
    <>
    <ScrollToTop />
    <Routes>
      {/* Landing page — redirect to dashboard if already logged in */}
      <Route path="/" element={
        <PublicOnlyRoute><LandingPage /></PublicOnlyRoute>
      } />

      {/* Public-only routes — redirect to dashboard if already logged in */}
      <Route path="/login" element={
        <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>
      } />
      <Route path="/signup" element={
        <PublicOnlyRoute><SignupPage /></PublicOnlyRoute>
      } />
      <Route path="/onboarding" element={
        <PublicOnlyRoute><OnboardingPage /></PublicOnlyRoute>
      } />
      <Route path="/forgot-password" element={
        <PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>
      } />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected routes — require authentication */}
      <Route path="/dashboard" element={
        <ProtectedRoute><DashboardPage /></ProtectedRoute>
      } />
      <Route path="/roadmap" element={
        <ProtectedRoute><RoadmapPage /></ProtectedRoute>
      } />
      <Route path="/problem/:id" element={
        <ProtectedRoute><ProblemPageRoute /></ProtectedRoute>
      } />
      <Route path="/revision" element={
        <ProtectedRoute><RevisionPage /></ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute><AnalyticsPage /></ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute><SettingsPage /></ProtectedRoute>
      } />
      <Route path="/fundamentals" element={
        <ProtectedRoute><FundamentalsPage /></ProtectedRoute>
      } />
      <Route path="/fundamentals/:topicKey" element={
        <ProtectedRoute><TopicFundamentalsPage /></ProtectedRoute>
      } />

      {/* Catch-all — redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </>
  );
}