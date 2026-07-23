# 🧠 PathForge — Adaptive DSA Tracker

**Stop grinding blindly. Build a roadmap that adapts to you.**

PathForge is a full-stack DSA preparation tracker that generates a personalised, adaptive problem roadmap based on your topics, deadline, and daily availability — and continuously recalibrates itself based on your weak points.

Built for Indian students preparing for placement interviews at companies like TCS, Infosys, Wipro, Amazon, Microsoft, and more.

🔗 **Live:** [pathforge.vercel.app](https://pathforge.vercel.app)

---

## 📸 Screenshots

> _Add screenshots of Dashboard, Problem Page (reading + coding mode), Roadmap, Analytics, Pricing, and Interview Sim here._

---

## ✨ Features

### 🗺️ Adaptive Roadmap
- Pick your topics (8 DSA topics, 80+ sections) and set a deadline
- Get a day-by-day problem plan that reroutes as you progress
- Roadmap quietly reorders based on performance — like GPS for DSA prep
- Curriculum-ordered: Arrays → Strings → Stacks → Recursion → LinkedLists → Trees → Graphs → DP

### 🎯 Weak Point Detection
- Tracks every hint opened, every solution peeked, every confidence rating
- Automatically weights struggling patterns higher in your roadmap
- Per-topic and per-section granularity — "you're weak at Sliding Window" not just "Arrays"

### 💡 Progressive Hints
- 3–5 hints per problem, from directional nudges to full approach reveals
- Gated intentionally — hints don't spoil, they steer

### 📝 Full Solutions with Dry Runs
- 2–3 approaches per problem with step-through tables
- Visual explainers for trees, graphs, and recursion
- Language-tabbed code blocks (Java, C++, Python) with syntax highlighting

### 💻 Inline Code Editor
- CodeMirror 6 editor with syntax highlighting, bracket matching, auto-indent
- Supports C++, Java, Python
- LeetCode-style class-based test cases (`class Solution { ... }`)
- Run against visible test cases, Submit against all (including hidden)
- Auto-marks problems as solved when all tests pass
- Mode-based layout: reading mode ↔ coding mode with 500ms orchestrated transition
- Draggable split pane — user adjusts left/right column widths
- Collapsible test results panel with its own height-adjustable divider
- Code autosaved per problem per language to localStorage
- Available in Problem Page, Weekly Tests, Custom Tests, and Interview Simulations

### 🔁 Spaced Revision (SM-2)
- After finishing each section, revision sessions are scheduled using the SM-2 algorithm
- Not fixed intervals — adapts based on your confidence ratings
- Section-level + topic-level + manual-flag-triggered revision
- Configurable pacing presets: Aggressive / Balanced / Relaxed / Custom

### 📊 Confidence Self-Rating
- Rate each problem 1–4 (Clueless → Easy) after solving
- Feeds directly into the weak point engine and revision scheduling
- Frozen at first signal — never overwritten retroactively

### 🔒 Solution Gate
- Solution gated behind configurable attempt timer + confidence rating
- Timer scales by difficulty (Easy shorter, Hard longer)
- Checkbox confirms genuine attempt — so the system knows WHY you opened it
- Optional approach-journal nudge ("sketch your approach before viewing")
- Failure archive: captures WHY you peeked (pattern recognition gap, stuck on implementation, etc.)

### 📈 Analytics Dashboard
- Topic strength radar chart
- Weak point ranking across all sections
- Activity trend (8-week view)
- Difficulty breakdown
- Pattern training accuracy + weakness ranking
- Drill activity history
- Thinking time analysis
- "Why you open solutions" categorical breakdown
- Approach library — your personal cheatsheet by pattern
- Per-feature analytics: Weekly Tests, Custom Tests, DSA Mocks, Interview Sims
- Code editor performance trend charts per feature

### 🔥 Streak + Activity Heatmap
- GitHub-style contribution heatmap (17-week view)
- Current streak tracking with freeze option (vacation mode)
- Achievement system with trophies for milestones

### 🧩 Pattern Training
- Identify which DSA pattern a problem requires (not solve it — recognize it)
- Tracks per-pattern accuracy over time
- Weak pattern detection → auto-generates focused drills
- Drill recommendations appear on dashboard when miss rate is high

### 🎯 Interview Simulation
- Timed sessions (30/45/60 min) with 1-3 problems
- Approach-first: must write approach (≥10 chars) before editor unlocks
- No hints, no solution access — raw interview conditions
- Post-session reflection: "What did you get right? Where did you get stuck?"
- Auto-generated interviewer-style feedback (rule-based heuristics)
- Code editor integrated — editor results factor into objective scoring
- Free tier: 1 simulation per week. Basic+: unlimited.

### 🧪 Weekly Tests
- Recurring structured tests on your configured day of the week
- 3 problems drawn from sections you've actually studied
- Balanced difficulty (1 Easy, 1 Medium, 1 Hard when possible)
- Combined timer — forces time allocation across problems
- Code editor integrated with combined scoring (editor pass priority)
- Skip tracking with escalating nudge messages
- History + analytics on Analytics page

### 🎯 Custom Tests
- Create reusable test templates with custom filters
- Topic, difficulty, pattern, problem count, duration — all configurable
- Run tests from templates on demand
- Code editor integrated with same combined scoring
- Session history + per-template performance tracking

### 📝 DSA Mock Tests
- 150+ theory + concept MCQ questions across all 8 DSA topics
- Tests understanding, not implementation (complexity, behavior, code output, tracing)
- Three goal modes: Interview / Viva / General
- Practice mode (free navigation, per-question feedback) + Test mode (timed, submit-only)
- Section-level subcategory filtering
- Fundamentals deep-links to existing DSA content
- Per-topic + per-section weak point detection
- Goal-mode performance split analytics
- Gated behind Advanced tier with 3 sample questions for free/basic preview

### 🧮 Aptitude & Logical Reasoning
- Separate add-on (₹99, lifetime, stackable with any tier)
- 90+ seed questions across Quant, LR, Verbal (34 subcategories)
- Practice mode + Test mode (mixed and sectional)
- Fundamentals articles per subcategory with short tricks and theory
- Section-based practice with subcategory selection
- Per-category + per-subcategory analytics
- Free navigation in practice — skip, come back, submit with unattempted tracking

### 📖 Fundamentals
- Per-topic, per-section theory articles in Markdown
- Read-tracking per section (mark as read, date recorded)
- Deep-links from problem pages, mock test questions, and roadmap
- TOC sidebar with active-section highlighting via IntersectionObserver
- Syntax-highlighted code blocks (react-syntax-highlighter + oneDark theme)

### 📝 Notes & Approach Journal
- Per-problem freeform Markdown notes with edit/preview toggle
- Per-problem approach textarea (write BEFORE viewing solution)
- Previous-attempt approach shown as memory jogger on re-visits
- Approach locked after solution is viewed (prevents post-hoc rewriting)
- Time-to-first-write tracking for thinking time analytics

### ⏰ Reminders
- Local reminders that fire while app is open
- Optional browser notifications (Notification API)
- Types: Daily quota, Weekly review, Streak protection
- Master on/off switch (vacation mode)
- Max 5 reminders, configurable time + day

### 🏆 Achievements
- Trophy-based achievement system for milestones
- Auto-detected on dashboard load (up to 3 shown per visit)
- Achievement shelf on dashboard + dedicated achievements page
- Streak milestones, solve count milestones, topic completion, etc.

### 💰 Pricing & Tier System
- Three tiers: Free (₹0) → Basic (₹199/6mo) → Advanced (₹399/6mo)
- Aptitude add-on: ₹99 (lifetime, stackable)
- Manual payment collection (UPI + WhatsApp verification)
- Supabase Realtime: user's app auto-detects tier changes within 1-2 seconds
- Pending upgrades table for tracking payment verification
- Tier expiry banner on dashboard (7-day warning + 3-day grace period)
- Auto-downgrade to free after grace period
- Upgrade cost = difference (Basic→Advanced = ₹200, not ₹399)
- Feature comparison table + FAQ on public /pricing page
- Razorpay-ready abstraction layer (one constant to swap)

---

## 🏗️ Architecture

### Frontend
- **React 18** with Vite for fast HMR and optimized builds
- **React Router v6** for client-side routing (SPA)
- **CodeMirror 6** for the inline code editor (C++/Java/Python)
- **react-syntax-highlighter** with oneDark theme for code display
- **react-markdown** + remark-gfm for Markdown rendering
- **react-day-picker** for date selection
- **CSS Custom Properties** design system (no CSS-in-JS, no Tailwind)

### Backend
- **Supabase** for auth, database, storage, and Realtime
- **PostgreSQL** via Supabase with Row Level Security (RLS)
- **Judge0 Community Edition** for code execution (free hosted API)

### Data Architecture (Option C — Hybrid)

```
┌─────────────────────────────────────────────────────┐
│                    SUPABASE                          │
│                                                     │
│  auth.users        → Real auth (email + Google)     │
│  user_tier         → Server-authoritative tier      │
│                      (RLS: read-only for clients)   │
│  user_data         → JSON blob per user             │
│                      (entire localStorage snapshot)  │
│  user_usage        → Event tracking (append-only)   │
│  code_submissions  → Editor submission history      │
│  pending_upgrades  → Payment verification queue     │
│                                                     │
│  Realtime enabled on: user_tier                     │
└─────────────────────────────────────────────────────┘
            ↕ push/pull (debounced 3s)
┌─────────────────────────────────────────────────────┐
│                  localStorage                        │
│                                                     │
│  pathforge:problem:{id}     → per-problem progress  │
│  pathforge:preferences      → user preferences      │
│  pathforge:roadmapSetup     → roadmap configuration │
│  pathforge:activity:log     → daily solve counts    │
│  pathforge:revision:*       → SM-2 schedule state   │
│  pathforge:codeEditor:*     → saved code per problem│
│  pathforge:aptitude:*       → aptitude session data │
│  pathforge:dsaMocks:*       → mock test data        │
│  pathforge:interviewSim:*   → sim session history   │
│  pathforge:weeklyTests:*    → weekly test history   │
│  ... (40+ keys total)                               │
└─────────────────────────────────────────────────────┘
            ↕ read/write (synchronous)
┌─────────────────────────────────────────────────────┐
│                   React App                          │
│                                                     │
│  utils/*.js read/write localStorage directly         │
│  No utils file knows about Supabase                  │
│  sync.js is the ONLY bridge between the two          │
└─────────────────────────────────────────────────────┘
```

**Why this architecture:**
- Auth is fully normalized (Supabase auth + RLS)
- Tier is server-authoritative (client can't self-upgrade)
- Progress data uses blob sync (zero changes to existing utils)
- All reads are single-user, no cross-user querying needed
- Last-write-wins conflict resolution (acceptable for solo study tool)
- Migration path to normalized schema designed but not needed at current scale

### Code Execution Pipeline

```
User writes code in CodeMirror
  → CodeEditorPanel manages state
  → On Run/Submit: executeCode() called
    → Language-specific harness wraps user's class Solution
      with a main() that reads JSON input, calls method, prints JSON output
    → Wrapped code sent to Judge0 CE API (free, hosted)
    → Response parsed: compile error / runtime error / TLE / output
    → Output compared against expected via deep equality
    → Per-test-case pass/fail returned
  → Results displayed in TestResultsPanel
  → If all hidden tests pass on Submit → auto-marks problem solved
```

**Harness architecture:**
```
utils/codeExecutor/
├── index.js          → Public API (adapter selection + orchestration)
├── adapters/
│   ├── judge0.js     → Judge0 CE HTTP client (current)
│   └── piston.js     → Piston adapter (ready for self-hosted)
└── harness/
    ├── cpp.js        → C++ wrapper (embedded JSON parser)
    ├── java.js       → Java wrapper (embedded JSON parser)
    └── python.js     → Python wrapper (uses built-in json)
```

---

## 🗂️ Project Structure

```
src/
├── context/
│   └── AppContext.jsx           # Global state: user, tier, roadmap, Realtime
│
├── data/
│   ├── problems.js              # 450+ problem metadata (id, topic, section, pattern, difficulty)
│   ├── problemDetails.js        # Full write-ups (hints, solutions, dry runs) per problem
│   ├── topics.js                # 8 topics with ordered sections
│   ├── fundamentals.js          # Fundamentals content loader
│   ├── fundamentals-content/    # Markdown articles per topic
│   ├── aptitude/
│   │   ├── questions.js         # 90+ aptitude MCQs with subcategories
│   │   └── fundamentals/        # Aptitude fundamentals markdown stubs
│   ├── dsaMocks/
│   │   └── questions.js         # 150+ DSA theory MCQs
│   └── testCases/
│       ├── arrays/              # Test case JSONs per problem (organized by topic)
│       ├── strings/
│       └── ...
│
├── utils/
│   ├── storage.js               # localStorage abstraction (loadJSON/saveJSON)
│   ├── sync.js                  # Supabase ↔ localStorage bridge
│   ├── supabaseClient.js        # Supabase client initialization
│   ├── tierService.js           # Server-authoritative tier + usage tracking
│   ├── tierGate.js              # Feature access checks + pricing config
│   ├── tierRealtime.js          # Supabase Realtime subscription for tier changes
│   ├── upgradeFlow.js           # Payment flow abstraction (manual → Razorpay ready)
│   ├── progress.js              # Problem solved state + signals
│   ├── activity.js              # Activity log, streaks, heatmap data
│   ├── revision.js              # SM-2 spaced revision scheduling
│   ├── sm2.js                   # SM-2 algorithm implementation
│   ├── weakPoints.js            # Weak point scoring engine
│   ├── roadmapGenerator.js      # Adaptive roadmap generation + day plan
│   ├── adaptiveEngine.js        # Performance-based problem reordering
│   ├── preferences.js           # User preferences (gate, revision, etc.)
│   ├── aptitude.js              # Aptitude session engine
│   ├── aptitudeFundamentals.js  # Aptitude fundamentals loader
│   ├── dsaMocks.js              # DSA mock tests session engine
│   ├── interviewSim.js          # Interview simulation engine + feedback
│   ├── weeklyTests.js           # Weekly test generation + scoring
│   ├── customTests.js           # Custom test templates + sessions
│   ├── patternEngine.js         # Pattern training session engine
│   ├── drillEngine.js           # Focused drill generation
│   ├── fundamentalsRead.js      # Fundamentals read tracking
│   ├── achievements.js          # Achievement detection + tracking
│   ├── codeEditorState.js       # Code editor localStorage helpers
│   ├── testCaseLoader.js        # Dynamic test case JSON loading
│   ├── codeExecutor/            # Code execution pipeline
│   │   ├── index.js             # Public API
│   │   ├── adapters/            # Judge0 + Piston adapters
│   │   └── harness/             # C++/Java/Python wrappers
│   └── ...
│
├── components/
│   ├── Sidebar.jsx              # Main navigation sidebar
│   ├── CodeEditor/              # CodeMirror 6 abstraction
│   ├── CodeEditorPanel.jsx      # Full editor workspace
│   ├── CompactTrackingPanel.jsx # Coding-mode tracking flow
│   ├── TestResultsPanel.jsx     # Test case results display
│   ├── SessionLoader.jsx        # Animated session loading screen
│   ├── PricingTierCard.jsx      # Reusable tier card
│   ├── TierPlanCard.jsx         # Settings tier management
│   ├── TierExpiryBanner.jsx     # Dashboard expiry warning
│   ├── UpgradeSuccessToast.jsx  # Realtime upgrade celebration
│   └── ... (40+ components)
│
├── pages/
│   ├── LandingPage.jsx          # Public landing (/)
│   ├── PricingPage.jsx          # Public pricing (/pricing)
│   ├── CheckoutPage.jsx         # Payment flow (/checkout)
│   ├── DashboardPage.jsx        # Main dashboard
│   ├── RoadmapPage.jsx          # Full roadmap view
│   ├── ProblemPage.jsx          # Problem solver (reading + coding mode)
│   ├── AnalyticsPage.jsx        # Analytics hub
│   ├── SettingsPage.jsx         # Settings + tier management
│   ├── SimulatePage.jsx         # Interview simulation
│   ├── WeeklyTestPage.jsx       # Weekly structured tests
│   ├── CustomTestRunPage.jsx    # Custom test execution
│   ├── AptitudePage.jsx         # Aptitude hub
│   ├── DsaMocksPage.jsx         # DSA mock tests hub
│   └── ... (20+ pages)
│
├── styles/
│   ├── global.css               # CSS variables + resets
│   ├── app.css                  # Layout + shared component styles
│   ├── codeEditor.css           # Code editor + test results
│   ├── pricing.css              # Pricing + checkout + tier cards
│   └── ... (15+ CSS files)
│
├── App.jsx                      # Route dispatcher
└── main.jsx                     # Entry point
```

---

## 🔐 Security Model

### Authentication
- Supabase Auth (email/password + Google OAuth)
- JWT-based sessions with auto-refresh
- Email confirmation required for new accounts

### Tier Enforcement
- **Server-authoritative:** `user_tier` table has no client UPDATE policy
- Client reads tier via `fetchUserTier()` — cannot self-upgrade
- Tier changes happen ONLY via SQL Editor (manual) or Edge Functions (future Razorpay webhook)
- `canAccess(feature, tier)` checks are client-side (UX gating, not security)
- Even if user modifies frontend to bypass `canAccess()`, server-side usage tracking still enforces limits

### Row Level Security (RLS)
- Every table has RLS enabled
- Users can only read/write their own data
- `user_tier`: SELECT only (no client writes)
- `pending_upgrades`: SELECT + INSERT only (no client UPDATE/DELETE)
- `code_submissions`: SELECT + INSERT only
- `user_usage`: SELECT + INSERT only (append-only event log)

### Code Execution
- User code runs on Judge0 CE (external service) — never on our servers
- Sandboxed execution with 3-second timeout + 128MB memory limit
- User code is wrapped in a harness — they write `class Solution`, harness adds `main()`
- No filesystem access, no network access from executed code

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Supabase account (free tier works)
- Docker Desktop (optional — for self-hosted code execution via Piston)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pathforge.git
cd pathforge/react

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase URL + anon key
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Code executor — Judge0 CE (free, hosted, no key needed)
VITE_CODE_EXECUTOR_ADAPTER=judge0
VITE_JUDGE0_URL=https://ce.judge0.com

# Optional: Judge0 via RapidAPI (paid, reliable)
# VITE_JUDGE0_URL=https://judge0-ce.p.rapidapi.com
# VITE_JUDGE0_KEY=your-rapidapi-key
```

### Supabase Setup

Run these SQL commands in your Supabase SQL Editor:

```sql
-- User tier table (server-authoritative)
create table public.user_tier (
  user_id uuid references auth.users(id) on delete cascade primary key,
  tier text not null default 'free',
  tier_expires_at timestamptz,
  aptitude_access boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.user_tier enable row level security;

create policy "Users can view own tier"
  on public.user_tier for select
  to authenticated
  using (auth.uid() = user_id);

-- Auto-create tier row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_tier (user_id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- User data blob (sync)
create table public.user_data (
  id uuid references auth.users(id) on delete cascade primary key,
  blob jsonb not null default '{}',
  blob_version integer not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

create policy "Users own data"
  on public.user_data for all
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Usage tracking (append-only)
create table public.user_usage (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  event_type text not null,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

alter table public.user_usage enable row level security;

create policy "Users can view own usage"
  on public.user_usage for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own usage"
  on public.user_usage for insert
  to authenticated
  with check (auth.uid() = user_id);

grant select, insert on public.user_usage to authenticated;

-- Code submissions
create table public.code_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  problem_id text not null,
  language text not null,
  submission_type text not null,
  status text not null,
  passed_count integer,
  total_count integer,
  execution_time_ms integer,
  code_snippet text,
  first_failed_test_id integer,
  created_at timestamptz not null default now()
);

alter table public.code_submissions enable row level security;

create policy "Users can view own submissions"
  on public.code_submissions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own submissions"
  on public.code_submissions for insert
  to authenticated
  with check (auth.uid() = user_id);

grant select, insert on public.code_submissions to authenticated;

-- Pending upgrades
create table public.pending_upgrades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  requested_tier text not null,
  price_paid_inr integer,
  transaction_id text,
  notes text,
  status text not null default 'pending',
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  admin_notes text,
  from_tier text,
  from_aptitude_access boolean
);

alter table public.pending_upgrades enable row level security;

create policy "Users can view own upgrade requests"
  on public.pending_upgrades for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own upgrade requests"
  on public.pending_upgrades for insert
  to authenticated
  with check (auth.uid() = user_id);

grant select, insert on public.pending_upgrades to authenticated;

-- Enable Realtime for tier changes
alter publication supabase_realtime add table public.user_tier;
```

### Development

```bash
npm run dev
```

Open `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview  # local preview of production build
```

### Deploy

The app deploys to **Vercel** (or any static host):

```bash
# Via Vercel CLI
npm i -g vercel
vercel

# Or connect your GitHub repo to Vercel for auto-deploys
```

---

## 💰 Monetization

### Current: Manual Payment Collection
1. User selects tier on `/checkout?tier=basic|advanced|aptitude_addon`
2. Pays via UPI to configured account
3. Sends screenshot to WhatsApp
4. Admin verifies + runs SQL to upgrade tier
5. Supabase Realtime pushes change to user's app instantly

### Future: Razorpay Integration
- `upgradeFlow.js` has `ADAPTER = 'manual'` constant
- Change to `ADAPTER = 'razorpay'` + implement `submitRazorpayRequest()`
- Webhook receives payment confirmation → Edge Function upgrades tier
- Zero UI changes needed — abstraction handles the swap

---

## 📋 Admin Operations

### Upgrade a user
```sql
-- Find user
SELECT id FROM auth.users WHERE email = 'user@example.com';

-- Upgrade to Advanced + Aptitude
UPDATE user_tier
SET tier = 'advanced',
    tier_expires_at = now() + interval '6 months',
    aptitude_access = true
WHERE user_id = 'USER_UUID';

-- Mark pending request as completed
UPDATE pending_upgrades
SET status = 'completed', completed_at = now()
WHERE user_id = 'USER_UUID' AND status = 'pending';
```

### View pending upgrades
```sql
SELECT pu.id, au.email, pu.requested_tier, pu.price_paid_inr,
       pu.from_tier, pu.requested_at,
       extract(epoch from (now() - pu.requested_at)) / 3600 as hours_waiting
FROM pending_upgrades pu
JOIN auth.users au ON au.id = pu.user_id
WHERE pu.status = 'pending'
ORDER BY pu.requested_at ASC;
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Code Editor | CodeMirror 6 (@uiw/react-codemirror) |
| Code Execution | Judge0 Community Edition |
| Auth | Supabase Auth (email + Google) |
| Database | Supabase PostgreSQL |
| Realtime | Supabase Realtime (WebSockets) |
| Hosting | Vercel |
| Styling | CSS Custom Properties (design tokens) |
| Markdown | react-markdown + remark-gfm |
| Syntax Highlighting | react-syntax-highlighter (oneDark) |
| Date Picker | react-day-picker + date-fns |

---

## 📄 License

MIT License. See [LICENSE](./LICENSE) for details.

---

## 🤝 Contributing

PathForge is currently a solo project. Contributions welcome once the codebase is documented.

---

## 📬 Contact

- **Email:** `<calctanned@gmail.com>`
- **WhatsApp:** `7898208058`
- **GitHub:** [naman-0230](https://github.com/naman-0230)

---

_Built with ❤️ for Indian students preparing for placements._