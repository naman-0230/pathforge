# PathForge Backend Architecture — Interview Reference

## The one-sentence framing to lead with

> "I made a deliberate, time-boxed engineering tradeoff: ship a working
> multi-user backend fast with a document-store pattern, while designing the
> normalized schema I'd migrate to as the product matures — and because of
> how I structured the client's data layer, that migration is cheap, not a
> rewrite."

That sentence does the most important job in the room: it signals *choice*,
not *ignorance*. Everything below is the detail behind it.

---

## 1. Why Option A, now

Three real constraints drove this, and all three are legitimate engineering
reasons, not excuses:

- **Time.** The product (roadmap generation, SM-2 spaced repetition, weak-point
  detection, an attempt-timer gate, syntax-highlighted multi-language
  solutions) was already fully built and working client-side against
  `localStorage`. The only thing missing for a real multi-user product was
  persistence + auth + cross-device sync — not a rearchitecture of the actual
  logic.
- **Unknown query patterns.** I don't yet know how real users will actually
  use this — whether they'll check in daily, whether multi-device usage is
  common, what they'll actually want to see in analytics. Designing a
  normalized schema *before* that's known risks optimizing for the wrong
  access patterns and re-migrating anyway once real usage reveals what
  actually matters. This is a standard YAGNI (You Aren't Gonna Need It)
  argument — build the schema real usage demands, not the one I'd guess at
  today.
- **De-risking scope.** Every piece of business logic — SM-2 math, weak-point
  scoring, adaptive roadmap generation — runs entirely in the browser and is
  already tested against real interaction. Option A adds a persistence layer
  *around* that logic without touching it at all. That keeps the riskiest,
  most-already-working part of the codebase completely untouched while I add
  the new (auth, sync) part.

---

## 2. What Option A actually is

- **Supabase** — Postgres + Auth + an auto-generated REST/GraphQL API, so
  there's no server code to write or host myself.
- **One table**, essentially: `user_data(user_id uuid, data jsonb, updated_at
  timestamptz)`.
- **Row Level Security (RLS)** policies in Postgres enforce that a user can
  only `SELECT`/`UPDATE` the row where `user_id = auth.uid()` — this is the
  actual security boundary, enforced at the database layer, not just in
  application code. Worth naming explicitly if asked "how do you stop User A
  from reading User B's data" — the answer is RLS, not "the frontend doesn't
  show it to them."
- **The blob's shape is not arbitrary** — it's exactly the same
  `pathforge:*` key structure the app's own `dataExport.js` already produces
  for its local backup/restore feature. That's not a coincidence: I already
  had a well-defined "this is everything about a user" contract before the
  backend existed. Supabase is just storing that same contract server-side
  instead of as a downloaded file.
- **Business logic stays 100% client-side.** On login, the blob is fetched
  once and used to hydrate the app's existing local state; every write
  (debounced) re-uploads the updated blob. SM-2 calculations, weak-point
  scoring, roadmap generation — none of that moved to the server. The backend
  in Option A is a *sync layer*, not an *application backend*.

---

## 3. Why this isn't the long-term answer — full limitations list

Be ready to name all of these unprompted — volunteering the limitations
yourself is what makes this read as "deliberate tradeoff" instead of "didn't
know better."

1. **Last-write-wins, no conflict resolution.** Every save overwrites the
   *entire* blob atomically. If the same user is active on two devices near
   the same time, the second write silently clobbers the first — no merge,
   no warning, no version check. At real scale this *will* eventually lose
   someone's data.
2. **No partial reads.** Loading one page (e.g. "today's due revisions")
   requires downloading and parsing the user's *entire* history — activity
   log, every problem's progress, every revision session — even though only
   a sliver of it is relevant. This gets linearly worse as usage
   accumulates.
3. **No server-side querying or joins.** Because it's opaque JSON to
   Postgres, I can't ask the database things like "average time-to-solve for
   topic X across all users" or "how many users are stuck on DP right now" —
   any aggregate analysis means pulling every user's blob down and computing
   client-side (or in a one-off script), which doesn't scale and isn't real
   product analytics.
4. **No referential integrity.** Nothing at the database layer stops
   malformed or orphaned data — e.g. a revision record pointing at a topic
   key that no longer exists. The client is fully trusted to keep its own
   data internally consistent.
5. **No DB-enforced validation.** Rules like "confidence rating must be
   1–4" or "difficulty must be Easy/Medium/Hard" exist only in application
   code, not as database constraints. A buggy client write (or a malicious
   one) has nothing stopping it at the data layer.
6. **Coarse-grained realtime.** Supabase's realtime subscriptions work
   per-row. With one row per user, a subscriber learns "something in your
   data changed," not "your revision schedule changed" — no field-level
   granularity.
7. **No formal schema, no migration history.** The blob's actual shape is
   defined implicitly by whatever the frontend code currently expects to
   read/write — there's no DB-level schema definition or tracked migration
   history the way normalized tables would have.
8. **No admin/analytics tooling path.** Cohort analysis, an admin dashboard,
   "which topics do most users struggle with" — all of this is
   structurally awkward against opaque JSON blobs and natural against
   normalized tables.

**The honest scale answer, if asked directly:** at 50–60 users, none of this
is a performance problem — Postgres handles that trivially. The actual risk
at that scale is *correctness* (limitation #1, multi-device data loss), not
speed. That's a more precise and more senior answer than either "it doesn't
scale" (wrong) or "it's totally fine forever" (also wrong).

---

## 4. Option B — what it actually looks like

Real normalized relational schema, roughly:

```sql
users               (id, email, created_at, ...)                -- via Supabase Auth
roadmap_setups      (user_id FK, selected_topics[], deadline, hours_per_day, dsa_level)
problem_progress    (user_id FK, problem_id, is_solved, hints_opened,
                      confidence_rating, solution_peeked, time_spent_seconds, ...)
                     -- one row per (user, problem)
revision_states     (user_id FK, topic_key, interval, ease_factor, reps,
                      next_review, last_reviewed)
                     -- one row per (user, topic)
revision_history     (user_id FK, topic_key, date, quality, interval, ef)
                     -- one row per revision SESSION — proper history, not a
                     -- capped array crammed into a JSON field
activity_log         (user_id FK, date, solved_count)
                     -- one row per (user, date)
preferences          (user_id FK, default_code_language, gate_settings jsonb, ...)
```

Each table gets real foreign keys, `CHECK` constraints where relevant (e.g.
`confidence_rating BETWEEN 1 AND 4`), and proper indexes on the columns
that'll actually be queried (`user_id`, `next_review` for the revision-due
query, `date` for activity trends).

The API layer moves from Supabase's auto-REST-on-a-single-table to real
endpoints per resource (`PATCH /problem-progress/:id`, `GET
/revisions/due`, etc.), with request validation (e.g. via Zod) enforcing
shape *before* it ever reaches the database.

---

## 5. Why Option B is actually better

- **Correctness at scale** — real per-row updates instead of whole-blob
  overwrites means no more last-write-wins data loss; optimistic concurrency
  (a `version`/`updated_at` check) becomes possible per-field, not just
  per-user.
- **Performance** — a dashboard fetches exactly the rows it needs (e.g. `SELECT
  * FROM revision_states WHERE user_id = ? AND next_review <= today`)
  instead of downloading and parsing an ever-growing blob.
- **Real analytics** — SQL aggregates and joins across users become possible:
  cohort weak-point trends, retention curves, "which topics cause the most
  drop-off" — genuine product insight, not just per-user state.
- **Data integrity enforced by the database**, not just trusted from the
  client.
- **Sets up future features** that are structurally awkward on Option A:
  leaderboards, admin tooling, more granular realtime sync.

---

## 6. Migration plan: Option A → Option B

This is the part worth emphasizing most in an interview — it demonstrates
forward planning, not just "I'll deal with it later":

1. **Design and create the normalized schema** (the tables above) via
   migrations — can be done in parallel with Option A already running in
   production, no downtime required yet.
2. **Write a one-time ETL migration script.** Because Option A's blob is
   *already* shaped exactly like `dataExport.js`'s existing export format,
   this script is straightforward: for each user's row, read
   `data['pathforge:problem:xyz']` and insert the equivalent row into
   `problem_progress`, read `data['pathforge:revision:topicKey']` into
   `revision_states`, and so on. This is mechanical field-mapping, not novel
   logic — the hard part (defining what the data even means) was already
   done when the local-first version was built.
3. **Dry-run the migration** against a copy of production data, verify
   row counts and spot-check values before touching anything live.
4. **Run it writing into the NEW tables while keeping the old blob table
   intact** as a fallback/audit trail during the transition — nothing is
   deleted until the new path is verified correct in production.
5. **Refactor the frontend's data-access layer** (`progress.js`,
   `activity.js`, `revision.js`, `weakPoints.js`, `preferences.js`, and every
   page that calls them) from synchronous localStorage reads to async API
   calls against the new endpoints. This is real work — but it's the *same*
   work that Option B would have required from day one; choosing Option A
   first didn't create this cost, it just deferred it.
