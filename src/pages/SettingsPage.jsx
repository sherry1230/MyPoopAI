import { useApp } from '../contexts/AppContext';
import { Grid3x3, Baby, User, LogOut, Shield, Info, Moon, Bell } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import theme from '../styles/theme';
import { useNavigate } from 'react-router-dom';

function SettingRow({ icon: Icon, label, description, children, onClick }) {
  const Wrapper = onClick ? 'button' : 'div';
  return (
    <Wrapper
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: `1px solid ${theme.colors.border}`,
        background: 'none',
        border: 'none',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: theme.colors.border,
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: theme.radius.sm,
          background: `${theme.colors.primary}12`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Icon size={18} color={theme.colors.primary} />
        </div>
        <div>
          <div style={{ fontSize: '15px', fontWeight: '600', color: theme.colors.text }}>
            {label}
          </div>
          {description && (
            <div style={{ fontSize: '12px', color: theme.colors.textMuted, marginTop: '2px' }}>
              {description}
            </div>
          )}
        </div>
      </div>
      {children}
    </Wrapper>
  );
}

function Toggle({ active, onToggle }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      style={{
        width: '48px',
        height: '28px',
        borderRadius: '14px',
        background: active ? theme.colors.primary : theme.colors.border,
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{
        width: '22px',
        height: '22px',
        borderRadius: '11px',
        background: '#fff',
        position: 'absolute',
        top: '3px',
        left: active ? '23px' : '3px',
        transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
      }} />
    </button>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const { mode, overlayType, setMode, setOverlayType, logout, user } = useApp();

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.colors.background,
      padding: '24px 20px 100px',
      fontFamily: theme.fonts.primary,
    }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '800',
        color: theme.colors.text,
        margin: '0 0 24px',
      }}>
        설정
      </h1>

      {/* 프로필 카드 */}
      <div style={{
        background: theme.colors.white,
        borderRadius: theme.radius.lg,
        padding: '20px',
        marginBottom: '20px',
        boxShadow: theme.shadow.sm,
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: theme.radius.full,
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.accent})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}>
          💩
        </div>
        <div>
          <div style={{ fontSize: '17px', fontWeight: '700', color: theme.colors.text }}>
            {user?.name || '사용자'}
          </div>
          <div style={{ fontSize: '13px', color: theme.colors.textMuted }}>
            {mode === 'baby' ? '아기 모드 사용 중' : '성인 모드 사용 중'}
          </div>
        </div>
      </div>

      {/* 앱 설정 */}
      <div style={{
        background: theme.colors.white,
        borderRadius: theme.radius.lg,
        padding: '4px 20px',
        marginBottom: '20px',
        boxShadow: theme.shadow.sm,
      }}>
        <h2 style={{
          fontSize: '13px',
          fontWeight: '700',
          color: theme.colors.textMuted,
          margin: '16px 0 4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          앱 설정
        </h2>

        <SettingRow
          icon={Baby}
          label="아기 모드"
          description="My Baby 💩 모드로 전환"
        >
          <Toggle
            active={mode === 'baby'}
            onToggle={() => setMode(mode === 'baby' ? 'adult' : 'baby')}
          />
        </SettingRow>

        <SettingRow
          icon={Grid3x3}
          label="기본 오버레이"
          description={overlayType === 'mosaic' ? '모자이크로 가리기' : '귀여운 스티커로 가리기'}
        >
          <div style={{ display: 'flex', gap: '4px' }}>
            {['mosaic', 'sticker'].map(type => (
              <button
                key={type}
                onClick={() => setOverlayType(type)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: overlayType === type
                    ? `2px solid ${theme.colors.primary}`
                    : `1px solid ${theme.colors.border}`,
                  background: overlayType === type ? `${theme.colors.primary}15` : 'transparent',
                  color: overlayType === type ? theme.colors.primary : theme.colors.textMuted,
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {type === 'mosaic' ? '모자이크' : '스티커'}
              </button>
            ))}
          </div>
        </SettingRow>
      </div>

      {/* 정보 */}
      <div style={{
        background: theme.colors.white,
        borderRadius: theme.radius.lg,
        padding: '4px 20px',
        marginBottom: '20px',
        boxShadow: theme.shadow.sm,
      }}>
        <h2 style={{
          fontSize: '13px',
          fontWeight: '700',
          color: theme.colors.textMuted,
          margin: '16px 0 4px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}>
          정보
        </h2>

        <SettingRow
          icon={Shield}
          label="개인정보 처리방침"
          description="AI만 원본을 봅니다"
          onClick={() => {}}
        />

        <SettingRow
          icon={Info}
          label="앱 버전"
          description="MyPoopAI MVP v0.1.0"
        />
      </div>

      {/* 로그아웃 */}
      <button
        onClick={() => { logout(); navigate('/'); }}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: theme.radius.lg,
          background: theme.colors.white,
          color: theme.colors.danger,
          border: `1px solid ${theme.colors.danger}20`,
          fontSize: '15px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <LogOut size={18} /> 로그아웃
      </button>

      <BottomNav />
    </div>
  );
}
