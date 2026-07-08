import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import TopicChip from '../components/TopicChip';
import Toast from '../components/Toast';
import Collapsible from '../components/Collapsible';
import Select from '../components/Select';
import { useApp } from '../context/AppContext.jsx';
import { topics } from '../data/topics.js';
import { getTopicStats } from '../utils/progress.js';
import { getPreferences, savePreferences, resetPreferences, REVISION_PRESETS } from '../utils/preferences.js';
import { downloadDataAsFile, importAllData, clearAllData } from '../utils/dataExport.js';
import { clearAllRevisionSchedules } from '../utils/revision.js';
import '../styles/app.css';
import '../styles/onboarding.css';
import '../styles/settings.css';

// SettingsPage — one page, but really three different kinds of state living
// side by side, each saved a different way:
//
//   1. Study Plan (topics/deadline/hours/level) — lives in AppContext's
//      roadmapSetup, same as onboarding writes to. Saving here just calls
//      setRoadmapSetup(), and RoadmapPage/DashboardPage automatically pick up
//      the change on their next render since they call buildDayPlan(roadmapSetup)
//      / getWeightedProblemQueue(roadmapSetup) fresh every time — no separate
//      "regenerate" step needed.
//   2. Account (name/email) — also AppContext, via setUser().
//   3. Everything else (code language, solution-gate timing, revision pacing,
//      weak-point sensitivity, motivation toggles) — a single `preferences`
//      object in localStorage (utils/preferences.js), auto-saved on every
//      change the same way AppContext auto-saves user/roadmapSetup.
//
// Data management (export/import/clear) operates on raw localStorage directly
// via utils/dataExport.js, since it needs to see every pathforge: key, not
// just the ones this page happens to know about.
//
// LAYOUT NOTE (this pass): every section is now a <Collapsible>, all closed
// by default. The section order is deliberate — Account first (identity),
// then Study Plan (biggest impact), then behavioral toggles (gate → revision
// → weak-points → code → streaks), and Data management dead last (destructive
// operations get the "you had to scroll all the way down here" friction).
// Revision now offers 3 presets + a "Custom" mode that reveals the raw
// tuning knobs; picking a preset just copies its values into the individual
// fields, so revision.js only ever needs to read the individual fields.

const allTopics = topics.map((t) => ({ key: t.key, icon: t.icon, label: t.label }));

const defaultStudyPlan = {
    selectedTopics: allTopics.map((t) => t.key),
    deadline: '',
    hoursPerDay: 2,
    dsaLevel: 'intermediate',
};

// getSupportedTimezones — modern browsers (Chromium 99+, Firefox 100+, Safari
// 15.4+) expose the full IANA timezone list via Intl.supportedValuesOf. On
// older browsers we fall back to a short curated list of common zones plus
// UTC. Trying-and-falling-back is more resilient than a static list forever.
function getSupportedTimezones() {
    try {
        if (typeof Intl.supportedValuesOf === 'function') {
            return Intl.supportedValuesOf('timeZone');
        }
    } catch { /* fall through */ }
    return [
        'UTC', 'America/New_York', 'America/Chicago', 'America/Denver',
        'America/Los_Angeles', 'Europe/London', 'Europe/Berlin', 'Europe/Paris',
        'Asia/Kolkata', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Dubai',
        'Australia/Sydney',
    ];
}

const TIMEZONES = getSupportedTimezones();

