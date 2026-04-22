import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Baby, TrendingUp, History, ChevronRight } from 'lucide-react';
import StarRating from '../components/StarRating';
import theme from '../styles/theme';

export default function Home() {
  const navigate = useNavigate();
  const { mode, history, setMode } = useApp();
  const { firebaseUser, isGuest } = useAuth();
  const lastAnalysis = history[0];

  // 최근 7일 평균 점수
  const recentHistory = history.filter(h => {
    const diff = Date.now() - new Date(h.timestamp).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  });
  const avgScore = recentHistory.length > 0
    ? Math.round((recentHistory.reduce((s, h) => s + h.overallScore, 0) / recentHistory.length) * 2) / 2
    : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.colors.background,
      padding: '24px 20px 100px',
      fontFamily: theme.fonts.primary,
    }}>
      {/* 헤더 */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: theme.colors.text,
          margin: 0,
        }}>
          {mode === 'baby' ? 'My Baby 💩' : 'My 💩'}
        </h1>
        <p style={{
          fontSize: '14px',
          color: theme.colors.textLight,
          margin: '4px 0 0',
        }}>
          안녕하세요, {isGuest ? '게스트' : (firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || '사용자')}님!
        </p>
      </div>

      {/* 모드 전환 */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
      }}>
        {['adult', 'baby'].map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: theme.radius.md,
              border: mode === m ? `2px solid ${theme.colors.primary}` : `1px solid ${theme.colors.border}`,
              background: mode === m ? `${theme.colors.primary}15` : theme.colors.white,
              color: mode === m ? theme.colors.primary : theme.colors.textLight,
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {m === 'baby' ? <><Baby size={18} /> 아기 모드</> : <>💩 성인 모드</>}
          </button>
        ))}
      </div>

      {/* 촬영 버튼 (메인 CTA) */}
      <button
        onClick={() => navigate('/camera')}
        style={{
          width: '100%',
          padding: '24px',
          borderRadius: theme.radius.lg,
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
          color: theme.colors.white,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '24px',
          boxShadow: `0 6px 24px ${theme.colors.primary}40`,
        }}
      >
        <Camera size={28} />
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '18px', fontWeight: '800' }}>지금 분석하기</div>
          <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '2px' }}>
            카메라로 촬영하면 AI가 분석해요
          </div>
        </div>
      </button>

      {/* 주간 요약 카드 */}
      <div style={{
        background: theme.colors.white,
        borderRadius: theme.radius.lg,
        padding: '20px',
        marginBottom: '16px',
        boxShadow: theme.shadow.sm,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={20} color={theme.colors.primary} />
            <span style={{ fontSize: '16px', fontWeight: '700', color: theme.colors.text }}>
              이번 주 건강 요약
            </span>
          </div>
          <span style={{ fontSize: '12px', color: theme.colors.textMuted }}>
            최근 7일
          </span>
        </div>

        {avgScore !== null ? (
          <div style={{ textAlign: 'center' }}>
            <StarRating score={avgScore} size={28} />
            <p style={{
              fontSize: '13px',
              color: theme.colors.textLight,
              marginTop: '8px',
            }}>
              총 {recentHistory.length}회 분석
            </p>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: theme.colors.textMuted,
            fontSize: '14px',
          }}>
            아직 분석 기록이 없어요.<br/>
            첫 분석을 시작해보세요! 💩
          </div>
        )}
      </div>

      {/* 최근 분석 */}
      {lastAnalysis && (
        <button
          onClick={() => navigate('/history')}
          style={{
            width: '100%',
            background: theme.colors.white,
            borderRadius: theme.radius.lg,
            padding: '16px 20px',
            boxShadow: theme.shadow.sm,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <History size={20} color={theme.colors.accent} />
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
                마지막 분석
              </div>
              <div style={{ fontSize: '12px', color: theme.colors.textMuted, marginTop: '2px' }}>
                {new Date(lastAnalysis.timestamp).toLocaleDateString('ko-KR')} · {lastAnalysis.bristolType.name}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <StarRating score={lastAnalysis.overallScore} size={16} showLabel={false} />
            <ChevronRight size={18} color={theme.colors.textMuted} />
          </div>
        </button>
      )}
    </div>
  );
}
