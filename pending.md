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