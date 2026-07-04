import { Link } from 'react-router-dom';

// Nav — the public top nav bar. `right` lets each page pass its own right-side content
// (different on login vs signup vs landing) while keeping the logo/structure identical.
export default function Nav({ right }) {
  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">
        <div className="nav-logo-dot"></div>
        PathForge
      </Link>
      <div className="nav-links">{right}</div>
    </nav>
  );
}
