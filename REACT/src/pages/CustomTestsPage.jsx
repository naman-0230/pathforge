import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';
import Badge from '../components/Badge';
import CustomTestLandingView from '../components/CustomTestLandingView';
import CustomTestTemplateList from '../components/CustomTestTemplateList';
import CustomTestBuilder from '../components/CustomTestBuilder';
import { useApp } from '../context/AppContext.jsx';
import { canAccess } from '../utils/tierGate.js';
import { getTemplates } from '../utils/customTests.js';
import { usePageTitle } from '../utils/usePageTitle.js';
import '../styles/app.css';
import '../styles/simulate.css';
import '../styles/customTests.css';

// CustomTestsPage — hub for user-authored tests. Three sub-views:
//   'list'    → template list, "Create new" button, history summary
//   'create'  → CustomTestBuilder for new template
//   'edit'    → CustomTestBuilder pre-filled with existing template
//
// TIER GATING:
//   Advanced only. Free/Basic users see CustomTestLandingView (the
//   feature-tease page, similar to interview sim's landing).

export default function CustomTestsPage() {
  usePageTitle('Custom Tests');
  const { user, tierLoaded } = useApp();
  const userTier = user?.tier || 'free';
  const hasAccess = canAccess('customTests', userTier);


  const [view, setView] = useState('list');
  const [editingTemplateId, setEditingTemplateId] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    if (!hasAccess) return;
    setTemplates(getTemplates());
  }, [hasAccess, refreshTick]);

  // Wait for real tier to load — prevents flash of gate/list swap
  if (!tierLoaded) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content" />
      </div>
    );
  }

  // Free/Basic tier — show landing page
  if (!hasAccess) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <CustomTestLandingView />
        </main>
      </div>
    );
  }

  function handleCreate() {
    setEditingTemplateId(null);
    setView('create');
  }

  function handleEdit(templateId) {
    setEditingTemplateId(templateId);
    setView('edit');
  }

  function handleBuilderDone() {
    setView('list');
    setEditingTemplateId(null);
    setRefreshTick((n) => n + 1);
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {view === 'list' && (
          <div className="custom-tests-list-view">
            <div className="page-header">
              <div>
                <h1>Custom Tests</h1>
                <p className="page-sub">
                  Design your own tests. Save templates. Track performance over time.
                </p>
              </div>
              <Button variant="primary" onClick={handleCreate}>
                + Create test
              </Button>
            </div>

            <CustomTestTemplateList
              templates={templates}
              onEdit={handleEdit}
              onDeleted={() => setRefreshTick((n) => n + 1)}
              onCreate={handleCreate}
            />
          </div>
        )}

        {(view === 'create' || view === 'edit') && (
          <CustomTestBuilder
            templateId={editingTemplateId}
            onDone={handleBuilderDone}
            onCancel={() => setView('list')}
          />
        )}
      </main>
    </div>
  );
}