import { loadJSON, saveJSON } from './storage.js';
import { localDateStr, parseLocalDate, getDaysSinceLastActivity, getCurrentStreak, getTotalSolvedFromLog } from './activity.js';

// motivation.js — dynamic, contextual dashboard message system.
//
// ARCHITECTURE:
//   One message shown at a time. Priority resolver picks the single most
//   relevant occasion from all candidates. Message banks have 4-6 variants
//   per occasion; anti-repeat logic excludes the last 2 shown so the same
//   line never appears twice in a row. State (chosen occasion, variant,
//   recent history, pinned events) persists in localStorage so the message
//   is stable within a day (doesn't flicker on rerenders) but refreshes
//   each new calendar day.
//
// TWO MESSAGE CLASSES:
//   State messages — describe ongoing reality (absence, pace, deadline).
//   Re-evaluated once per calendar day.
//
//   Event messages — celebrate/react to something that just happened
//   (quota done, section complete, streak milestone, etc.).
//   Pinned until expiry:
//     - section-complete: activity-based (until next solve)
//     - topic-complete: until local midnight
//     - everything else: until local midnight
//
// PRIORITY ORDER (highest first):
//   1. deadline-passed
//   2. return-after-absence
//   3. behind-pace (meaningfully)
//   4. behind-pace (slightly)
//   5. quota-complete        ← event, can override mild state messages
//   6. topic-complete        ← event
//   7. section-complete      ← event
//   8. streak-milestone
//   9. milestone-count
//   10. first-problem-new-topic
//   11. revision-due
//   12. on-pace / ahead
//   13. time-of-day (fallback)

const MOTIVATION_KEY = 'pathforge:motivation:state';

// ─── MESSAGE BANKS ───────────────────────────────────────────────────────────

