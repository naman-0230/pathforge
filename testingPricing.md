Testing Checklist
Do these in order after applying all patches.

Prep
Run the SQL from Message 1 (create pending_upgrades + enable Realtime)
Verify: select tablename from pg_publication_tables where pubname = 'supabase_realtime'; includes user_tier
Run all PowerShell scripts (2a shell + 2b patches + 2c patches)
Hard-refresh browser after Vite reloads
Test 1: Pricing page — logged out
Log out
Go to landing page /
Should see new "Pricing" nav item
Scroll landing page — should see "Pricing" preview section with 3 compact cards
Click "See full comparison + FAQ →" → lands on /pricing
Verify:
Hero section, 3 tier cards, aptitude add-on, comparison table, FAQ, bottom CTA all render
No sidebar (public mode)
Tier cards show "Sign up free" or "Get Basic/Advanced" buttons
Clicking a tier button → sends to /signup?intent=basic (or advanced/aptitude_addon)
Test 2: Pricing page — logged in
Log in as any user
Go to /pricing (via nav or direct URL — no sidebar link, must use nav or Settings)
Verify:
Tier cards show correct state based on your tier:
Current tier: "✓ Current plan" (disabled)
Lower tiers: "You're on a higher plan"
Higher tiers: "Upgrade to X →"
Aptitude section shows "You have this" (if you have it) or "Get for ₹99"
Test 3: Settings tier plan card
Go to /settings
Verify TierPlanCard is at TOP of Settings page
Should show:
Your current tier + icon
Expiry date if paid tier (or nothing if free)
Days-left badge if paid tier
Upgrade options if not on Advanced
Aptitude section with correct state
Test 4: Checkout flow — new upgrade
Change your tier to free in Supabase: UPDATE user_tier SET tier='free', tier_expires_at=null WHERE user_id='YOUR_UUID';
Wait ~1 second — should see Realtime downgrade in your app (badge might change or dashboard might update)
Actually since this is a downgrade, no success toast fires
Go to /settings#tier — should show free tier with upgrade CTAs
Click "Get Basic" → navigates to /checkout?tier=basic
Verify:
Order summary shows "Basic tier (6 months) · ₹199"
UPI ID shows placeholder <YOUR_UPI_ID>
WhatsApp shows placeholder <YOUR_WHATSAPP>
Optional transaction ID + notes fields
"I've paid, notify us" button
Fill optional fields, click "I've paid, notify us"
Should show success view
Check Supabase: select * from pending_upgrades where user_id = 'YOUR_UUID' order by requested_at desc limit 1;
Should have 1 row with status='pending', requested_tier='basic', from_tier='free'
Test 5: Realtime tier update
With the pending row from Test 4 still there:

In Supabase SQL Editor, run:
SQL

UPDATE user_tier
SET tier='basic', tier_expires_at=now() + interval '6 months'
WHERE user_id = 'YOUR_UUID';
Also mark request completed:
SQL

UPDATE pending_upgrades
SET status='completed', completed_at=now()
WHERE user_id = 'YOUR_UUID' AND status='pending';
Within 1-2 seconds, in your browser:
Success toast should appear bottom-right: "🎉 Basic tier activated!"
Toast auto-dismisses after 8 seconds
Your Settings TierPlanCard updates to show "Basic tier · Until [date]"
No page reload needed
Test 6: Aptitude add-on flow
Go to /aptitude (if free/basic user without aptitude access, you see landing view)
Click "Purchase add-on →" — should navigate to /checkout?tier=aptitude_addon
Order summary shows "Aptitude Add-on (lifetime) · ₹99"
Click "I've paid" → success view + row in pending_upgrades
In Supabase, run:
SQL

