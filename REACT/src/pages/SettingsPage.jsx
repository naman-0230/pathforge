import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import TopicChip from '../components/TopicChip';
import Toast from '../components/Toast';
import Collapsible from '../components/Collapsible';
import Select from '../components/Select';
import { useApp } from '../context/AppContext.jsx';
import { supabase } from '../utils/supabaseClient.js';
import { clearLocalData, pushUserData } from '../utils/sync.js';
import { topics } from '../data/topics.js';
import { getTopicStats } from '../utils/progress.js';
import { getPreferences, savePreferences, resetPreferences, REVISION_PRESETS } from '../utils/preferences.js';
import { downloadDataAsFile, importAllData, clearAllData } from '../utils/dataExport.js';
import { clearAllRevisionSchedules } from '../utils/revision.js';
import '../styles/app.css';
import '../styles/onboarding.css';
import '../styles/settings.css';
import { usePageTitle } from '../utils/usePageTitle.js';

const allTopics = topics.map((t) => ({ key: t.key, icon: t.icon, label: t.label }));

const defaultStudyPlan = {
    selectedTopics: allTopics.map((t) => t.key),
    deadline: '',
    hoursPerDay: 2,
    dsaLevel: 'intermediate',
};

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

// ── Confirmation Modal ──────────────────────────────────────────────────
// Reusable themed modal replacing browser's ugly window.confirm().
// Renders only when `config` is non-null.
function ConfirmModal({ config, onClose }) {
    if (!config) return null;
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                animation: 'backdropFadeIn 200ms cubic-bezier(0.4,0,0.2,1) both',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(false); }}
        >
            <div
                style={{
                    background: 'var(--bg-elevated, #1a1a1a)',
                    border: '1px solid var(--border)',
                    borderRadius: 12,
                    padding: 24,
                    maxWidth: 420,
                    width: '90%',
                    animation: 'modalAppear 300ms cubic-bezier(0.34,1.56,0.64,1) both',
                }}
            >
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--text-high)' }}>
                    {config.title}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-mid)', marginBottom: 20, lineHeight: 1.6 }}>
                    {config.message}
                </p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button className="btn btn-sm" onClick={() => onClose(false)}>
                        {config.cancelLabel || 'Cancel'}
                    </button>
                    <button
                        className={`btn btn-sm ${config.danger ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => onClose(true)}
                    >
                        {config.confirmLabel || 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function SettingsPage() {
    usePageTitle('Settings');
    const { user, setUser, roadmapSetup, setRoadmapSetup } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const studyPlanRef = useRef(null);
    const [showSettingsCalendar, setShowSettingsCalendar] = useState(false);

    // Auto-open and scroll to Study Plan when arriving via #study-plan
    const [studyPlanForceOpen, setStudyPlanForceOpen] = useState(false);

    useEffect(() => {
        if (location.hash === '#study-plan') {
            setStudyPlanForceOpen(true);
            setTimeout(() => {
                studyPlanRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }, [location.hash]);
    const fileInputRef = useRef(null);

    const [toastMessage, setToastMessage] = useState(null);

    // ── Confirmation modal state ────────────────────────────────────────
    // config shape: { title, message, confirmLabel, cancelLabel, danger, onConfirm }
    const [confirmModal, setConfirmModal] = useState(null);

    function showConfirm(config) {
        return new Promise((resolve) => {
            setConfirmModal({
                ...config,
                _resolve: resolve,
            });
        });
    }

    function handleConfirmClose(confirmed) {
        if (confirmed && confirmModal?._resolve) {
            confirmModal._resolve(true);
        } else if (confirmModal?._resolve) {
            confirmModal._resolve(false);
        }
        setConfirmModal(null);
    }

    function showToast(message) {
        setToastMessage(null);
        setTimeout(() => setToastMessage(message), 0);
    }

    // ── Study Plan ──────────────────────────────────────────────────────
    const [studyPlan, setStudyPlan] = useState({
        selectedTopics: roadmapSetup?.selectedTopics ?? defaultStudyPlan.selectedTopics,
        deadline: roadmapSetup?.deadline ?? defaultStudyPlan.deadline,
        hoursPerDay: roadmapSetup?.hoursPerDay ?? defaultStudyPlan.hoursPerDay,
        dsaLevel: roadmapSetup?.dsaLevel ?? defaultStudyPlan.dsaLevel,
    });
    const [studyPlanSaved, setStudyPlanSaved] = useState(false);

    async function toggleStudyTopic(key) {
        const isRemoving = studyPlan.selectedTopics.includes(key);
        if (isRemoving) {
            const { solved } = getTopicStats(key);
            if (solved > 0) {
                const topicLabel = topics.find((t) => t.key === key)?.label || key;
                const ok = await showConfirm({
                    title: `Remove ${topicLabel}?`,
                    message: `You've already solved ${solved} problem(s) in ${topicLabel}. Removing it from your plan won't delete that progress, but it'll stop showing up in your roadmap and daily queue.`,
                    confirmLabel: 'Remove topic',
                    danger: true,
                });
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
        if (user?.id) pushUserData(user.id);
    }

    // ── Account ─────────────────────────────────────────────────────────
    const [accountName, setAccountName] = useState(user?.name ?? '');
    const [accountEmail, setAccountEmail] = useState(user?.email ?? '');
    const [accountSaved, setAccountSaved] = useState(false);

    // ── Password change ─────────────────────────────────────────────────
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [currentPasswordVerified, setCurrentPasswordVerified] = useState(false);
    const [currentPasswordError, setCurrentPasswordError] = useState(null);
    const [verifyingPassword, setVerifyingPassword] = useState(false);

    async function handleVerifyCurrentPassword() {
        setCurrentPasswordError(null);
        setVerifyingPassword(true);

        // Re-authenticate by signing in with current credentials.
        // This verifies the user actually knows their current password
        // before allowing them to set a new one.
        const { error } = await supabase.auth.signInWithPassword({
            email: user?.email,
            password: currentPassword,
        });

        setVerifyingPassword(false);

        if (error) {
            setCurrentPasswordError('Incorrect password. Please try again.');
            setCurrentPasswordVerified(false);
            return;
        }

        setCurrentPasswordVerified(true);
        setCurrentPasswordError(null);
    }

    async function handleChangePassword() {
        setPasswordError(null);
        setPasswordSaved(false);

        if (!currentPasswordVerified) {
            setPasswordError('Please verify your current password first.');
            return;
        }

        if (newPassword.length < 8) {
            setPasswordError('New password must be at least 8 characters.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            setPasswordError(error.message);
            return;
        }

        setPasswordSaved(true);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setCurrentPasswordVerified(false);
        showToast('Password updated successfully ✅');
    }

    async function handleSaveAccount() {
        const { error } = await supabase.auth.updateUser({
            data: { name: accountName.trim() },
        });

        if (error) {
            showToast('Failed to update account ❌');
            return;
        }

        setUser({ ...user, name: accountName.trim() });
        setAccountSaved(true);
        showToast('Account updated successfully ✅');
        if (user?.id) pushUserData(user.id);
    }

    async function handleSignOut() {
        const ok = await showConfirm({
            title: 'Sign out?',
            message: 'Your progress is saved and will be here when you come back.',
            confirmLabel: 'Sign out',
        });
        if (!ok) return;

        await supabase.auth.signOut();
        clearLocalData();
        navigate('/login');
    }

    async function handleDeleteAccount() {
        const ok = await showConfirm({
            title: 'Delete your account?',
            message: 'This permanently deletes your account and ALL progress — solved problems, revision schedules, activity history. This cannot be undone.',
            confirmLabel: 'Delete everything',
            danger: true,
        });
        if (!ok) return;

        try {
            // Call the Edge Function to delete the auth user server-side.
            // This also cascades to user_data via ON DELETE CASCADE.
            const { data: { session } } = await supabase.auth.getSession();
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                const err = await response.json();
                showToast(`Failed to delete account: ${err.error || 'Unknown error'} ❌`);
                return;
            }
        } catch (err) {
            showToast('Failed to delete account. Please try again. ❌');
            return;
        }

        // Sign out locally and clear all data
        await supabase.auth.signOut();
        clearLocalData();
        setRoadmapSetup(null);
        navigate('/');
    }

    // ── Preferences ─────────────────────────────────────────────────────
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

    function handlePresetSelect(presetName) {
        if (presetName === 'custom') {
            updateNestedPrefs('revision', { preset: 'custom' });
            return;
        }
        const preset = REVISION_PRESETS[presetName];
        if (!preset) return;
        updateNestedPrefs('revision', { preset: presetName, ...preset });
    }

    async function handleResetPreferences() {
        const ok = await showConfirm({
            title: 'Reset preferences?',
            message: 'This resets all preferences to their defaults. Your study plan, account, and solved problems are not affected.',
            confirmLabel: 'Reset',
        });
        if (!ok) return;
        setPrefs(resetPreferences());
        showToast('Preferences reset to defaults ✅');
    }

    // ── Data management ─────────────────────────────────────────────────
    const [importMessage, setImportMessage] = useState(null);

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
        e.target.value = '';
    }

    async function handleClearAll() {
        const ok = await showConfirm({
            title: 'Clear all progress?',
            message: 'This clears ALL local progress — solved problems, revision schedules, activity history, and preferences. Your account itself is kept. This cannot be undone.',
            confirmLabel: 'Clear everything',
            danger: true,
        });
        if (!ok) return;
        clearAllData();
        window.location.reload();
    }

    async function handleClearRevisionSchedules() {
        const ok = await showConfirm({
            title: 'Reset revision schedules?',
            message: 'This clears every scheduled revision (topic-level + section-level) and starts the revision system fresh. Your solved problems, preferences, and account are untouched.',
            confirmLabel: 'Reset schedules',
        });
        if (!ok) return;
        const removed = clearAllRevisionSchedules();
        showToast(`Cleared ${removed} revision entr${removed === 1 ? 'y' : 'ies'} ✅`);
    }

    const revision = prefs.revision;
    const isCustomPreset = revision.preset === 'custom';

    // Password section: fields are disabled until current password is verified
    const passwordFieldsLocked = !currentPasswordVerified;

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

                {/* ── ACCOUNT ────────────────────────────────────────────── */}
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
                                disabled
                                style={{ opacity: 0.6, cursor: 'not-allowed' }}
                            />
                            <span className="settings-note">
                                {user?.provider === 'google'
                                    ? 'Email is managed by your Google account.'
                                    : 'Email changes require verification. This will be available once email sending is configured.'}
                            </span>
                        </div>
                        <div className="settings-actions-row">
                            <Button variant="primary" onClick={handleSaveAccount}>Save account</Button>
                            <Button onClick={handleSignOut}>Sign out</Button>
                            <Button variant="danger" onClick={handleDeleteAccount}>Delete account</Button>
                        </div>

                        {/* Password change — only for email/password users */}
                        {user?.provider === 'email' && (
                            <div style={{
                                borderTop: '1px solid var(--border)',
                                paddingTop: 16,
                                marginTop: 8,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 12,
                            }}>
                                <label className="settings-label" style={{ fontSize: 14, fontWeight: 600 }}>
                                    Change password
                                </label>

                                {/* Step 1: Verify current password */}
                                <div className="settings-field">
                                    <label className="settings-label">Current password</label>
                                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <input
                                                className="settings-input"
                                                type={showPasswords ? 'text' : 'password'}
                                                value={currentPassword}
                                                onChange={(e) => {
                                                    setCurrentPassword(e.target.value);
                                                    setCurrentPasswordVerified(false);
                                                    setCurrentPasswordError(null);
                                                }}
                                                placeholder="••••••••"
                                                disabled={currentPasswordVerified}
                                                style={{
                                                    width: '100%',
                                                    paddingRight: 40,
                                                    ...(currentPasswordVerified ? { borderColor: 'var(--green)', opacity: 0.7 } : {}),
                                                    ...(currentPasswordError ? { borderColor: 'var(--red)' } : {}),
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords((v) => !v)}
                                                style={{
                                                    position: 'absolute',
                                                    right: 8,
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    color: 'var(--text-low)',
                                                    cursor: 'pointer',
                                                    fontSize: 14,
                                                    padding: '4px 6px',
                                                    lineHeight: 1,
                                                }}
                                                tabIndex={-1}
                                            >
                                                {showPasswords ? '🙈' : '👁'}
                                            </button>
                                        </div>
                                        {!currentPasswordVerified ? (
                                            <Button
                                                onClick={handleVerifyCurrentPassword}
                                                disabled={!currentPassword || verifyingPassword}
                                                style={{ whiteSpace: 'nowrap' }}
                                            >
                                                {verifyingPassword ? 'Checking...' : 'Verify'}
                                            </Button>
                                        ) : (
                                            <span style={{
                                                fontSize: 12,
                                                color: 'var(--green)',
                                                fontWeight: 600,
                                                whiteSpace: 'nowrap',
                                                padding: '8px 0',
                                            }}>
                                                ✓ Verified
                                            </span>
                                        )}
                                    </div>
                                    {currentPasswordError && (
                                        <div style={{
                                            fontSize: 12,
                                            color: 'var(--red, #e35b5b)',
                                            marginTop: 4,
                                        }}>
                                            {currentPasswordError}
                                        </div>
                                    )}
                                </div>

                                {/* Step 2: New password fields — locked until verified */}
                                <div className="settings-field" style={{
                                    opacity: passwordFieldsLocked ? 0.4 : 1,
                                    pointerEvents: passwordFieldsLocked ? 'none' : 'auto',
                                    transition: 'opacity 0.2s ease',
                                }}>
                                    <label className="settings-label">New password</label>
                                    <input
                                        className="settings-input"
                                        type={showPasswords ? 'text' : 'password'}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min 8 characters"
                                        disabled={passwordFieldsLocked}
                                    />
                                </div>

                                <div className="settings-field" style={{
                                    opacity: passwordFieldsLocked ? 0.4 : 1,
                                    pointerEvents: passwordFieldsLocked ? 'none' : 'auto',
                                    transition: 'opacity 0.2s ease',
                                }}>
                                    <label className="settings-label">Confirm new password</label>
                                    <input
                                        className="settings-input"
                                        type={showPasswords ? 'text' : 'password'}
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        placeholder="Type it again"
                                        disabled={passwordFieldsLocked}
                                    />
                                </div>

                                {passwordError && (
                                    <div style={{
                                        fontSize: 12,
                                        color: 'var(--red, #e35b5b)',
                                        background: 'rgba(227,91,91,0.08)',
                                        border: '1px solid rgba(227,91,91,0.2)',
                                        borderRadius: 6,
                                        padding: '8px 12px',
                                    }}>
                                        {passwordError}
                                    </div>
                                )}

                                {passwordSaved && (
                                    <div style={{
                                        fontSize: 12,
                                        color: 'var(--green)',
                                        background: 'var(--state-success-bg)',
                                        border: '1px solid rgba(74,222,128,0.2)',
                                        borderRadius: 6,
                                        padding: '8px 12px',
                                    }}>
                                        Password updated successfully.
                                    </div>
                                )}

                                <div className="settings-actions-row" style={{
                                    opacity: passwordFieldsLocked ? 0.4 : 1,
                                    pointerEvents: passwordFieldsLocked ? 'none' : 'auto',
                                    transition: 'opacity 0.2s ease',
                                }}>
                                    <Button
                                        variant="primary"
                                        onClick={handleChangePassword}
                                        disabled={passwordFieldsLocked || !newPassword || !confirmNewPassword}
                                    >
                                        Update password
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Collapsible>

                {/* ── STUDY PLAN ─────────────────────────────────────────── */}
                <div ref={studyPlanRef}>
                    <Collapsible title="Study plan" badge={studyPlanSaved && <Badge type="green">Saved ✓</Badge>} forceOpen={studyPlanForceOpen}>
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

                                {/* Quick-pick chips */}
                                <div className="hours-options">
                                    {[
                                        { label: '1 month', days: 30 },
                                        { label: '2 months', days: 60 },
                                        { label: '3 months', days: 90 },
                                        { label: '6 months', days: 180 },
                                        { label: 'No deadline', days: null },
                                    ].map((opt) => {
                                        const optDate = opt.days
                                            ? new Date(Date.now() + opt.days * 86400000).toISOString().split('T')[0]
                                            : '';
                                        const isSelected = studyPlan.deadline === optDate;
                                        return (
                                            <div
                                                key={opt.label}
                                                className={`hours-chip ${isSelected ? 'selected' : ''}`}
                                                onClick={() => {
                                                    setStudyPlan((p) => ({ ...p, deadline: optDate }));
                                                    setStudyPlanSaved(false);
                                                }}
                                            >
                                                {opt.label}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Expandable exact-date calendar */}
                                <div style={{ marginTop: 10 }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowSettingsCalendar((v) => !v)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--text-mid)',
                                            cursor: 'pointer',
                                            fontSize: 12,
                                            padding: '4px 0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 6,
                                            fontFamily: 'inherit',
                                        }}
                                    >
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                transition: 'transform 0.25s ease',
                                                transform: showSettingsCalendar ? 'rotate(90deg)' : 'rotate(0deg)',
                                            }}
                                        >
                                            ▶
                                        </span>
                                        Or pick an exact date
                                    </button>

                                    <div className={`calendar-wrapper ${showSettingsCalendar ? 'open' : ''}`}>
                                        <div className="calendar-inner">
                                            <DayPicker
                                                mode="single"
                                                selected={studyPlan.deadline ? new Date(studyPlan.deadline) : undefined}
                                                onSelect={(date) => {
                                                    const val = date ? format(date, 'yyyy-MM-dd') : '';
                                                    setStudyPlan((p) => ({ ...p, deadline: val }));
                                                    setStudyPlanSaved(false);
                                                }}
                                                disabled={{ before: new Date() }}
                                                className="pathforge-calendar"
                                            />
                                            {studyPlan.deadline && (
                                                <p key={studyPlan.deadline} className="deadline-selected-text">
                                                    Selected: <strong style={{ color: 'var(--text-high)' }}>
                                                        {format(new Date(studyPlan.deadline), 'MMM d, yyyy')}
                                                    </strong>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="time-field">
                                <label>Hours per day you can commit</label>
                                <div className="hours-options">
                                    {[1, 2, 3, 4, 5, 6, 8].map((h) => (
                                        <div
                                            key={h}
                                            className={`hours-chip ${studyPlan.hoursPerDay === h ? 'selected' : ''}`}
                                            onClick={() => { setStudyPlan((p) => ({ ...p, hoursPerDay: h })); setStudyPlanSaved(false); }}
                                        >
                                            {h === 8 ? '8+ hrs' : `~${h} hr${h > 1 ? 's' : ''}`}
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
                </div>

                {/* ── SOLUTION GATE / ATTEMPT TIMER ──────────────────────── */}
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

                {/* ── REVISION ────────────────────────────────────────────── */}
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

                {/* ── WEAK-POINT DETECTION ───────────────────────────────── */}
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
                                {/* ── ADAPTIVE DIFFICULTY ────────────────────────────────── */}
                <Collapsible title="Adaptive difficulty">
                    <div className="settings-section-body">
                        <p className="settings-note">
                            When enabled, your roadmap quietly reorders itself based on how you're doing.
                            Crushing a topic? A harder problem gets pulled forward. Struggling with recent
                            problems? An easier one gets promoted. Mastered the fundamentals? A boss fight
                            unlocks earlier. Every adjustment shows a small badge on the affected problem
                            so you always know why it changed.
                        </p>
                        <label className="settings-checkbox-row">
                            <input
                                type="checkbox"
                                checked={prefs.adaptive.enabled}
                                onChange={(e) => updateNestedPrefs('adaptive', { enabled: e.target.checked })}
                            />
                            Automatically adapt my day plan to my recent performance
                        </label>
                        {!prefs.adaptive.enabled && (
                            <p className="settings-subnote">
                                Existing adjustments stay in place until you click "Recalculate ⚡" on the
                                roadmap page. Turning this off only stops NEW adjustments.
                            </p>
                        )}
                    </div>
                </Collapsible>
                {/* ── CODE PREFERENCES ───────────────────────────────────── */}
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

                {/* ── STREAKS & MOTIVATION ────────────────────────────────── */}
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

                {/* ── DATA MANAGEMENT ────────────────────────────────────── */}
                <Collapsible title="Data management">
                    <div className="settings-section-body">
                        <p className="settings-note">
                            Your progress is synced to your account automatically. You can also export a local backup
                            or clear your data from this device.
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

            {/* Confirmation modal */}
            <ConfirmModal config={confirmModal} onClose={handleConfirmClose} />

            <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
        </div>
    );
}