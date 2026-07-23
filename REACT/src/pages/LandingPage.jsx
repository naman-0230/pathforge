import { Link } from 'react-router-dom';
import Badge from '../components/Badge';
import '../styles/landing.css';
import PricingPreviewLanding from '../components/PricingPreviewLanding';

// LandingPage — converted from index.html.
// This page is almost entirely static (no clicks change anything on the page itself),
// so unlike the other pages there's no real state here — it's the simplest conversion:
// mostly just swapping <a href="pages/x.html"> for React Router's <Link to="/x">.
const steps = [
  { num: '01', title: 'Set your goal', text: 'Choose topics, set a deadline, and tell us how many hours a day you can put in. The system generates a personalised roadmap.' },
  { num: '02', title: 'Solve problems', text: 'Each problem has progressive hints, full solutions with dry runs, and visual explainers for trees, graphs and recursion.' },
  { num: '03', title: 'Weak point detection', text: 'The system tracks every hint you open and every solution you peek. It automatically shifts more problems to your weak patterns.' },
  { num: '04', title: 'Spaced revision', text: 'After finishing each topic, the system schedules revision sessions using SM-2. You\'ll never forget what you learned.' },
];

const features = [
  { icon: '⚡', title: 'Adaptive roadmap', text: 'Roadmap re-routes in real time based on your performance — like GPS for DSA prep.' },
  { icon: '🧠', title: 'Pattern-based hints', text: 'Hints don\'t spoil — they steer. 3–5 progressive clues that build intuition, not dependency.' },
  { icon: '📊', title: 'Topic analytics', text: 'Radar chart of your strengths. Know exactly which patterns to double down on before your interview.' },
  { icon: '🔁', title: 'Smart revision', text: 'Revision questions cover full topics efficiently. Multi-pattern problems so you don\'t waste time.' },
  { icon: '🎯', title: 'Confidence tracking', text: 'Rate yourself after each problem. The system uses it to weight your roadmap intelligently.' },
  { icon: '🌲', title: 'Visual dry runs', text: 'Trees, graphs, and recursion come with animated step-through visuals — not just code blocks.' },
];

export default function LandingPage() {
  return (
    <>
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-dot"></div>
          PathForge
        </div>
        <div className="nav-links">
          <a href="#how" className="btn">How it works</a>
          <Link to="/pricing" className="btn">Pricing</Link>
          <Link to="/login" className="btn">Log in</Link>
          <Link to="/onboarding" className="btn btn-primary">Get started free</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-eyebrow">
          <Badge type="purple" pill>Adaptive · Spaced · Smart</Badge>
        </div>
        <h1 className="hero-title">Stop grinding blindly.<br />Track what actually matters.</h1>
        <p className="hero-sub">Pick your topics, set your deadline, get a roadmap that adapts to your weak points — not a static checklist.</p>
        <div className="hero-cta">
          <Link to="/onboarding" className="btn btn-primary" style={{ padding: '10px 28px', fontSize: 15 }}>Build my roadmap</Link>
          <a href="#how" className="btn" style={{ padding: '10px 28px', fontSize: 15 }}>See how it works</a>
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><span className="stat-num">450+</span><span className="stat-lbl">Problems</span></div>
          <div className="hero-stat-div"></div>
          <div className="hero-stat"><span className="stat-num">18</span><span className="stat-lbl">Topics</span></div>
          <div className="hero-stat-div"></div>
          <div className="hero-stat"><span className="stat-num">3–5</span><span className="stat-lbl">Hints per problem</span></div>
          <div className="hero-stat-div"></div>
          <div className="hero-stat"><span className="stat-num">SM-2</span><span className="stat-lbl">Spaced revision</span></div>
        </div>
      </section>

      <section className="how" id="how">
        <div className="section-label">How it works</div>
        <h2 className="section-title">Four steps to DSA mastery</h2>
        <div className="steps-grid">
          {steps.map((s) => (
            <div className="step-card" key={s.num}>
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="features">
        <div className="section-label">Features</div>
        <h2 className="section-title">Everything a serious preparer needs</h2>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feat-card" key={f.title}>
              <div className="feat-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <PricingPreviewLanding />

      <section className="cta-section">
        <h2>Ready to stop guessing?</h2>
        <p>Build a roadmap that actually knows where you're weak.</p>
        <Link to="/onboarding" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: 15 }}>Get started — it's free</Link>
      </section>

      <footer className="footer">
        <div className="nav-logo"><div className="nav-logo-dot"></div>PathForge</div>
        <p style={{ fontSize: 13, color: 'var(--text-low)', marginTop: 8 }}>Built for serious DSA prep. Not just another checklist.</p>
      </footer>
    </>
  );
}
