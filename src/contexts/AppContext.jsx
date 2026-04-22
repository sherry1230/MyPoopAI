import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const STORAGE_KEY = 'mypoopai_state';

const defaultState = {
  user: null,
  isLoggedIn: false,
  mode: 'adult', // 'adult' | 'baby'
  overlayType: 'mosaic', // 'mosaic' | 'sticker'
  history: [],
  babyProfiles: [],
};

function loadState() {
  try {
    const saved = window.sessionStorage?.getItem(STORAGE_KEY);
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(loadState);

  // 상태 변경 시 세션에 저장
  useEffect(() => {
    try {
      window.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  }, [state]);

  const actions = {
    login: (user) => setState(prev => ({
      ...prev,
      user,
      isLoggedIn: true,
    })),

    logout: () => setState(prev => ({
      ...prev,
      user: null,
      isLoggedIn: false,
    })),

    setMode: (mode) => setState(prev => ({ ...prev, mode })),

    setOverlayType: (overlayType) => setState(prev => ({ ...prev, overlayType })),

    addAnalysis: (analysis) => setState(prev => ({
      ...prev,
      history: [analysis, ...prev.history],
    })),

    clearHistory: () => setState(prev => ({ ...prev, history: [] })),

    addBabyProfile: (profile) => setState(prev => ({
      ...prev,
      babyProfiles: [...prev.babyProfiles, profile],
    })),
  };

  return (
    <AppContext.Provider value={{ ...state, ...actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