UPDATE user_tier SET aptitude_access=true WHERE user_id='YOUR_UUID';
UPDATE pending_upgrades SET status='completed', completed_at=now() WHERE user_id='YOUR_UUID' AND requested_tier='aptitude_addon';
Toast fires: "🎉 Aptitude add-on activated!"
/aptitude now shows the full experience (not landing view)
Test 7: Upgrade Basic → Advanced
Set your tier to basic in Supabase
Go to /checkout?tier=advanced
Verify order summary:
"Advanced tier (6 months)"
"Since you're on Basic, you pay the difference: ₹399 - ₹199"
Total: ₹200
Complete flow same as Test 4
pending_upgrades row should have price_paid_inr=200, from_tier='basic'
Test 8: Duplicate upgrade request
With a pending upgrade row for Basic in your DB, go to /checkout?tier=basic again
Should show "Your request is being processed" view
Should NOT allow submitting another request
Shows details from the existing pending request
Test 9: Invalid checkout URL
Go to /checkout?tier=basic while already on Basic tier
Should show "Invalid upgrade" view with "You can't upgrade to basic from your current basic tier"
Go to /checkout?tier=free — same
Go to /checkout (no param) — same
Test 10: Expiry banner
Set tier_expires_at to 5 days from now:
SQL

UPDATE user_tier SET tier_expires_at=now() + interval '5 days' WHERE user_id='YOUR_UUID';
Go to /dashboard
Should see amber TierExpiryBanner: "Your Basic tier expires in 5 days"
Set to 2 days:
SQL

UPDATE user_tier SET tier_expires_at=now() + interval '2 days' WHERE user_id='YOUR_UUID';
Refresh dashboard — banner turns red (critical)
Set to yesterday:
SQL

UPDATE user_tier SET tier_expires_at=now() - interval '1 day' WHERE user_id='YOUR_UUID';
Refresh — shows "Your Basic tier expired. 3-day grace period active."
Dismiss banner → hidden for 24 hours
Test 11: Feature gate CTAs updated
As free user, go to /weekly-test
Should see GateView with buttons:
"Upgrade to Advanced →" → clicks to /checkout?tier=advanced (not /settings)
"See all plans" → clicks to /pricing
"Back to dashboard"
Same test for /simulate (as free user who already used weekly sim), /custom-tests (as free user), /dsa-mocks (as free user)
Admin Runbook — SQL Commands You'll Run
Save this as ADMIN_UPGRADES.md in your project root or wherever you keep notes.

Markdown

# PathForge Admin — Upgrade Users

## Every time a user pays

### Step 1: Verify payment received
Check WhatsApp for screenshot. Verify amount matches what they should have paid.

