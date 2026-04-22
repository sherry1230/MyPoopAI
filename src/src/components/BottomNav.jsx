import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Camera, Clock, Settings } from 'lucide-react';
import theme from '../styles/theme';

const navItems = [
  { path: '/home', icon: Home, label: '홈' },
  { path: '/camera', icon: Camera, label: '촬영' },
  { path: '/history', icon: Clock, label: '기록' },
  { path: '/settings', icon: Settings, label: '설정' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '72px',
      background: theme.colors.white,
      borderTop: `1px solid ${theme.colors.border}`,
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '0 8px',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 100,
      boxShadow: '0 -2px 12px rgba(0,0,0,0.04)',
    }}>
      {navItems.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: theme.radius.md,
              transition: 'all 0.2s',
              ...(isActive ? {
                color: theme.colors.primary,
                background: `${theme.colors.primary}15`,
              } : {
                color: theme.colors.textMuted,
              }),
            }}
          >
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span style={{
              fontSize: '11px',
              fontWeight: isActive ? '700' : '500',
            }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
