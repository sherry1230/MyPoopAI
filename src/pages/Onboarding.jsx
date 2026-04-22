import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Baby, ArrowRight, Sparkles } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import theme from '../styles/theme';

const slides = [
  {
    emoji: '💩',
    title: 'My 💩에 오신 걸 환영해요!',
    subtitle: 'AI가 대변 건강을 분석해드려요',
    description: '카메라로 촬영하면 AI가 건강 상태를 별점으로 알려줘요',
    icon: Sparkles,
  },
  {
    emoji: '🔒',
    title: '프라이버시 최우선',
    subtitle: 'AI만 보고, 당신은 안 봐도 돼요',
    description: '촬영 즉시 모자이크 또는 귀여운 스티커로 가려져요. 민망할 일 없어요!',
    icon: Shield,
  },
  {
    emoji: '👶',
    title: '아기 모드도 있어요',
    subtitle: 'My Baby 💩',
    description: '우리 아기 대변도 전문적으로 분석해드려요. 초보 부모의 든든한 도우미!',
    icon: Baby,
  },
];

export default function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const { continueAsGuest } = useAuth();

  const handleGuestStart = async () => {
    try {
      await continueAsGuest();
      localStorage.setItem('mypoopai_onboarding', 'done');
      navigate('/home');
    } catch (err) {
      console.error('게스트 시작 실패:', err);
    }
  };

  const handleAuthClose = () => {
    setShowAuth(false);
    // 로그인 성공 시 AuthContext가 업데이트되고 App.jsx에서 리다이렉트
    localStorage.setItem('mypoopai_onboarding', 'done');
    navigate('/home');
  };

  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.colors.background,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      fontFamily: theme.fonts.primary,
    }}>
      {/* 슬라이드 콘텐츠 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: '340px',
        gap: '24px',
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: theme.radius.xl,
          background: `linear-gradient(135deg, ${theme.colors.primaryLight}, ${theme.colors.primary})`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '56px',
          boxShadow: theme.shadow.lg,
        }}>
          {slide.emoji}
        </div>

        <h1 style={{
          fontSize: '24px', fontWeight: '800',
          color: theme.colors.text, margin: 0, lineHeight: 1.3,
        }}>
          {slide.title}
        </h1>

        <p style={{
          fontSize: '18px', fontWeight: '600',
          color: theme.colors.primary, margin: 0,
        }}>
          {slide.subtitle}
        </p>

        <p style={{
          fontSize: '15px', color: theme.colors.textLight,
          margin: 0, lineHeight: 1.6,
        }}>
          {slide.description}
        </p>
      </div>

      {/* 하단 네비게이션 */}
      <div style={{
        width: '100%', maxWidth: '340px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '20px', paddingBottom: '20px',
      }}>
        {/* 인디케이터 */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {slides.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === currentSlide ? '24px' : '8px',
                height: '8px', borderRadius: '4px',
                background: i === currentSlide ? theme.colors.primary : theme.colors.border,
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {/* 버튼 */}
        {isLast ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={handleGuestStart}
              style={{
                width: '100%', padding: '16px',
                borderRadius: theme.radius.lg,
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                color: theme.colors.white,
                fontSize: '17px', fontWeight: '700',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '8px',
                boxShadow: `0 4px 16px ${theme.colors.primary}50`,
              }}
            >
              게스트로 시작하기 <ArrowRight size={20} />
            </button>
            <button
              onClick={() => setShowAuth(true)}
              style={{
                width: '100%', padding: '14px',
                borderRadius: theme.radius.lg,
                background: 'transparent',
                color: theme.colors.primary,
                fontSize: '15px', fontWeight: '600',
                border: `1px solid ${theme.colors.primary}`,
                cursor: 'pointer',
              }}
            >
              로그인 / 회원가입
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <button
              onClick={handleGuestStart}
              style={{
                flex: 1, padding: '16px',
                borderRadius: theme.radius.lg,
                background: 'transparent',
                color: theme.colors.textMuted,
                fontSize: '15px', fontWeight: '600',
                border: `1px solid ${theme.colors.border}`,
                cursor: 'pointer',
              }}
            >
              건너뛰기
            </button>
            <button
              onClick={() => setCurrentSlide(prev => prev + 1)}
              style={{
                flex: 1, padding: '16px',
                borderRadius: theme.radius.lg,
                background: theme.colors.primary,
                color: theme.colors.white,
                fontSize: '15px', fontWeight: '700',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '6px',
              }}
            >
              다음 <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      <AuthModal isOpen={showAuth} onClose={handleAuthClose} />
    </div>
  );
}
