// SkeletonScreen — animated placeholder shapes that mimic the real layout.
// Two variants:
//   MiniSkeleton — shown during initial session check (is the user logged in?)
//   LoadingSkeleton — shown while pulling data blob after login (full layout)
//   DashboardSkeleton — shown inside Dashboard while data loads
//   PageSkeleton — generic page skeleton for Roadmap, Revision, Analytics

// Helper — renders a shimmer block with given dimensions
function Block({ width, height, style = {} }) {
  return (
    <div
      className="skeleton-block"
      style={{ width, height, ...style }}
    />
  );
}

// MiniSkeleton — centered logo + subtle pulse. Shown for ~200ms while
// Supabase checks if a stored session exists on app start.
export function MiniSkeleton() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: 16,
      background: 'var(--bg-base)',
    }}>
      <div style={{
        fontSize: 22,
        fontWeight: 600,
        color: 'var(--text-high)',
        letterSpacing: '-0.04em',
      }}>
        ⚒ PathForge
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Block width={100} height={12} />
        <Block width={60} height={12} />
      </div>
    </div>
  );
}

// SidebarSkeleton — mimics the real sidebar shape
function SidebarSkeleton() {
  return (
    <div className="sidebar" style={{ background: 'var(--bg-surface)' }}>
      <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
        <Block width={120} height={18} />
      </div>
      <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
            <Block width={18} height={18} style={{ borderRadius: 4 }} />
            <Block width={`${50 + i * 8}%`} height={14} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px' }}>
          <Block width={30} height={30} style={{ borderRadius: '50%' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Block width={80} height={12} />
            <Block width={120} height={10} />
          </div>
        </div>
      </div>
    </div>
  );
}

// LoadingSkeleton — full app shell skeleton shown while syncing data
// after login. Mimics the Dashboard layout.
export function LoadingSkeleton() {
  return (
    <div className="app-layout">
      <SidebarSkeleton />
      <main className="main-content">
        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <Block width={240} height={26} style={{ marginBottom: 8 }} />
          <Block width={320} height={14} />
        </div>

        {/* Stat cards */}
        <div className="stat-row">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card">
              <Block width={80} height={10} style={{ marginBottom: 8 }} />
              <Block width={50} height={22} style={{ marginBottom: 6 }} />
              <Block width={100} height={12} />
            </div>
          ))}
        </div>

        {/* Activity heatmap area */}
        <div className="section-box" style={{ marginBottom: 16, marginTop: 16 }}>
          <div className="section-box-header">
            <Block width={80} height={16} />
          </div>
          <div style={{ padding: '16px 20px' }}>
            <Block width="100%" height={60} />
          </div>
        </div>

        {/* Two column */}
        <div className="two-col">
          <div className="section-box">
            <div className="section-box-header">
              <Block width={140} height={16} />
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 2, 3].map((i) => (
                <Block key={i} width="100%" height={44} />
              ))}
            </div>
          </div>
          <div className="section-box">
            <div className="section-box-header">
              <Block width={100} height={16} />
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[1, 2].map((i) => (
                <Block key={i} width="100%" height={44} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// DashboardSkeleton — just the main content area, used inside Dashboard
// when data is still loading. Sidebar is already real at this point.
export function DashboardSkeleton() {
  return (
    <>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <Block width={240} height={26} style={{ marginBottom: 8 }} />
        <Block width={320} height={14} />
      </div>

      {/* Stat cards */}
      <div className="stat-row">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="stat-card">
            <Block width={80} height={10} style={{ marginBottom: 8 }} />
            <Block width={50} height={22} style={{ marginBottom: 6 }} />
            <Block width={100} height={12} />
          </div>
        ))}
      </div>

      {/* Activity area */}
      <div className="section-box" style={{ marginBottom: 16, marginTop: 16 }}>
        <div className="section-box-header">
          <Block width={80} height={16} />
        </div>
        <div style={{ padding: '16px 20px' }}>
          <Block width="100%" height={60} />
        </div>
      </div>

      {/* Two column */}
      <div className="two-col">
        <div className="section-box">
          <div className="section-box-header">
            <Block width={140} height={16} />
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2, 3].map((i) => (
              <Block key={i} width="100%" height={44} />
            ))}
          </div>
        </div>
        <div className="section-box">
          <div className="section-box-header">
            <Block width={100} height={16} />
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2].map((i) => (
              <Block key={i} width="100%" height={44} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// RoadmapSkeleton — mimics the roadmap topic sections
export function RoadmapSkeleton() {
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Block width={200} height={26} style={{ marginBottom: 8 }} />
        <Block width={280} height={14} />
      </div>

      {/* Overall progress */}
      <div className="section-box" style={{ marginBottom: 16 }}>
        <div style={{ padding: '16px 20px' }}>
          <Block width="100%" height={8} style={{ marginBottom: 8 }} />
          <Block width={120} height={12} />
        </div>
      </div>

      {/* Topic sections */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="section-box" style={{ marginBottom: 16 }}>
          <div className="section-box-header">
            <Block width={160} height={18} />
            <Block width={60} height={14} />
          </div>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[1, 2, 3, 4].map((j) => (
              <Block key={j} width="100%" height={40} />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

// RevisionSkeleton — mimics the revision page layout
export function RevisionSkeleton() {
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Block width={160} height={26} style={{ marginBottom: 8 }} />
        <Block width={340} height={14} />
      </div>

      {/* Summary strip */}
      <div className="section-box" style={{ marginBottom: 16, padding: '14px 20px', display: 'flex', gap: 24 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Block width={60} height={10} />
            <Block width={30} height={20} />
          </div>
        ))}
      </div>

      {/* Due now */}
      <div className="section-box" style={{ marginBottom: 16 }}>
        <div className="section-box-header">
          <Block width={80} height={16} />
          <Block width={50} height={14} />
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2].map((i) => (
            <Block key={i} width="100%" height={48} />
          ))}
        </div>
      </div>

      {/* Upcoming */}
      <div className="section-box">
        <div className="section-box-header">
          <Block width={100} height={16} />
        </div>
        <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <Block key={i} width="100%" height={44} />
          ))}
        </div>
      </div>
    </>
  );
}

// AnalyticsSkeleton — mimics chart areas
export function AnalyticsSkeleton() {
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Block width={180} height={26} style={{ marginBottom: 8 }} />
        <Block width={260} height={14} />
      </div>

      <div className="two-col" style={{ marginBottom: 16 }}>
        <div className="section-box">
          <div className="section-box-header">
            <Block width={120} height={16} />
          </div>
          <div style={{ padding: 20 }}>
            <Block width="100%" height={200} style={{ borderRadius: 8 }} />
          </div>
        </div>
        <div className="section-box">
          <div className="section-box-header">
            <Block width={140} height={16} />
          </div>
          <div style={{ padding: 20 }}>
            <Block width="100%" height={200} style={{ borderRadius: 8 }} />
          </div>
        </div>
      </div>

      <div className="section-box">
        <div className="section-box-header">
          <Block width={160} height={16} />
        </div>
        <div style={{ padding: 20 }}>
          <Block width="100%" height={160} />
        </div>
      </div>
    </>
  );
}

// PageSkeleton — generic fallback for any page
export function PageSkeleton() {
  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Block width={200} height={26} style={{ marginBottom: 8 }} />
        <Block width={300} height={14} />
      </div>
      <div className="section-box">
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Block key={i} width="100%" height={40} />
          ))}
        </div>
      </div>
    </>
  );
}