const BANKS = {
  // 1. Returning after absence
  absence_1: [
    "We're back.",
    "Right back at it.",
    "Nice — picked it up before it got rusty.",
    "Good call coming back today.",
    "Still warm. Let's keep it moving.",
    "Didn't even need a warm-up.",
  ],
  absence_2_4: [
    "A few days off is fine. Let's get back into it.",
    "Not too far off. One problem and you're rolling again.",
    "Tiny reset, no big deal.",
    "Short break, no damage done.",
    "Back before it mattered.",
  ],
  absence_5_9: [
    "Welcome back — let's make this a low-friction restart.",
    "It's been a few days. We ease in, not overthink it.",
    "Rust happens. One solid session fixes a lot.",
    "Back on the board. That's what matters.",
    "However long it's been, this still remembers you.",
    "Restart, not rebuild.",
  ],
  absence_10_plus: [
    "Been a while — no stress, your roadmap's still here.",
    "Welcome back. No need to catch up all at once.",
    "Fresh restart energy. Let's use it.",
    "The roadmap kept your place.",
    "No catching up required — just start.",
  ],

  // 2. Streak milestones
  streak_3: [
    "3-day streak. Quietly building something here.",
    "Three in a row — that's a habit starting.",
    "3 days straight. Clean.",
    "Small streak, real momentum.",
    "Three's the start of a pattern.",
  ],
  streak_7: [
    "A full week. That's not luck anymore.",
    "7 days straight — you're locked in.",
    "One full week. Solid.",
    "Seven days in a row. That adds up fast.",
    "A week's worth of showing up.",
  ],
  streak_14: [
    "Two weeks straight. Serious consistency.",
    "14 days. You're not dabbling anymore.",
    "Two-week streak. That's real work.",
    "You've been showing up. It shows.",
    "Two weeks in. That's not an accident anymore.",
  ],
  streak_30: [
    "30 days. That's elite consistency.",
    "A month straight. Huge.",
    "One month in a row. Different level.",
    "30 days. That's identity, not habit.",
  ],
  streak_broken: [
    "Lost the streak, kept the skill.",
    "It happens. Start the next one today.",
    "Momentum matters more than the number.",
    "New streak, same skill underneath.",
  ],

  // 3. Quota complete
  quota_complete: [
    "Nice — today's quota is done.",
    "Quota cleared. Anything else is bonus XP.",
    "Today's plan? Handled.",
    "You did the required reps. Extra is optional.",
    "That's today sorted.",
    "Main quest complete. Side quests available.",
    "Done for today. The rest is optional.",
    "That's the ask met. Anything else is you choosing to.",
    "Today's box, checked.",
  ],

  // 4. Pace vs deadline
  pace_ahead: [
    "You're ahead of pace. Nice cushion.",
    "Slightly ahead — that buys you breathing room.",
    "You've got margin right now. Well earned.",
    "Ahead of schedule. Love to see it.",
    "Banked some slack. Nice.",
  ],
  pace_on: [
    "Right on track.",
    "Pace looks good.",
    "You're moving exactly where you need to.",
    "Steady pace. Keep it boring in the best way.",
    "Matching the plan, exactly.",
  ],
  pace_slight_behind: [
    "Slightly behind pace — very fixable.",
    "Pace slipped a bit. Nothing dramatic.",
    "A small catch-up now saves stress later.",
    "Not off by much. A few strong days fixes it.",
    "A bit behind. One good session closes it.",
  ],
  pace_behind: [
    "Deadline's getting real — might be worth tightening the plan.",
    "There's some ground to cover now.",
    "You can still recover this, but it wants attention.",
    "Pace is off enough that a recalculation could help.",
    "The gap's real now — might be worth a recalculation.",
  ],
  deadline_passed: [
    "Deadline's come and gone — the work's still worth finishing. Want to set a new one?",
    "The deadline passed, but the plan's still salvageable.",
    "Deadline slipped. Worth resetting it instead of pretending it didn't.",
    "Past the deadline now — probably time for a cleaner target.",
  ],

  // 5. Section complete (activity-based expiry)
  section_complete: [
    "{sectionName} done. Nice.",
    "You wrapped {sectionName}. Clean work.",
    "{sectionName} is in the bag.",
    "That's {sectionName} handled.",
    "One more pattern locked in: {sectionName}.",
    "{sectionName}, closed out.",
  ],

  // 6. Topic complete (until midnight)
  topic_complete: [
    "{topicLabel} complete. Big win.",
    "You finished {topicLabel}. That's real coverage now.",
    "{topicLabel} done — onto the next arc.",
    "That closes out {topicLabel}. Nice work.",
    "{topicLabel} — the whole thing, done.",
  ],

  // 7. Hard/final section
  section_hard: [
    "That was the tough one. You got through it.",
    "Big section cleared.",
    "That section had hands. You still cleared it.",
    "Not a light section — solid finish.",
    "That section pushed back. You pushed harder.",
  ],

  // 8. First problem of a new topic
  first_in_topic: [
    "New topic, clean slate.",
    "First step into {topicLabel}. Let's see it.",
    "{topicLabel} starts here.",
    "New pattern set unlocked: {topicLabel}.",
    "Fresh territory. Good place to be.",
    "Day one of {topicLabel}. We build from here.",
    "{topicLabel}, from scratch.",
    "New shape of problem. Let's see it.",
  ],

  // 9. Milestone problem counts
  milestone_10: [
    "10 down. Base layer started.",
    "Double digits. We're underway.",
    "10 solved. Nice start.",
    "Ten in. The count starts mattering now.",
  ],
  milestone_25: [
    "25 solved. That's a real chunk.",
    "25 down. Quietly stacking wins.",
    "A quarter to 100. Nice.",
  ],
  milestone_50: [
    "50 solved. That's real volume now.",
    "Half a hundred. Clean.",
    "50 down. You've built actual reps.",
    "Fifty deep. That's not a phase, that's a habit.",
  ],
  milestone_100: [
    "100 solved. You're not new to this anymore.",
    "Triple digits. Huge.",
    "100 down. That changes how you think.",
    "Triple digits — different category now.",
  ],
  milestone_250: [
    "250 solved. Different tier.",
    "250 is serious work.",
    "Quarter-thousand. Wild.",
    "You've put in real, real reps.",
    "250. Most people stop long before this.",
  ],

  // 10. Revision due
  revision_due: [
    "{topicLabel} is due for a refresh.",
    "Time to see what still sticks in {topicLabel}.",
    "Quick revisit: {topicLabel}.",
    "{topicLabel} wants a memory check.",
    "{topicLabel}, due for a check.",
  ],

  // 11. Time-of-day fallback
  time_morning: [
    "Fresh brain — good time for a hard one.",
    "Morning reps hit different.",
    "Solid time to get one done early.",
    "Early rep. Good sign.",
  ],
  time_afternoon: [
    "Good time for a clean session.",
    "Midday check-in — one problem goes a long way.",
    "Sneak in one strong rep here.",
  ],
  time_evening: [
    "Evening session? Let's make it count.",
    "Nice window for a focused round.",
    "One good problem before the day wraps is a win.",
  ],
  time_late: [
    "Late-night grind, huh.",
    "Night session. Respect — but don't trade sleep for pride.",
    "Late hours. Be smart with your energy.",
    "Late one. Worth it, but sleep matters too.",
  ],
  time_weekend_morning: [
    "Weekend reps count a lot.",
    "Quiet weekend progress hits different.",
    "Good time to stack one or two.",
    "Weekend session. Love that.",
  ],
};