export default function SettingsPage() {
    const { user, setUser, roadmapSetup, setRoadmapSetup } = useApp();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [toastMessage, setToastMessage] = useState(null);

    function showToast(message) {
        // Force remount of Toast by clearing then setting on the next tick, so
        // rapid successive shows don't skip the fade-in animation.
        setToastMessage(null);
        setTimeout(() => setToastMessage(message), 0);
    }

    // ── Study Plan ──────────────────────────────────────────────────────────
    const [studyPlan, setStudyPlan] = useState({
        selectedTopics: roadmapSetup?.selectedTopics ?? defaultStudyPlan.selectedTopics,
        deadline: roadmapSetup?.deadline ?? defaultStudyPlan.deadline,
        hoursPerDay: roadmapSetup?.hoursPerDay ?? defaultStudyPlan.hoursPerDay,
        dsaLevel: roadmapSetup?.dsaLevel ?? defaultStudyPlan.dsaLevel,
    });
    const [studyPlanSaved, setStudyPlanSaved] = useState(false);

    function toggleStudyTopic(key) {
        const isRemoving = studyPlan.selectedTopics.includes(key);
        if (isRemoving) {
            const { solved } = getTopicStats(key);
            if (solved > 0) {
                const topicLabel = topics.find((t) => t.key === key)?.label || key;
                const ok = window.confirm(
                    `You've already solved ${solved} problem(s) in ${topicLabel}. Removing it from your plan won't delete that progress, but it'll stop showing up in your roadmap and daily queue. Continue?`
                );
                if (!ok) return;
            }
        }
        setStudyPlan((prev) => ({
            ...prev,
            selectedTopics: isRemoving
                ? prev.selectedTopics.filter((k) => k !== key)
                : [...prev.selectedTopics, key],
        }));
        setStudyPlanSaved(false);
    }

    function handleSaveStudyPlan() {
        setRoadmapSetup({ ...roadmapSetup, ...studyPlan });
        setStudyPlanSaved(true);
        showToast('Study plan saved successfully ✅');
    }

    // ── Account ─────────────────────────────────────────────────────────────
    const [accountName, setAccountName] = useState(user?.name ?? '');
    const [accountEmail, setAccountEmail] = useState(user?.email ?? '');
    const [accountSaved, setAccountSaved] = useState(false);

    function handleSaveAccount() {
        setUser({ ...user, name: accountName, email: accountEmail });
        setAccountSaved(true);
        showToast('Account updated successfully ✅');
    }

    function handleSignOut() {
        setUser(null);
        navigate('/login');
    }

    function handleDeleteAccount() {
        const ok = window.confirm(
            'This permanently deletes your account and ALL local progress (solved problems, revision schedules, activity history). This cannot be undone. Are you sure?'
        );
        if (!ok) return;
        clearAllData();
        setUser(null);
        setRoadmapSetup(null);
        navigate('/');
    }

    // ── Preferences (auto-save on every change) ────────────────────────────
    const [prefs, setPrefs] = useState(() => getPreferences());

    function updatePrefs(patch) {
        setPrefs((prev) => {
            const next = { ...prev, ...patch };
            savePreferences(next);
            return next;
        });
    }

    function updateNestedPrefs(group, patch) {
        setPrefs((prev) => {
            const next = { ...prev, [group]: { ...prev[group], ...patch } };
            savePreferences(next);
            return next;
        });
    }

    // handlePresetSelect — picking a named preset copies its tuning values into
    // the individual fields, so revision.js can always just read those fields
    // without caring about preset names. Switching to Custom preserves the
    // current values (nothing to copy) — the user just gains the ability to
    // edit them individually.
    function handlePresetSelect(presetName) {
        if (presetName === 'custom') {
            updateNestedPrefs('revision', { preset: 'custom' });
            return;
        }
        const preset = REVISION_PRESETS[presetName];
        if (!preset) return;
        updateNestedPrefs('revision', { preset: presetName, ...preset });
    }

    function handleResetPreferences() {
        const ok = window.confirm('Reset all preferences below to their defaults? This does not affect your study plan, account, or solved problems.');
        if (!ok) return;
        setPrefs(resetPreferences());
        showToast('Preferences reset to defaults ✅');
    }

    // ── Data management ─────────────────────────────────────────────────────
    const [importMessage, setImportMessage] = useState(null);

    // Auto-dismiss the import message (success or error) after 5s so it
    // doesn't linger indefinitely like the previous implementation.
    function setImportMessageWithAutoDismiss(msg) {
        setImportMessage(msg);
        if (msg) {
            setTimeout(() => setImportMessage(null), 5000);
        }
    }

    function handleImportFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result);
                const count = importAllData(parsed);
                setImportMessageWithAutoDismiss({ type: 'success', text: `Imported ${count} item(s). Reloading…` });
                setTimeout(() => window.location.reload(), 1200);
            } catch (err) {
                setImportMessageWithAutoDismiss({ type: 'error', text: `Couldn't import that file: ${err.message}` });
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // allow re-selecting the same file later
    }

    function handleClearAll() {
        const ok = window.confirm(
            'This clears ALL local progress — solved problems, revision schedules, activity history, and preferences. Your account itself is kept. This cannot be undone. Continue?'
        );
        if (!ok) return;
        clearAllData();
        window.location.reload();
    }

    function handleClearRevisionSchedules() {
        const ok = window.confirm(
            'This clears every scheduled revision (topic-level + section-level) and starts the revision system fresh. Your solved problems, preferences, and account are untouched. Continue?'
        );
        if (!ok) return;
        const removed = clearAllRevisionSchedules();
        showToast(`Cleared ${removed} revision entr${removed === 1 ? 'y' : 'ies'} ✅`);
    }

    const revision = prefs.revision;
    const isCustomPreset = revision.preset === 'custom';

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1>Settings</h1>
                        <p className="page-sub">Your account, study plan, and app preferences.</p>
                    </div>
                </div>

                {/* ── ACCOUNT ────────────────────────────────────────────────── */}
                <Collapsible title="Account" badge={accountSaved && <Badge type="green">Saved ✓</Badge>}>
                    <div className="settings-section-body">
                        <div className="settings-field">
                            <label className="settings-label">Name</label>
                            <input
                                className="settings-input"
                                type="text"
                                value={accountName}
                                onChange={(e) => { setAccountName(e.target.value); setAccountSaved(false); }}
                            />
                        </div>
                        <div className="settings-field">
                            <label className="settings-label">Email</label>
                            <input
                                className="settings-input"
                                type="email"
                                value={accountEmail}
                                onChange={(e) => { setAccountEmail(e.target.value); setAccountSaved(false); }}
                            />
                        </div>
                        <div className="settings-actions-row">
                            <Button variant="primary" onClick={handleSaveAccount}>Save account</Button>
                            <Button onClick={handleSignOut}>Sign out</Button>
                            <Button variant="danger" onClick={handleDeleteAccount}>Delete account</Button>
                        </div>
                    </div>
                </Collapsible>

                {/* ── STUDY PLAN ─────────────────────────────────────────────── */}
                <Collapsible title="Study plan" badge={studyPlanSaved && <Badge type="green">Saved ✓</Badge>}>
                    <div className="settings-section-body">
                        <p className="settings-note">
                            This is the same information you gave during onboarding. Changing it recalculates your
                            roadmap pacing and daily queue immediately — nothing else needs to be redone.
                        </p>

                        <div className="settings-field">
                            <label className="settings-label">Topics</label>
                            <div className="topic-grid">
                                {allTopics.map((t) => (
                                    <TopicChip
                                        key={t.key}
                                        icon={t.icon}
                                        label={t.label}
                                        selected={studyPlan.selectedTopics.includes(t.key)}
                                        onClick={() => toggleStudyTopic(t.key)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="time-field">
                            <label>Deadline</label>
                            <p className="time-hint">Interview date, target date, or just a goal.</p>
                            <input
                                type="date"
                                value={studyPlan.deadline}
                                onChange={(e) => { setStudyPlan((p) => ({ ...p, deadline: e.target.value })); setStudyPlanSaved(false); }}
                            />
                        </div>

                        <div className="time-field">
                            <label>Hours per day you can commit</label>
                            <div className="hours-options">
                                {[1, 2, 3, 4].map((h) => (
                                    <div
                                        key={h}
                                        className={`hours-chip ${studyPlan.hoursPerDay === h ? 'selected' : ''}`}
                                        onClick={() => { setStudyPlan((p) => ({ ...p, hoursPerDay: h })); setStudyPlanSaved(false); }}
                                    >
                                        {h === 4 ? '4+ hrs' : `~${h} hr${h > 1 ? 's' : ''}`}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="time-field">
                            <label>Current DSA level</label>
                            <div className="level-options">
                                {[
                                    { key: 'beginner', title: 'Beginner', desc: 'Just starting out or very rusty' },
                                    { key: 'intermediate', title: 'Intermediate', desc: 'Solved some problems, know the basics' },
                                    { key: 'advanced', title: 'Advanced', desc: 'Comfortable with most topics' },
                                ].map((lvl) => (
                                    <div
                                        key={lvl.key}
                                        className={`level-card ${studyPlan.dsaLevel === lvl.key ? 'selected' : ''}`}
                                        onClick={() => { setStudyPlan((p) => ({ ...p, dsaLevel: lvl.key })); setStudyPlanSaved(false); }}
                                    >
                                        <div className="level-title">{lvl.title}</div>
                                        <div className="level-desc">{lvl.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="settings-actions-row">
                            <Button variant="primary" onClick={handleSaveStudyPlan}>Save study plan</Button>
                        </div>
                    </div>
                </Collapsible>

                {/* ── SOLUTION GATE / ATTEMPT TIMER ──────────────────────────── */}
                <Collapsible title="Attempt timer & solution gate">
                    <div className="settings-section-body">
                        <label className="settings-checkbox-row">
                            <input
                                type="checkbox"
                                checked={prefs.gate.enabled}
                                onChange={(e) => updateNestedPrefs('gate', { enabled: e.target.checked })}
                            />
                            Require a minimum attempt time before the "genuinely attempted" checkbox unlocks
                        </label>

                        {prefs.gate.enabled && (
                            <>
                                <div className="settings-field settings-field-row">
                                    <label className="settings-label">Minimum time</label>
                                    <Select
                                        value={prefs.gate.minSeconds}
                                        onChange={(v) => updateNestedPrefs('gate', { minSeconds: v })}
                                        options={[
                                            { value: 60, label: '1 minute' },
                                            { value: 120, label: '2 minutes' },
                                            { value: 180, label: '3 minutes' },
                                            { value: 300, label: '5 minutes' },
                                            { value: 600, label: '10 minutes' },
                                        ]}
                                    />
                                </div>

                                <label className="settings-checkbox-row">
                                    <input
                                        type="checkbox"
                                        checked={prefs.gate.scaleByDifficulty}
                                        onChange={(e) => updateNestedPrefs('gate', { scaleByDifficulty: e.target.checked })}
                                    />
                                    Scale the minimum by difficulty (shorter for Easy, longer for Hard)
                                </label>

                                <label className="settings-checkbox-row">
                                    <input
                                        type="checkbox"
                                        checked={prefs.gate.bypassIfAlreadyDone}
                                        onChange={(e) => updateNestedPrefs('gate', { bypassIfAlreadyDone: e.target.checked })}
                                    />
                                    Skip the gate for problems I've already solved or viewed before
                                </label>
                            </>
                        )}
                    </div>
                </Collapsible>

                {/* ── REVISION ────────────────────────────────────────────────── */}
                <Collapsible title="Revision">
                    <div className="settings-section-body">
                        <div className="settings-field">
                            <label className="settings-label">Revision pacing</label>
                            <div className="preset-chips">
                                {['aggressive', 'balanced', 'relaxed', 'custom'].map((name) => (
                                    <div
                                        key={name}
                                        className={`preset-chip ${revision.preset === name ? 'selected' : ''}`}
                                        onClick={() => handlePresetSelect(name)}
                                    >
                                        {name[0].toUpperCase() + name.slice(1)}
                                    </div>
                                ))}
                            </div>
                            <p className="settings-subnote">
                                Changes apply to new revisions. Existing schedules keep their current pace.
                            </p>
                        </div>

                        <div className="settings-field settings-field-row">
                            <label className="settings-label">Daily revision goal (caps due list)</label>
                            <input
                                className="settings-input settings-input-narrow"
                                type="number"
                                min={1}
                                max={20}
                                value={revision.dailyGoal}
                                onChange={(e) => updateNestedPrefs('revision', { dailyGoal: Math.max(1, Number(e.target.value) || 1) })}
                            />
                        </div>

                        <label className="settings-checkbox-row">
                            <input
                                type="checkbox"
                                checked={revision.weakTopicsPriority}
                                onChange={(e) => updateNestedPrefs('revision', { weakTopicsPriority: e.target.checked })}
                            />
                            Give weak topics more problems per revision session
                        </label>

                        {isCustomPreset && (
                            <div className="custom-knobs-grid">
                                <div className="settings-field settings-field-row">
                                    <label className="settings-label">First revision after completing a section (days)</label>
                                    <input
                                        className="settings-input settings-input-narrow"
                                        type="number"
                                        min={1}
                                        max={60}
                                        value={revision.sectionCompleteInterval}
                                        onChange={(e) => updateNestedPrefs('revision', { sectionCompleteInterval: Math.max(1, Number(e.target.value) || 1) })}
                                    />
                                </div>
                                <div className="settings-field settings-field-row">
                                    <label className="settings-label">Section is "stuck" after N days idle</label>
                                    <input
                                        className="settings-input settings-input-narrow"
                                        type="number"
                                        min={1}
                                        max={60}
                                        value={revision.stuckThresholdDays}
                                        onChange={(e) => updateNestedPrefs('revision', { stuckThresholdDays: Math.max(1, Number(e.target.value) || 1) })}
                                    />
                                </div>
                                <div className="settings-field settings-field-row">
                                    <label className="settings-label">Section is "long-running" after N days in progress</label>
                                    <input
                                        className="settings-input settings-input-narrow"
                                        type="number"
                                        min={1}
                                        max={90}
                                        value={revision.longRunningThresholdDays}
                                        onChange={(e) => updateNestedPrefs('revision', { longRunningThresholdDays: Math.max(1, Number(e.target.value) || 1) })}
                                    />
                                </div>
                                <div className="settings-field settings-field-row">
                                    <label className="settings-label">First revision after flagging a problem (days)</label>
                                    <input
                                        className="settings-input settings-input-narrow"
                                        type="number"
                                        min={1}
                                        max={30}
                                        value={revision.manualFlagInterval}
                                        onChange={(e) => updateNestedPrefs('revision', { manualFlagInterval: Math.max(1, Number(e.target.value) || 1) })}
                                    />
                                </div>
                                <div className="settings-field settings-field-row">
                                    <label className="settings-label">Problems per revision session</label>
                                    <input
                                        className="settings-input settings-input-narrow"
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={revision.problemsPerSession}
                                        onChange={(e) => updateNestedPrefs('revision', { problemsPerSession: Math.max(1, Number(e.target.value) || 1) })}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </Collapsible>

                {/* ── WEAK-POINT DETECTION ───────────────────────────────────── */}
                <Collapsible title="Weak-point detection">
                    <div className="settings-section-body">
                        <div className="settings-field settings-field-row">
                            <label className="settings-label">Sensitivity</label>
                            <Select
                                value={prefs.weakPoints.sensitivity}
                                onChange={(v) => updateNestedPrefs('weakPoints', { sensitivity: v })}
                                options={[
                                    { value: 'low', label: 'Low — only flag clear struggles' },
                                    { value: 'medium', label: 'Medium — balanced' },
                                    { value: 'high', label: 'High — flag early' },
                                ]}
                            />
                        </div>
                        <label className="settings-checkbox-row">
                            <input
                                type="checkbox"
                                checked={prefs.weakPoints.showCallouts}
                                onChange={(e) => updateNestedPrefs('weakPoints', { showCallouts: e.target.checked })}
                            />
                            Show weak-point callouts on the dashboard and roadmap
                        </label>
                    </div>
                </Collapsible>

                {/* ── CODE PREFERENCES ───────────────────────────────────────── */}
                <Collapsible title="Code preferences">
                    <div className="settings-section-body">
                        <div className="settings-field settings-field-row">
                            <label className="settings-label">Default solution language</label>
                            <Select
                                value={prefs.defaultCodeLanguage}
                                onChange={(v) => updatePrefs({ defaultCodeLanguage: v })}
                                options={[
                                    { value: 'java', label: 'Java' },
                                    { value: 'cpp', label: 'C++' },
                                    { value: 'python', label: 'Python' },
                                ]}
                            />
                        </div>
                    </div>
                </Collapsible>

                {/* ── STREAKS & MOTIVATION ────────────────────────────────────── */}
                <Collapsible title="Streaks & motivation">
                    <div className="settings-section-body">
                        <div className="settings-field settings-field-row">
                            <label className="settings-label">Timezone</label>
                            <Select
                                value={prefs.timezone}
                                onChange={(v) => updatePrefs({ timezone: v })}
                                options={TIMEZONES.map((tz) => ({ value: tz, label: tz }))}
                            />
                        </div>
                        <p className="settings-note">Auto-detected from your browser. Affects what counts as "today" for streaks.</p>

                        <label className="settings-checkbox-row">
                            <input
                                type="checkbox"
                                checked={prefs.motivation.showGreeting}
                                onChange={(e) => updateNestedPrefs('motivation', { showGreeting: e.target.checked })}
                            />
                            Show the greeting message on the dashboard
                        </label>
                        <label className="settings-checkbox-row">
                            <input
                                type="checkbox"
                                checked={prefs.motivation.streakFreeze}
                                onChange={(e) => updateNestedPrefs('motivation', { streakFreeze: e.target.checked })}
                            />
                            Freeze my streak (vacation mode — won't break while this is on)
                        </label>

                        
                    </div>
                </Collapsible>

                {/* ── DATA MANAGEMENT ────────────────────────────────────────── */}
                <Collapsible title="Data management">
                    <div className="settings-section-body">
                        <p className="settings-note">
                            Everything — solved problems, revision schedules, activity history, preferences — is
                            stored locally in this browser only. It won't follow you to another device or browser
                            unless you export and re-import it there.
                        </p>
                        <div className="settings-actions-row">
                            <Button onClick={downloadDataAsFile}>Export backup (.json)</Button>
                            <Button onClick={() => fileInputRef.current?.click()}>Import backup</Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/json"
                                style={{ display: 'none' }}
                                onChange={handleImportFile}
                            />
                            <Button onClick={handleResetPreferences}>Reset preferences</Button>
                            <Button onClick={handleClearRevisionSchedules}>Reset revision schedules</Button>
                            <Button variant="danger" onClick={handleClearAll}>Clear all progress</Button>
                        </div>
                        {importMessage && (
                            <p className={importMessage.type === 'error' ? 'settings-note-error' : 'settings-note-success'}>
                                {importMessage.text}
                            </p>
                        )}
                    </div>
                </Collapsible>
            </main>

            <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
        </div>
    );
}