6. **Cut over per-user or behind a feature flag**, verify correctness in
   production against real accounts, then deprecate and drop the old blob
   table.

**Rough honest cost estimate to cite if asked:** designing the schema and
writing/testing the migration script is about a day to a day and a half.
The frontend refactor (sync → async, adding loading states) is the larger
piece, roughly 3–5 days — but that's not "extra" work created by starting
with Option A; it's work Option B would have needed regardless. Starting
with Option A adds roughly 1–1.5 days of *net new* work (the migration
script itself) on top of what Option B would've cost from scratch — a small
price for having a real, working, multi-user product immediately instead of
weeks from now.

---

## 7. Other things worth knowing before you present this

- **Payments are completely orthogonal to this decision.** Stripe Checkout +
  a webhook that writes a `subscription_status` field somewhere works
  identically whether the backend is a JSON blob or normalized tables. If
  asked "does this support payments," the honest answer is "yes, and that
  integration doesn't change based on which of these two I'm running" — this
  is worth saying proactively, since it shows you understand these are
  separable concerns.
- **Be precise if anyone brings up CAP theorem or distributed consistency.**
  This is a *single-node Postgres* row overwrite, not a distributed-systems
  consistency tradeoff — the correct term for the actual risk is
  "last-write-wins with no optimistic concurrency control," not "CAP
  theorem." Don't reach for the fancier-sounding but technically wrong
  framing if pushed — naming it precisely is more impressive than
  name-dropping CAP incorrectly.
- **You can partially harden Option A without fully moving to Option B.**
  Postgres supports `CHECK` constraints and triggers even on `jsonb`
  columns — e.g. a trigger validating that required keys exist before an
  upsert succeeds. Worth mentioning as a middle-ground option if asked "could
  you improve A without doing the full migration" — shows you know the
  space between the two isn't binary.
- **If asked to show your schema directly, don't oversell it.** Say plainly:
  "the current production schema is intentionally a single JSON-column table
  — here's why," then pivot straight into the Option B design and the
  migration plan. Trying to make a one-table blob sound like a normalized
  schema is the one move that actually damages credibility here; being
  upfront about the tradeoff is what sells it.
- **The strongest framing throughout:** business logic (SM-2 scheduling,
  weak-point detection, adaptive roadmap generation) was built and proven
  correct entirely client-side, independent of this decision. The backend
  choice governs *persistence and sync*, not the algorithmic core of the
  product — which is worth stating explicitly so the interviewer doesn't
  conflate "simple backend" with "simple product."