// ─── INTERPOLATION ────────────────────────────────────────────────────────────

// interpolate — replaces {sectionName} / {topicLabel} placeholders with
// real values from the context object. Safe to call on any string — if the
// placeholder doesn't exist, no substitution happens.
function interpolate(template, vars = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

// ─── ANTI-REPEAT ─────────────────────────────────────────────────────────────

// pickVariant — selects a random variant from a bank, avoiding the last 2
// shown for that occasion. Returns { index, text }.
function pickVariant(bankKey, recentByOccasion = {}, vars = {}) {
  const bank = BANKS[bankKey];
  if (!bank || bank.length === 0) return { index: 0, text: '' };

  const recent = recentByOccasion[bankKey] || [];
  const recentSet = new Set(recent.slice(-2));

  // If the bank is small enough that excluding recent would leave nothing,
  // just pick any — don't get stuck in a dead state.
  const candidates = bank.length > recentSet.size
    ? bank.map((_, i) => i).filter((i) => !recentSet.has(i))
    : bank.map((_, i) => i);

  const index = candidates[Math.floor(Math.random() * candidates.length)];
  const text = interpolate(bank[index], vars);
  return { index, text };
}

// updateRecent — pushes a new index onto the recent list for an occasion,
// capping at 3 (we check last 2, keep 3 so we always have the right window).
function updateRecent(recentByOccasion, bankKey, index) {
  const prev = recentByOccasion[bankKey] || [];
  return { ...recentByOccasion, [bankKey]: [...prev, index].slice(-3) };
}

function hasConsumedEvent(consumedEvents = [], eventId) {
  return !!eventId && consumedEvents.includes(eventId);
}

function addConsumedEvent(consumedEvents = [], eventId) {
  if (!eventId) return consumedEvents;
  return [...new Set([...consumedEvents, eventId])].slice(-100);
}

// clearConsumedStreakEvents — called when a streak breaks. Removes all
// streak:N entries from consumedEvents so milestones can re-fire on
// future streaks. A rebuilt 7-day streak months later is worth celebrating.
function clearConsumedStreakEvents() {
  const state = loadJSON(MOTIVATION_KEY, {});
  const consumed = state.consumedEvents || [];
  const cleaned = consumed.filter((id) => !id.startsWith('streak:'));
  saveJSON(MOTIVATION_KEY, { ...state, consumedEvents: cleaned });
}
// ─── LOCAL DATE HELPERS ───────────────────────────────────────────────────────

function todayStr() {
  return localDateStr(new Date());
}

function midnightTimestamp() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

function isExpired(pinnedEvent, totalSolved) {
  if (!pinnedEvent) return true;
  if (pinnedEvent.expiresAt === 'next-solve') {
    // section-complete expires the next time a problem is solved
    return totalSolved > (pinnedEvent.solvedCountAtPin ?? totalSolved);
  }
  // numeric timestamp — until midnight
  return Date.now() > pinnedEvent.expiresAt;
}

// ─── OCCASION DETECTORS ──────────────────────────────────────────────────────

// Each detector returns null (not relevant) or
// { bankKey, vars, isEvent, expiry }

function detectDeadlinePassed(context) {
  if (context.daysRemaining !== null && context.daysRemaining < 0) {
    return { bankKey: 'deadline_passed', vars: {}, isEvent: false };
  }
  return null;
}

function detectAbsence(context) {
  const days = context.daysSinceLastActivity;
  if (days === null || days <= 0) return null;
  if (days === 1) return { bankKey: 'absence_1', vars: {}, isEvent: false };
  if (days <= 4) return { bankKey: 'absence_2_4', vars: {}, isEvent: false };
  if (days <= 9) return { bankKey: 'absence_5_9', vars: {}, isEvent: false };
  return { bankKey: 'absence_10_plus', vars: {}, isEvent: false };
}

function detectPace(context) {
  const { daysRemaining, totalSolved, totalProblems } = context;
  if (daysRemaining === null || daysRemaining <= 0) return null;
  if (totalProblems === 0) return null;

  const roadmapMeta = context.roadmapMeta || {};
  const { generatedAt, totalDays } = roadmapMeta;
  if (!generatedAt || !totalDays || totalDays === 0) return null;

  const dayElapsed = Math.max(0, totalDays - daysRemaining);
  const expectedByNow = Math.round((dayElapsed / totalDays) * totalProblems);
  const delta = totalSolved - expectedByNow;

  if (delta >= 2) return { bankKey: 'pace_ahead', vars: {}, isEvent: false };
  if (delta >= -1) return { bankKey: 'pace_on', vars: {}, isEvent: false };
  if (delta >= -5) return { bankKey: 'pace_slight_behind', vars: {}, isEvent: false };
  return { bankKey: 'pace_behind', vars: {}, isEvent: false };
}

function detectQuotaComplete(context) {
  if (!context.quotaComplete) return null;
  return {
    bankKey: 'quota_complete',
    vars: {},
    isEvent: true,
    eventId: `quota:${todayStr()}`,
    expiry: midnightTimestamp(),
  };
}

function detectTopicComplete(context) {
  const justCompleted = context.justCompletedTopic;
  if (!justCompleted) return null;
  return {
    bankKey: 'topic_complete',
    vars: { topicLabel: justCompleted.label },
    isEvent: true,
    eventId: `topic:${justCompleted.topicKey}`,
    expiry: midnightTimestamp(),
  };
}

function detectSectionComplete(context) {
  const justCompleted = context.justCompletedSection;
  if (!justCompleted) return null;
  return {
    bankKey: 'section_complete',
    vars: { sectionName: justCompleted.name },
    isEvent: true,
    eventId: `section:${justCompleted.topicKey}:${justCompleted.name}`,
    expiry: 'next-solve',
  };
}

function detectStreakMilestone(context) {
  const streak = context.streak;
  const prevStreak = context.prevStreak;

    if (prevStreak > 2 && streak === 0) {
    // Clear consumed streak milestones so they can re-fire on future
    // streaks — losing a 14-day streak and rebuilding to 7 again months
    // later is worth celebrating again.
    clearConsumedStreakEvents();
    return {
      bankKey: 'streak_broken',
      vars: {},
      isEvent: true,
      eventId: `streak-broken:${todayStr()}`,
      expiry: midnightTimestamp(),
    };
  }

  const milestones = [30, 14, 7, 3];
  for (const m of milestones) {
    if (streak >= m && prevStreak < m) {
      const bankKey = `streak_${m}`;
      if (BANKS[bankKey]) {
        return {
          bankKey,
          vars: {},
          isEvent: true,
          eventId: `streak:${m}`,
          expiry: midnightTimestamp(),
        };
      }
    }
  }
  return null;
}

function detectMilestoneCount(context) {
  const total = context.totalSolved;
  const prevTotal = context.prevTotalSolved;
  const milestones = [250, 100, 50, 25, 10];
  for (const m of milestones) {
    if (total >= m && prevTotal < m) {
      const bankKey = `milestone_${m}`;
      if (BANKS[bankKey]) {
        return {
          bankKey,
          vars: {},
          isEvent: true,
          eventId: `milestone:${m}`,
          expiry: midnightTimestamp(),
        };
      }
    }
  }
  return null;
}

function detectFirstInTopic(context) {
  const topic = context.firstProblemNewTopic;
  if (!topic) return null;
  return {
    bankKey: 'first_in_topic',
    vars: { topicLabel: topic.label },
    isEvent: true,
    eventId: `first-topic:${topic.topicKey}`,
    expiry: midnightTimestamp(),
  };
}

function detectRevisionDue(context) {
  if (!context.revisionDueCount || context.revisionDueCount === 0) return null;
  // Use the most overdue topic label if available
  const label = context.mostOverdueRevisionLabel || 'A topic';
  return { bankKey: 'revision_due', vars: { topicLabel: label }, isEvent: false };
}

function detectTimeOfDay() {
  const hour = new Date().getHours();
  const isWeekend = [0, 6].includes(new Date().getDay());

  if (isWeekend && hour >= 5 && hour < 12) return { bankKey: 'time_weekend_morning', vars: {}, isEvent: false };
  if (hour >= 5 && hour < 12) return { bankKey: 'time_morning', vars: {}, isEvent: false };
  if (hour >= 12 && hour < 17) return { bankKey: 'time_afternoon', vars: {}, isEvent: false };
  if (hour >= 17 && hour < 21) return { bankKey: 'time_evening', vars: {}, isEvent: false };
  return { bankKey: 'time_late', vars: {}, isEvent: false };
}

// ─── PRIORITY RESOLVER ────────────────────────────────────────────────────────

// PRIORITY_ORDER — detectors run in this order; first non-null result wins.
// Events can pin across multiple re-evaluations (see pinned-event path below).
const PRIORITY_ORDER = [
  detectDeadlinePassed,
  detectAbsence,
  detectMilestoneCount,   // ← moved up: "50 solved" is a moment worth celebrating
  detectStreakMilestone,  // ← moved up: "7-day streak" beats routine pace info
  detectQuotaComplete,
  detectTopicComplete,
  detectSectionComplete,
  detectFirstInTopic,
  detectPace,             // ← moved down: routine state, not a celebration
  detectRevisionDue,
  detectTimeOfDay,
];

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────

// getMotivationMessage — the single function DashboardPage calls.
//
// context shape:
// {
//   daysSinceLastActivity: number | null,
//   streak: number,
//   prevStreak: number,           // streak as of yesterday (for milestone detection)
//   totalSolved: number,
//   prevTotalSolved: number,      // total as of yesterday (for milestone detection)
//   quotaComplete: boolean,
//   daysRemaining: number | null,
//   roadmapMeta: { generatedAt: number, totalDays: number },
//   totalProblems: number,
//   justCompletedSection: { name: string } | null,
//   justCompletedTopic: { label: string } | null,
//   firstProblemNewTopic: { label: string } | null,
//   revisionDueCount: number,
//   mostOverdueRevisionLabel: string | null,
// }
export function getMotivationMessage(context) {
  const today = todayStr();
  const totalSolved = context.totalSolved ?? 0;

  let state = loadJSON(MOTIVATION_KEY, {
    date: null,
    chosenBankKey: null,
    chosenVariantIndex: null,
    chosenVars: {},
    recentByOccasion: {},
    consumedEvents: [],
    pinnedEvent: null,
  });

  // 1) If a pinned event is still active, keep showing it.
  if (state.pinnedEvent && !isExpired(state.pinnedEvent, totalSolved)) {
    const bank = BANKS[state.pinnedEvent.bankKey];
    if (bank) {
      return interpolate(
        bank[state.pinnedEvent.variantIndex] || bank[0],
        state.pinnedEvent.vars || {}
      );
    }
  }

  // 2) Clear expired pinned events before evaluating new winners.
  if (state.pinnedEvent && isExpired(state.pinnedEvent, totalSolved)) {
    state = { ...state, pinnedEvent: null };
  }

  const recentByOccasion = state.recentByOccasion || {};
  const consumedEvents = state.consumedEvents || [];

  // 3) Re-evaluate in priority order EVERY call, so new events can override
  // a previously cached daily state message.
  for (const detector of PRIORITY_ORDER) {
    const result = detector(context);
    if (!result) continue;

    const { bankKey, vars = {}, isEvent, expiry, eventId } = result;

    // Skip already-consumed events.
    if (isEvent && hasConsumedEvent(consumedEvents, eventId)) {
      continue;
    }

    // STATE WINNER:
    // If today's stored state winner is still this same bank, reuse it so the
    // message stays stable within the day.
    if (!isEvent) {
      if (
        state.date === today &&
        state.chosenBankKey === bankKey &&
        state.chosenVariantIndex != null
      ) {
        const bank = BANKS[bankKey];
        if (bank) {
          return interpolate(bank[state.chosenVariantIndex] || bank[0], state.chosenVars || {});
        }
      }

      const { index, text } = pickVariant(bankKey, recentByOccasion, vars);
      const updatedRecent = updateRecent(recentByOccasion, bankKey, index);

      saveJSON(MOTIVATION_KEY, {
        ...state,
        date: today,
        chosenBankKey: bankKey,
        chosenVariantIndex: index,
        chosenVars: vars,
        recentByOccasion: updatedRecent,
        consumedEvents,
        pinnedEvent: null,
      });

      return text;
    }

    // EVENT WINNER:
    // New event overrides cached daily state, gets pinned, and is marked consumed.
    const { index, text } = pickVariant(bankKey, recentByOccasion, vars);
    const updatedRecent = updateRecent(recentByOccasion, bankKey, index);

    saveJSON(MOTIVATION_KEY, {
      ...state,
      date: today,
      chosenBankKey: bankKey,
      chosenVariantIndex: index,
      chosenVars: vars,
      recentByOccasion: updatedRecent,
      consumedEvents: addConsumedEvent(consumedEvents, eventId),
      pinnedEvent: {
        bankKey,
        variantIndex: index,
        vars,
        expiresAt: expiry ?? midnightTimestamp(),
        solvedCountAtPin: totalSolved,
        eventId: eventId ?? null,
      },
    });

    return text;
  }

  return '';
}