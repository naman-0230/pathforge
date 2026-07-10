import { Routes, Route } from 'react-router-dom';
import { useParams } from 'react-router-dom';
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


function ProblemPageRoute() {
  const { id } = useParams();
  return <ProblemPage key={id} />;
}

// LoadingScreen — shown while Supabase checks for an existing session on
// app start (loading) or while pulling the user's data blob after login
// (syncing). Prevents a flash of empty/wrong state.
function LoadingScreen({ message }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg-base)',
      gap: 16,
    }}>
      <div style={{
        fontSize: 22,
        fontWeight: 600,
        color: 'var(--text-high)',
        letterSpacing: '-0.04em',
      }}>
        ⚒ PathForge
      </div>
      <div style={{
        fontSize: 13,
        color: 'var(--text-low)',
        fontFamily: 'var(--font-mono)',
      }}>
        {message}
      </div>
    </div>
  );
}

export default function App() {
  const { loading, syncing } = useApp();

  // Checking for existing session — don't render anything yet


if (loading) {
  return <MiniSkeleton />;
}

if (syncing) {
  return <LoadingSkeleton />;
}

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/roadmap" element={<RoadmapPage />} />
      <Route path="/problem/:id" element={<ProblemPageRoute />} />
      <Route path="/revision" element={<RevisionPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/fundamentals" element={<FundamentalsPage />} />
      <Route path="/fundamentals/:topicKey" element={<TopicFundamentalsPage />} />
    </Routes>
  );
} 