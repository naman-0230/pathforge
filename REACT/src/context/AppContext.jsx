import { createContext, useContext, useState } from 'react';

// AppContext — the fix for "Sidebar always shows Rahul Sharma no matter who signs up."
//
// Right now, every page reads its own hardcoded data. This context is a single
// place that holds:
//   - user: { name, email }              → set once, at signup
//   - roadmapSetup: { selectedTopics, deadline, hoursPerDay, dsaLevel } → set once, from onboarding
//
// Any component wrapped inside <AppProvider> can read or update these with
// useApp() below — no more passing props down through 5 components (`prop drilling`)
// just to get a name to the Sidebar.
//
// This is intentionally still in-memory only (resets on refresh) — that gap
// gets closed next when we add localStorage persistence.

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // null until signup happens
  const [roadmapSetup, setRoadmapSetup] = useState(null); // null until onboarding finishes

  const value = { user, setUser, roadmapSetup, setRoadmapSetup };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// useApp() — the hook every component uses to read/write this shared state.
// Usage: const { user, roadmapSetup } = useApp();
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an <AppProvider>');
  }
  return context;
}