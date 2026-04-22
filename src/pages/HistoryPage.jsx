import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Calendar, Trash2, ChevronRight } from 'lucide-react';
import StarRating from '../components/StarRating';
import BottomNav from '../components/BottomNav';
import theme from '../styles/theme';

export default function HistoryPage() {
  const navigate = useNavigate();
  const { history, clearHistory } = useApp();

  // 날짜별 그룹핑
  const grouped = history.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.colors.background,
      padding: '24px 20px 100px',
      fontFamily: theme.fonts.primary,
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
      }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: '800',
          color: theme.colors.text,
          margin: 0,
        }}>
          분석 기록
        </h1>
        {history.length > 0 && (
          <button
            onClick={() => {
              if (confirm('모든 기록을 삭제할까요?')) clearHistory();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.danger,
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Trash2 size={14} /> 전체 삭제
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: theme.colors.textMuted,
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p style={{ fontSize: '16px', fontWeight: '600' }}>아직 분석 기록이 없어요</p>
          <p style={{ fontSize: '14px', marginTop: '4px' }}>
            카메라로 촬영하면 여기에 기록돼요
          </p>
          <button
            onClick={() => navigate('/camera')}
            style={{
              marginTop: '20px',
              padding: '12px 28px',
              borderRadius: theme.radius.lg,
              background: theme.colors.primary,
              color: '#fff',
              border: 'none',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
            }}
          >
            첫 분석하기
          </button>
        </div>
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date} style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '10px',
            }}>
              <Calendar size={14} color={theme.colors.textMuted} />
              <span style={{
                fontSize: '13px',
                fontWeight: '600',
                color: theme.colors.textMuted,
              }}>
                {date}
              </span>
            </div>

            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate('/result', { state: { result: item } })}
                style={{
                  width: '100%',
                  background: theme.colors.white,
                  borderRadius: theme.radius.md,
                  padding: '16px',
                  marginBottom: '8px',
                  border: 'none',
                  boxShadow: theme.shadow.sm,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      background: item.mode === 'baby' ? '#E8F5E9' : `${theme.colors.primary}15`,
                      color: item.mode === 'baby' ? '#4CAF50' : theme.colors.primary,
                      fontWeight: '600',
                    }}>
                      {item.mode === 'baby' ? '👶 아기' : '💩 성인'}
                    </span>
                    <span style={{ fontSize: '12px', color: theme.colors.textMuted }}>
                      {new Date(item.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: theme.colors.text }}>
                    {item.bristolType.name}
                  </div>
                  <div style={{ fontSize: '12px', color: theme.colors.textLight, marginTop: '2px' }}>
                    색상: {item.color.name}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <StarRating score={item.overallScore} size={14} showLabel={false} />
                  <ChevronRight size={16} color={theme.colors.textMuted} />
                </div>
              </button>
            ))}
          </div>
        ))
      )}

      <BottomNav />
    </div>
  );
}
