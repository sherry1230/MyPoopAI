import { Star, StarHalf } from 'lucide-react';
import theme from '../styles/theme';

// 별점 0~5, 0.5 단위 (Rotten Tomatoes 스타일)
export default function StarRating({ score, size = 24, showLabel = true }) {
  const fullStars = Math.floor(score);
  const hasHalf = score % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  const getScoreLabel = (s) => {
    if (s >= 4.5) return '아주 건강해요!';
    if (s >= 3.5) return '건강해요';
    if (s >= 2.5) return '보통이에요';
    if (s >= 1.5) return '주의가 필요해요';
    return '관리가 필요해요';
  };

  const getScoreColor = (s) => {
    if (s >= 4) return theme.colors.success;
    if (s >= 3) return theme.colors.warning;
    return theme.colors.danger;
  };

  const color = getScoreColor(score);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        {Array.from({ length: fullStars }, (_, i) => (
          <Star key={`full-${i}`} size={size} fill={color} color={color} />
        ))}
        {hasHalf && <StarHalf key="half" size={size} fill={color} color={color} />}
        {Array.from({ length: emptyStars }, (_, i) => (
          <Star key={`empty-${i}`} size={size} fill="none" color={theme.colors.border} />
        ))}
        <span style={{
          marginLeft: '8px',
          fontSize: size * 0.8,
          fontWeight: '700',
          color,
        }}>
          {score.toFixed(1)}
        </span>
      </div>
      {showLabel && (
        <span style={{
          fontSize: '14px',
          fontWeight: '600',
          color,
        }}>
          {getScoreLabel(score)}
        </span>
      )}
    </div>
  );
}