### Step 2: Find the user's UUID
```sql
select id, email from auth.users where email = 'user@example.com';
Step 3: Check their pending upgrade request
SQL

select * from pending_upgrades
where user_id = 'USER_UUID_HERE' and status = 'pending'
order by requested_at desc limit 1;
Confirm requested_tier, price_paid_inr, and from_tier match what they told you.

Step 4: Upgrade their tier
Upgrade to Basic (₹199, from free):

SQL

UPDATE user_tier
SET tier = 'basic',
    tier_expires_at = now() + interval '6 months'
WHERE user_id = 'USER_UUID_HERE';
Upgrade to Advanced (₹399, from free):

SQL

UPDATE user_tier
SET tier = 'advanced',
    tier_expires_at = now() + interval '6 months'
WHERE user_id = 'USER_UUID_HERE';
Upgrade from Basic → Advanced (₹200 difference):

SQL

UPDATE user_tier
SET tier = 'advanced',
    tier_expires_at = now() + interval '6 months'  -- fresh 6 months
WHERE user_id = 'USER_UUID_HERE';
Grant Aptitude Add-on (₹99, lifetime):

SQL

UPDATE user_tier
SET aptitude_access = true
WHERE user_id = 'USER_UUID_HERE';
Combo — upgrade + aptitude in one shot:

SQL

UPDATE user_tier
SET tier = 'advanced',
    tier_expires_at = now() + interval '6 months',
    aptitude_access = true
WHERE user_id = 'USER_UUID_HERE';
Step 5: Mark the pending request as completed
SQL

UPDATE pending_upgrades
SET status = 'completed',
    completed_at = now(),
    admin_notes = 'Payment verified via WhatsApp screenshot'
WHERE id = 'PENDING_UPGRADE_UUID';
Or by user_id:

SQL

UPDATE pending_upgrades
SET status = 'completed',
    completed_at = now()
WHERE user_id = 'USER_UUID_HERE' AND status = 'pending';
Step 6: User's app auto-updates
Within 1-2 seconds, their app receives Realtime event, shows success toast, tier badge updates. No action needed on their side.

Renewal (existing user's tier expiring)
Same as a new purchase — they pay again, you run the same SQL. tier_expires_at gets refreshed to now() + interval '6 months'.

One-shot combined query
If you're bulk-processing multiple users, use email directly:

SQL

UPDATE user_tier
SET tier = 'advanced',
    tier_expires_at = now() + interval '6 months'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
Rejecting a request
If payment didn't come through or is suspicious:

SQL

UPDATE pending_upgrades
SET status = 'rejected',
    admin_notes = 'No payment received / suspicious transaction'
WHERE id = 'PENDING_UPGRADE_UUID';
Then WhatsApp the user explaining why.

Manual downgrade (rare)
If user requests downgrade or you need to revoke:

SQL

UPDATE user_tier
SET tier = 'free',
    tier_expires_at = null
WHERE user_id = 'USER_UUID_HERE';
Bulk query: see all pending upgrades
SQL

select
  pu.id,
  au.email,
  pu.requested_tier,
  pu.price_paid_inr,
  pu.from_tier,
  pu.transaction_id,
  pu.notes,
  pu.requested_at,
  extract(epoch from (now() - pu.requested_at)) / 3600 as hours_waiting
from pending_upgrades pu
join auth.users au on au.id = pu.user_id
where pu.status = 'pending'
order by pu.requested_at asc;
Sort by oldest first — handle those users first so no one waits > 24 hours.




Revoke aptitude access
SQL

UPDATE user_tier
SET aptitude_access = false
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
Grant aptitude access back
SQL

UPDATE user_tier
SET aptitude_access = true
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
Clear pending upgrade requests for a user
SQL

-- Delete ALL pending requests for a user
DELETE FROM pending_upgrades
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

-- Or delete only pending (leave completed/rejected as history)
DELETE FROM pending_upgrades
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
  AND status = 'pending';

-- Or delete only aptitude-related pending
DELETE FROM pending_upgrades
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
  AND requested_tier = 'aptitude_addon'
  AND status = 'pending';
Mark existing pending as completed (instead of deleting)
Useful when you approved a payment but forgot to update status:

SQL

UPDATE pending_upgrades
SET status = 'completed',
    completed_at = now(),
    admin_notes = 'Approved manually'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com')
  AND requested_tier = 'aptitude_addon'
  AND status = 'pending';
Full reset for a user (nuclear option)
SQL

-- Reset tier to free + revoke aptitude + delete all pending upgrades
UPDATE user_tier
SET tier = 'free',
    tier_expires_at = null,
    aptitude_access = false
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');

DELETE FROM pending_upgrades
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
View a user's current state
SQL

-- See tier + all pending requests in one query
SELECT
  ut.tier,
  ut.tier_expires_at,
  ut.aptitude_access,
  (SELECT count(*) FROM pending_upgrades pu 
   WHERE pu.user_id = ut.user_id AND pu.status = 'pending') as pending_count,
  (SELECT string_agg(requested_tier, ', ') FROM pending_upgrades pu 
   WHERE pu.user_id = ut.user_id AND pu.status = 'pending') as pending_tiers
FROM user_tier ut
WHERE ut.user_id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
Replace user@example.com in all queries with the actual user's email.