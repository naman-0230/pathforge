DP — 8.8/10

This section is good but is where I'd make the biggest changes.

Biggest issue

You start with

House Robber
Decode Ways
Paint House

before introducing

Take/Not Take thinking.

I'd rather have

Fibonacci

Climbing

House Robber

House Robber II

Delete Earn

Then move

Decode Ways

Paint House

after.

Missing

Longest Palindromic Substring

Very common.

Missing

Palindrome Partitioning II

Classic DP.

Missing

Matrix Chain Multiplication

Foundation of Interval DP.

Before

Burst Balloons
Missing

Rod Cutting

Classic unbounded knapsack.

Missing

Subset Sum

Should come before Partition Equal Subset Sum.

Because Partition literally reduces to Subset Sum.

Missing

Count Subsets

Also foundation.

Missing

Minimum Coins

Coin Change already covers it somewhat, but if teaching DP conceptually, Minimum Coins first is cleaner.

Missing

Print LCS

Great reconstruction exercise.

Missing

Shortest Common Supersequence

Natural continuation after LCS.

Missing

Longest Bitonic Subsequence

Before Mountain Array.

Missing

Stock I

Before III and IV.

Although it's technically an array/greedy problem, it introduces the stock DP state machine nicely.








Backend tradeoff---

Interview optics: Honestly, if someone asks "walk me through your schema" and the real answer is "one JSON blob," that alone doesn't look great — it doesn't demonstrate normalization, indexing, or relational thinking. But there's a cheap fix that actually plays better than a from-scratch schema would: build Option A for the working product, and separately have a normalized schema design ready as a document (ER diagram or just SQL CREATE TABLE statements — Users, RoadmapSetup, ProblemProgress, RevisionState, ActivityLog, Preferences) that you present as "here's what I shipped fast with, and here's the target schema I'd migrate to as the user base grows, and why." That's a genuinely strong interview answer — it shows you know the right way and made a deliberate velocity tradeoff, not that you don't know better. It only backfires if you can't explain why a blob isn't ideal at scale — so you'd need to actually understand the schema, not just have it as a prop. I can generate that schema alongside Option A at basically no extra cost, if you want both.
Payments + 50-60 real users: Payment gateways are a non-issue either way — Stripe Checkout + a webhook is a separate, self-contained integration (you just need a payment_status or subscription field tied to a user id somewhere), completely orthogonal to whether your data layer is a blob or normalized tables. Works identically on Option A.
50-60 users is trivially fine on Supabase from a scale perspective — that's nothing. The real risk at that count isn't performance, it's correctness: every save overwrites the entire blob, so if the same person is logged in on two devices (phone + laptop, say) and both save around the same time, it's last-write-wins — one device's changes get silently thrown away, no merge, no warning. At 50-60 users, if even a few use multiple devices, this will eventually bite someone. Worth knowing going in, not a dealbreaker, but not something I'd want to leave unmentioned.
Migrating A → B later: This is the genuinely good news — it's cheaper than it sounds, because Option A's blob shape is literally dataExport.js's existing export format (same pathforge:* keys, just stored server-side instead of downloaded). Migrating means:

Design the normalized schema (~half a day, and you'd want this either way for the interview doc above)
Write one migration script that reads each user's blob and splits it into the proper tables (~half a day to a day — it's straightforward ETL, not novel logic)
Then the frontend refactor (sync calls → async, loading states) — this is the same ~3-5 days it would've taken if you'd started with Option B from day one. You don't pay for it twice; Option A doesn't create extra work later, it just defers this one specific chunk.

So realistically: switching later costs about 1-1.5 extra days on top of what Option B would've cost anyway, not a restart. Given "no time at all" right now, that's a reasonable trade.




Option C — Hybrid

Real auth (users table)
localStorage stays for progress but gets synced via a "state blob" endpoint
Over time, migrate high-value data (e.g., activity log) to real tables as needed
Pro: incremental, faster to ship first version
Con: two sources of truth for a while
My take: Option C. Ship real auth + blob sync in ~1 week, migrate specific tables as future features demand them. This gives users the "my data follows me" promise immediately without a monster upfront project.



















backend phases---------

Yes — auth is the right first code milestone, but there's a prerequisite step before any code exists to write, and then a distinction between "auth exists" and "auth is wired to your actual sync layer" that matters for ordering. Here's the full sequence:
Phase 0 — Supabase project setup (you, manual, ~10 min)
Create a Supabase account + project, grab the project URL and anon API key. Nothing to code here; I'll give you exact steps when we get to it, but this has to exist before anything else can be wired up.
Phase 1 — Client wiring

