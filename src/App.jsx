import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import BottomNav from './components/BottomNav';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import CameraPage from './pages/CameraPage';
import ResultPage from './pages/ResultPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';
import { theme } from './styles/theme';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const onboardingDone = localStorage.getItem('mypoopai_onboarding') === 'done';

  if (loading) return <LoadingScreen />;
  // 온보딩 완료 또는 인증 상태면 진입 허용 (게스트 포함)
  return (isAuthenticated || onboardingDone) ? children : <Navigate to="/" replace />;
}

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', backgroundColor: theme.colors.background,
      fontFamily: theme.fonts.primary,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💩</div>
        <div style={{ color: theme.colors.textMuted, fontSize: '14px' }}>로딩 중...</div>
      </div>
    </div>
  );
}

function AppLayout({ children }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const onboardingDone = localStorage.getItem('mypoopai_onboarding') === 'done';

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/" element={
        (isAuthenticated || onboardingDone) ? <Navigate to="/home" replace /> : <Onboarding />
      } />
      <Route path="/home" element={
        <ProtectedRoute>
          <AppLayout><Home /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/camera" element={
        <ProtectedRoute><CameraPage /></ProtectedRoute>
      } />
      <Route path="/result" element={
        <ProtectedRoute><ResultPage /></ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute><HistoryPage /></ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute><SettingsPage /></ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}
