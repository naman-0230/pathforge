import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import TopicChip from '../components/TopicChip';
import { useApp } from '../context/AppContext.jsx';
import { topics } from '../data/topics.js';
import { getTopicStats } from '../utils/progress.js';
import { getPreferences, savePreferences, resetPreferences } from '../utils/preferences.js';
import { downloadDataAsFile, importAllData, clearAllData } from '../utils/dataExport.js';
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


const allTopics = topics.map((t) => ({ key: t.key, icon: t.icon, label: t.label }));

const defaultStudyPlan = {
    selectedTopics: allTopics.map((t) => t.key),
    deadline: '',
    hoursPerDay: 2,
    dsaLevel: 'intermediate',
};

export default function SettingsPage() {
    const { user, setUser, roadmapSetup, setRoadmapSetup } = useApp();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Toast — fixed-position, non-blocking confirmation for "recalculated".
    // Doesn't shift any other layout since it's position:fixed, and animates
    // in/out via CSS transition rather than popping in/out abruptly.
    const [toast, setToast] = useState(null); // { message } | null
    const [toastVisible, setToastVisible] = useState(false);
    const toastHideTimer = useRef(null);
    const toastRemoveTimer = useRef(null);

    function showToast(message) {
        clearTimeout(toastHideTimer.current);
        clearTimeout(toastRemoveTimer.current);

        setToast({ message });
        setToastVisible(false);
        // Double rAF: ensures the "hidden" state actually paints before we flip
        // to visible, so the transition has something to animate from.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setToastVisible(true));
        });

        toastHideTimer.current = setTimeout(() => {
            setToastVisible(false);
            toastRemoveTimer.current = setTimeout(() => setToast(null), 300); // matches CSS transition duration
        }, 4000);
    }

    useEffect(() => {
        return () => {
            clearTimeout(toastHideTimer.current);
            clearTimeout(toastRemoveTimer.current);
        };
    }, []);

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

    // ── Preferences (code language, gate, revision, weak points, motivation) ─
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

    function handleResetPreferences() {
        const ok = window.confirm('Reset all preferences below to their defaults? This does not affect your study plan, account, or solved problems.');
        if (!ok) return;
        setPrefs(resetPreferences());
    }

    // ── Data management ─────────────────────────────────────────────────────
    const [importMessage, setImportMessage] = useState(null);

    function handleImportFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result);
                const count = importAllData(parsed);
                setImportMessage({ type: 'success', text: `Imported ${count} item(s). Reloading…` });
                setTimeout(() => window.location.reload(), 1200);
            } catch (err) {
                setImportMessage({ type: 'error', text: `Couldn't import that file: ${err.message}` });
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

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                <div className="page-header">
                    <div>
                        <h1>Settings</h1>
                        <p className="page-sub">Your study plan, account, and app preferences.</p>
                    </div>
                </div>

                {/* ── STUDY PLAN ─────────────────────────────────────────────── */}
                <div className="section-box settings-section" id="study-plan">
                    <div className="section-box-header">
                        <span className="section-box-title">Study plan</span>
                        {studyPlanSaved && <Badge type="green">Saved ✓</Badge>}
                    </div>
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
                </div>

                {/* ── ACCOUNT ────────────────────────────────────────────────── */}
                <div className="section-box settings-section">
                    <div className="section-box-header">
                        <span className="section-box-title">Account</span>
                        {accountSaved && <Badge type="green">Saved ✓</Badge>}
                    </div>
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
                </div>

                {/* ── CODE PREFERENCES ───────────────────────────────────────── */}
                <div className="section-box settings-section">
                    <div className="section-box-header">
                        <span className="section-box-title">Code preferences</span>
                    </div>
                    <div className="settings-section-body">
                        <div className="settings-field settings-field-row">
                            <label className="settings-label">Default solution language</label>
                            <select
                                className="settings-select"
                                value={prefs.defaultCodeLanguage}
                                onChange={(e) => updatePrefs({ defaultCodeLanguage: e.target.value })}
                            >
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="python">Python</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── SOLUTION GATE / ATTEMPT TIMER ──────────────────────────── */}
                <div className="section-box settings-section">
                    <div className="section-box-header">
                        <span className="section-box-title">Attempt timer & solution gate</span>
                    </div>
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
                                    <select
                                        className="settings-select"
                                        value={prefs.gate.minSeconds}
                                        onChange={(e) => updateNestedPrefs('gate', { minSeconds: Number(e.target.value) })}
                                    >
                                        <option value={60}>1 minute</option>
                                        <option value={120}>2 minutes</option>
                                        <option value={180}>3 minutes</option>
                                        <option value={300}>5 minutes</option>
                                        <option value={600}>10 minutes</option>
                                    </select>
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
                </div>

                {/* ── REVISION ────────────────────────────────────────────────── */}
                <div className="section-box settings-section">
                    <div className="section-box-header">
                        <span className="section-box-title">Revision</span>
                    </div>
                    <div className="settings-section-body">
                        <div className="settings-field settings-field-row">
                            <label className="settings-label">Daily revision goal</label>
                            <input
                                className="settings-input settings-input-narrow"
                                type="number"
                                min={1}
                                max={20}
                                value={prefs.revision.dailyGoal}
                                onChange={(e) => updateNestedPrefs('revision', { dailyGoal: Math.max(1, Number(e.target.value) || 1) })}
                            />
                        </div>
                        <label className="settings-checkbox-row">
                            <input
                                type="checkbox"
                                checked={prefs.revision.weakTopicsPriority}
                                onChange={(e) => updateNestedPrefs('revision', { weakTopicsPriority: e.target.checked })}
                            />
                            Prioritize weak topics in revision scheduling
                        </label>
                    </div>
                </div>

                {/* ── WEAK-POINT DETECTION ───────────────────────────────────── */}
                <div className="section-box settings-section">
                    <div className="section-box-header">
                        <span className="section-box-title">Weak-point detection</span>
                    </div>
                    <div className="settings-section-body">
                        <div className="settings-field settings-field-row">
                            <label className="settings-label">Sensitivity</label>
                            <select
                                className="settings-select"
                                value={prefs.weakPoints.sensitivity}
                                onChange={(e) => updateNestedPrefs('weakPoints', { sensitivity: e.target.value })}
                            >
                                <option value="low">Low — only flag clear struggles</option>
                                <option value="medium">Medium — balanced</option>
                                <option value="high">High — flag early</option>
                            </select>
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
                </div>

                {/* ── STREAKS & MOTIVATION ────────────────────────────────────── */}
                <div className="section-box settings-section">
                    <div className="section-box-header">
                        <span className="section-box-title">Streaks & motivation</span>
                    </div>
                    <div className="settings-section-body">
                        <div className="settings-field settings-field-row">
                            <label className="settings-label">Timezone</label>
                            <input
                                className="settings-input"
                                type="text"
                                value={prefs.timezone}
                                onChange={(e) => updatePrefs({ timezone: e.target.value })}
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
                </div>

                <div className="settings-actions-row" style={{ marginBottom: 16 }}>
                    <Button onClick={handleResetPreferences}>Reset preferences to default</Button>
                </div>

                {/* ── DATA MANAGEMENT ────────────────────────────────────────── */}
                <div className="section-box settings-section">
                    <div className="section-box-header">
                        <span className="section-box-title">Data management</span>
                    </div>
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
                            <Button variant="danger" onClick={handleClearAll}>Clear all progress</Button>
                        </div>
                        {importMessage && (
                            <p className={importMessage.type === 'error' ? 'settings-note-error' : 'settings-note-success'}>
                                {importMessage.text}
                            </p>
                        )}
                    </div>
                </div>
            </main>
            {/* Fixed-position toast — doesn't affect layout of anything else,
          animates in/out via CSS transition rather than popping abruptly. */}
            {toast && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: 24,
                        right: 24,
                        zIndex: 1000,
                        padding: '10px 16px',
                        borderRadius: 8,
                        fontSize: 13,
                        background: 'var(--grey, #112711)',
                        border: '1px solid var(--grey, #15301b)',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
                        opacity: toastVisible ? 1 : 0,
                        transform: toastVisible ? 'translateY(0)' : 'translateY(12px)',
                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                        pointerEvents: 'none',
                    }}
                >
                    {toast.message}
                </div>
            )}
        </div>
    );
}