import { Routes, Route } from 'react-router-dom';
import { useParams } from 'react-router-dom';
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

// App — every page now has a real component. Compare this to the old setup where
// every .html file was its own physical file, linked with plain <a href="...">.
function ProblemPageRoute() {
  const { id } = useParams();
  return <ProblemPage key={id} />;
}

export default function App() {
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