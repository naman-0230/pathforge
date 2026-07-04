import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PlaceholderPage from './pages/PlaceholderPage';

// App — this is where every page in the site gets a URL.
// Compare this to the old setup: every .html file was its own physical file,
// and links between them were plain <a href="dashboard.html">.
// Now every "page" is a React component, and this list of <Route> is the map
// from a URL path to which component renders. Login/Signup are fully converted;
// everything else is a placeholder until we convert it.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PlaceholderPage title="Landing (index.html)" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/onboarding" element={<PlaceholderPage title="Onboarding" />} />
      <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
      <Route path="/roadmap" element={<PlaceholderPage title="Roadmap" />} />
      <Route path="/problem/:id" element={<PlaceholderPage title="Problem" />} />
    </Routes>
  );
}
