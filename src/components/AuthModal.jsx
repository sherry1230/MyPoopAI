import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../styles/theme';

const AUTH_ERRORS = {
  'auth/email-already-in-use': '이미 사용 중인 이메일이에요',
  'auth/invalid-email': '유효하지 않은 이메일이에요',
  'auth/weak-password': '비밀번호가 너무 짧아요 (6자 이상)',
  'auth/user-not-found': '등록되지 않은 이메일이에요',
  'auth/wrong-password': '비밀번호가 틀렸어요',
  'auth/invalid-credential': '이메일 또는 비밀번호가 틀렸어요',
  'auth/too-many-requests': '너무 많이 시도했어요. 잠시 후 다시 해주세요',
  'auth/popup-closed-by-user': '로그인 창이 닫혔어요',
  'auth/credential-already-in-use': '이미 다른 계정에 연결된 정보예요',
};

export default function AuthModal({ isOpen, onClose, isUpgrade = false }) {
  const { loginWithEmail, signupWithEmail, loginWithGoogle, loginWithApple, loginWithKakao, upgradeGuestAccount } = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleError = (err) => {
    const code = err.code || '';
    setError(AUTH_ERRORS[code] || err.message || '오류가 발생했어요');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isUpgrade) {
        await upgradeGuestAccount('email', email, password);
      } else if (tab === 'login') {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      handleError(err);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      if (isUpgrade) {
        await upgradeGuestAccount('google');
      } else {
        await loginWithGoogle();
      }
      onClose();
    } catch (err) {
      handleError(err);
    }
    setLoading(false);
  };

  const handleKakao = async () => {
    setError('');
    setLoading(true);
    try {
      if (isUpgrade) {
        await upgradeGuestAccount('kakao');
      } else {
        await loginWithKakao();
      }
      onClose();
    } catch (err) {
      handleError(err);
    }
    setLoading(false);
  };

  const handleApple = async () => {
    setError('');
    setLoading(true);
    try {
      if (isUpgrade) {
        await upgradeGuestAccount('apple');
      } else {
        await loginWithApple();
      }
      onClose();
    } catch (err) {
      handleError(err);
    }
    setLoading(false);
  };

  const styles = {
    overlay: {
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: theme.colors.overlay,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    },
    modal: {
      backgroundColor: theme.colors.background,
      borderRadius: `${theme.radius.xl} ${theme.radius.xl} 0 0`,
      width: '100%', maxWidth: '480px',
      padding: '32px 24px',
      maxHeight: '85vh', overflowY: 'auto',
      animation: 'slideUp 0.3s ease',
    },
    title: {
      fontSize: '22px', fontWeight: 700,
      color: theme.colors.text,
      textAlign: 'center', marginBottom: '24px',
    },
    tabs: {
      display: 'flex', gap: '4px',
      backgroundColor: theme.colors.border,
      borderRadius: theme.radius.md,
      padding: '4px', marginBottom: '20px',
    },
    tab: (active) => ({
      flex: 1, padding: '10px', border: 'none',
      borderRadius: theme.radius.sm, cursor: 'pointer',
      fontWeight: 600, fontSize: '14px',
      backgroundColor: active ? theme.colors.white : 'transparent',
      color: active ? theme.colors.text : theme.colors.textMuted,
      transition: 'all 0.2s',
    }),
    input: {
      width: '100%', padding: '14px 16px',
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius.md,
      fontSize: '16px', outline: 'none',
      backgroundColor: theme.colors.white,
      marginBottom: '12px', boxSizing: 'border-box',
      fontFamily: theme.fonts.primary,
    },
    submitBtn: {
      width: '100%', padding: '16px', border: 'none',
      borderRadius: theme.radius.md, cursor: 'pointer',
      fontWeight: 700, fontSize: '16px',
      backgroundColor: theme.colors.primary,
      color: theme.colors.white,
      marginBottom: '12px',
      opacity: loading ? 0.6 : 1,
    },
    divider: {
      display: 'flex', alignItems: 'center',
      gap: '12px', margin: '16px 0',
      color: theme.colors.textMuted, fontSize: '13px',
    },
    dividerLine: {
      flex: 1, height: '1px',
      backgroundColor: theme.colors.border,
    },
    socialBtn: (bg, color) => ({
      width: '100%', padding: '14px', border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.radius.md, cursor: 'pointer',
      fontWeight: 600, fontSize: '15px',
      backgroundColor: bg, color,
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: '10px',
      marginBottom: '10px',
    }),
    error: {
      backgroundColor: theme.colors.dangerLight,
      color: theme.colors.danger,
      padding: '12px', borderRadius: theme.radius.sm,
      fontSize: '14px', marginBottom: '12px',
      textAlign: 'center',
    },
    closeBtn: {
      position: 'absolute', top: '16px', right: '16px',
      background: 'none', border: 'none',
      fontSize: '24px', cursor: 'pointer',
      color: theme.colors.textMuted,
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 style={styles.title}>
          {isUpgrade ? '계정 연결하기' : tab === 'login' ? '로그인' : '회원가입'}
        </h2>

        {!isUpgrade && (
          <div style={styles.tabs}>
            <button style={styles.tab(tab === 'login')} onClick={() => { setTab('login'); setError(''); }}>
              로그인
            </button>
            <button style={styles.tab(tab === 'signup')} onClick={() => { setTab('signup'); setError(''); }}>
              회원가입
            </button>
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleEmailSubmit}>
          <input
            style={styles.input}
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            style={styles.input}
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
          />
          <button style={styles.submitBtn} type="submit" disabled={loading}>
            {loading ? '처리 중...' : isUpgrade ? '이메일로 연결' : tab === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span>또는</span>
          <div style={styles.dividerLine} />
        </div>

        <button style={styles.socialBtn('#FFFFFF', theme.colors.text)} onClick={handleGoogle} disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.2-2.7-.4-3.9z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.5 18.8 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.2 26.7 36 24 36c-5.3 0-9.8-3.4-11.4-8.2l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.7 39.5 44 34 44 24c0-1.3-.2-2.7-.4-3.9z"/>
          </svg>
          Google로 계속하기
        </button>

        <button style={styles.socialBtn('#000000', '#FFFFFF')} onClick={handleApple} disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          Apple로 계속하기
        </button>

        <button style={styles.socialBtn('#FEE500', '#3C1E1E')} onClick={handleKakao} disabled={loading}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#3C1E1E" d="M12 3C6.48 3 2 6.58 2 10.9c0 2.78 1.8 5.22 4.51 6.6-.2.73-.72 2.64-.83 3.05-.13.5.18.49.39.36.16-.1 2.59-1.76 3.63-2.47.74.11 1.51.16 2.3.16 5.52 0 10-3.58 10-7.9S17.52 3 12 3z"/>
          </svg>
          카카오로 계속하기
        </button>

        <button
          style={{ ...styles.socialBtn(theme.colors.background, theme.colors.textLight), marginTop: '8px', border: 'none', fontSize: '14px' }}
          onClick={onClose}
        >
          닫기
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
