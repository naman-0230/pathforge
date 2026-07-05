import { createContext, useContext, useState, useEffect } from 'react';
import { loadJSON, saveJSON } from '../utils/storage.js';

// AppContext — the fix for "Sidebar always shows Rahul Sharma no matter who signs up."
//
// KEY CHANGE: this used to be in-memory only — a refresh wiped everything.
// Now, user/roadmapSetup are loaded from localStorage the moment the app starts
// (useState's initializer function below), and a useEffect saves them back to
// localStorage every time either one changes. Nothing about how other components
// call useApp() needs to change — they just stop losing data on refresh.

const AppContext = createContext(null);

const USER_KEY = 'pathforge:user';
const ROADMAP_SETUP_KEY = 'pathforge:roadmapSetup';

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => loadJSON(USER_KEY, null));
  const [roadmapSetup, setRoadmapSetup] = useState(() => loadJSON(ROADMAP_SETUP_KEY, null));

  useEffect(() => {
    saveJSON(USER_KEY, user);
  }, [user]);

  useEffect(() => {
    saveJSON(ROADMAP_SETUP_KEY, roadmapSetup);
  }, [roadmapSetup]);

  const value = { user, setUser, roadmapSetup, setRoadmapSetup };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside an <AppProvider>');
  }
  return context;
}