npm install @supabase/supabase-js
A new src/utils/supabaseClient.js — the single configured client instance every other file imports from
.env for the project URL + anon key (and a note on what to add to .gitignore if it's not already there)

Phase 2 — Auth (signup/login/logout)
This is where your LoginPage.jsx/SignupPage.jsx get rewired from whatever placeholder logic they currently have to real supabase.auth.signUp() / signInWithPassword() / signOut() calls. This also touches AppContext.jsx — user currently comes from a plain localStorage-backed useState; it needs to instead reflect the real Supabase session (including listening for auth state changes, so a token refresh or expiry is reflected live). Settings' "Sign out" and "Delete account" buttons get connected to real auth here too, instead of just clearing local state.
Phase 3 — The user_data table + RLS policy
The single-row-per-user table and the Row Level Security policy that enforces "you can only touch your own row" — this is pure Supabase/SQL setup, small and mechanical once Phase 2's auth exists to test it against.
Phase 4 — The sync layer
This is the actual "backend" from the product's perspective: on login, fetch that user's blob and hydrate it into the exact same localStorage keys everything already reads (progress.js, revision.js, activity.js, preferences.js don't need to change at all — they keep reading localStorage exactly as now). On any change, debounce and push the updated blob back up. This is where dataExport.js's existing exportAllData()/importAllData() functions get reused almost directly, since that's already the exact shape needed.
Phase 5 — Loading states
Since login now involves a real network round-trip before the app has real data to show, every page that currently assumes synchronous localStorage needs a brief "loading your data…" state for that one moment right after login. This is the smallest phase, but easy to forget and causes a jarring flash of empty/default state if skipped.
Phase 6 — Test the actual failure modes
Two devices logged in at once (confirm the known last-write-wins behavior happens as expected, not worse), a network drop mid-save, a brand-new signup with no row yet.










test phase feature..

Phase 3 (after backend) — pure-feature additions
Things that add UI/logic but don't fundamentally change what data you store per problem/user.

Test/Practice page — this is really cool and users will love it, but critically: it reads existing data (solved problems, topics, difficulty) and generates a temporary session. It doesn't need any new persistent data model. This is why it can wait for after backend — adding it later costs nothing extra.








/////////////////////////////////////////////////////////////////////////////////////

MUST-HAVE before backend (data-model-changing)
These add fields to your existing records. Cheap now, expensive after backend.



3. Explicit solvedAt / firstSolvedAt timestamps
You noticed this yourself when we did stuck-section detection — no timestamp on solves, so we had to build a workaround. Add a real timestamp now.

Impact: enables cleaner activity analytics, real "solved N days ago" displays, sunset the stuck-detection workaround.

Complexity: trivial — write timestamp on solve, backfill missing ones as null.

Recommendation: DO .



WORTH CONSIDERING (before or after backend)


7. Import from LeetCode / GitHub gists
Users have often already solved problems on LeetCode. Currently they'd have to re-mark each one as solved manually.

Recommendation: SKIP for now — it's a great feature but requires LeetCode scraping/OAuth which is fragile and out of scope. Consider after backend, offer manual bulk-mark instead: "mark all Easy Array problems as solved" checkbox in Roadmap.


MISSING that I'd argue you already need (not features, but gaps)


10. Empty/onboarding states everywhere
Right now if a user has zero data (fresh install), Dashboard/Revision/Analytics show varying amounts of "no data yet" messages, some good, some sparse. Do a pass to make sure every screen has a helpful empty state that tells users what to do.

Complexity: small per screen, adds up.

Recommendation: DO after backend. Users' first impression post-signup matters more once auth is real.



12. A "recent activity" log with more than just solves
Activity heatmap only tracks solves. But real study sessions include: hints opened, solutions viewed, revisions completed, notes written. Richer log = richer analytics.

Recommendation: MAYBE. Adds complexity. Do only if you plan an "activity feed" or richer analytics page. Skip for now.

SKIP entirely (real talk)
Social features / leaderboards — not until you have a userbase
Multiplayer / study rooms — huge scope, unclear value for a personal study app
AI hint generation / AI code review — very cool but requires LLM integration, cost, and heavy prompt engineering. Nice for v2.
Mobile app — your web app should be mobile-responsive first (is it? worth checking). Native app is 10× the work.
Dark/light mode toggle — you're already dark-themed. Adding light mode is 30+ hours of CSS work for questionable payoff.
Achievements / badges — gamification is trendy but rarely drives real behavior change. Users solving problems consistently need help, not gold stars.
My final recommendation, in order
Before backend:

Notes (planned)
Attempts array + real timestamps (biggest data-shape gap — DO)
Fundamentals-read tracking (close the broken loop)
Version-stamp data exports (5 minutes, huge future payoff)
Data audit document — list every localStorage key, its shape, its lifecycle. This becomes your DB schema.
Then backend (Option C — real auth + blob sync).

After backend:
6. Test page
7. Empty/onboarding state polish pass
8. Perceived difficulty override (if you want it)
9. Whatever real users are asking for by then