import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Home, Camera, AlertTriangle, AlertCircle, CheckCircle, ChevronRight } from 'lucide-react';
import StarRating from '../components/StarRating';
import theme from '../styles/theme';

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useApp();
  const result = location.state?.result;

  if (!result) {
    return (
      <div style={{
        minHeight: '100vh',
        background: theme.colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        fontFamily: theme.fonts.primary,
      }}>
        <p style={{ color: theme.colors.textLight }}>분석 결과가 없어요</p>
        <button
          onClick={() => navigate('/home')}
          style={{
            padding: '12px 24px',
            borderRadius: theme.radius.md,
            background: theme.colors.primary,
            color: '#fff',
            border: 'none',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          홈으로 가기
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.colors.background,
      padding: '24px 20px 40px',
      fontFamily: theme.fonts.primary,
    }}>
      {/* 헤더 */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>
          {result.overallScore >= 4 ? '🎉' : result.overallScore >= 2.5 ? '👍' : '🏥'}
        </div>
        <h1 style={{
          fontSize: '22px',
          fontWeight: '800',
          color: theme.colors.text,
          margin: '0 0 8px',
        }}>
          분석 완료!
        </h1>
        <p style={{ fontSize: '13px', color: theme.colors.textMuted }}>
          {new Date(result.timestamp).toLocaleString('ko-KR')}
          {' · '}
          {result.mode === 'baby' ? '아기 모드' : '성인 모드'}
        </p>
      </div>

      {/* 종합 점수 */}
      <div style={{
        background: theme.colors.white,
        borderRadius: theme.radius.lg,
        padding: '28px 20px',
        marginBottom: '16px',
        boxShadow: theme.shadow.md,
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '600',
          color: theme.colors.textMuted,
          marginBottom: '12px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          종합 건강 점수
        </div>
        <StarRating score={result.overallScore} size={32} />
      </div>

      {/* 알림 */}
      {result.alerts.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          {result.alerts.map((alert, i) => (
            <div
              key={i}
              style={{
                background: alert.level === 'critical' ? '#FFF0ED' : '#FFF9E6',
                borderRadius: theme.radius.md,
                padding: '14px 16px',
                marginBottom: '8px',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start',
                border: `1px solid ${alert.level === 'critical' ? '#E8746120' : '#F5C54220'}`,
              }}
            >
              {alert.level === 'critical'
                ? <AlertCircle size={20} color={theme.colors.danger} style={{ flexShrink: 0, marginTop: '1px' }} />
                : <AlertTriangle size={20} color={theme.colors.warning} style={{ flexShrink: 0, marginTop: '1px' }} />
              }
              <span style={{
                fontSize: '14px',
                color: theme.colors.text,
                lineHeight: 1.5,
              }}>
                {alert.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 상세 분석 */}
      <div style={{
        background: theme.colors.white,
        borderRadius: theme.radius.lg,
        padding: '20px',
        marginBottom: '16px',
        boxShadow: theme.shadow.sm,
      }}>
        <h2 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: theme.colors.text,
          margin: '0 0 16px',
        }}>
          상세 분석
        </h2>

        {/* 형태 */}
        <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: `1px solid ${theme.colors.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
              형태 (Bristol Type {result.bristolType.type})
            </span>
            <StarRating score={result.bristolType.score} size={14} showLabel={false} />
          </div>
          <p style={{ fontSize: '14px', color: theme.colors.textLight, margin: '4px 0 0' }}>
            {result.bristolType.name} - {result.bristolType.description}
          </p>
          <span style={{
            display: 'inline-block',
            marginTop: '6px',
            padding: '4px 10px',
            borderRadius: '12px',
            background: `${theme.colors.primary}15`,
            color: theme.colors.primary,
            fontSize: '12px',
            fontWeight: '600',
          }}>
            {result.bristolType.health}
          </span>
        </div>

        {/* 색상 */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
              색상
            </span>
            <StarRating score={result.color.score} size={14} showLabel={false} />
          </div>
          <p style={{ fontSize: '14px', color: theme.colors.textLight, margin: '4px 0 0' }}>
            {result.color.name} - {result.color.meaning}
          </p>
        </div>
      </div>

      {/* 권장사항 */}
      {result.recommendations.length > 0 && (
        <div style={{
          background: theme.colors.white,
          borderRadius: theme.radius.lg,
          padding: '20px',
          marginBottom: '24px',
          boxShadow: theme.shadow.sm,
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '700',
            color: theme.colors.text,
            margin: '0 0 12px',
          }}>
            💡 권장사항
          </h2>
          {result.recommendations.map((rec, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-start',
              padding: '8px 0',
              borderBottom: i < result.recommendations.length - 1 ? `1px solid ${theme.colors.border}` : 'none',
            }}>
              <CheckCircle size={16} color={theme.colors.success} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ fontSize: '14px', color: theme.colors.textLight, lineHeight: 1.5 }}>
                {rec}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 하단 버튼 */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: theme.radius.lg,
            background: theme.colors.white,
            color: theme.colors.text,
            border: `1px solid ${theme.colors.border}`,
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <Home size={18} /> 홈으로
        </button>
        <button
          onClick={() => navigate('/camera')}
          style={{
            flex: 1,
            padding: '14px',
            borderRadius: theme.radius.lg,
            background: theme.colors.primary,
            color: '#fff',
            border: 'none',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <Camera size={18} /> 다시 촬영
        </button>
      </div>
    </div>
  );
}
