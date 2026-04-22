import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Camera, RotateCcw, X, Grid3x3, Sticker, Loader2 } from 'lucide-react';
import MosaicOverlay from '../components/MosaicOverlay';
import { analyzeStool } from '../services/analysisService';
import theme from '../styles/theme';

export default function CameraPage() {
  const navigate = useNavigate();
  const { mode, overlayType, setOverlayType, addAnalysis } = useApp();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [error, setError] = useState(null);

  // 카메라 시작
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // 후면 카메라
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => setCameraReady(true);
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError('카메라에 접근할 수 없어요. 카메라 권한을 허용해주세요.');
    }
  }, []);

  // 카메라 종료
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraReady(false);
    }
  }, [stream]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  // 촬영
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
  };

  // 재촬영
  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  // 분석 시작
  const handleAnalyze = async () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    try {
      const result = await analyzeStool(capturedImage, mode);
      addAnalysis(result);
      navigate('/result', { state: { result } });
    } catch (err) {
      console.error('Analysis error:', err);
      setError('분석 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setAnalyzing(false);
    }
  };

  // 오버레이 타입 토글
  const toggleOverlay = () => {
    setOverlayType(overlayType === 'mosaic' ? 'sticker' : 'mosaic');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: theme.fonts.primary,
    }}>
      {/* 상단 바 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        paddingTop: 'max(16px, env(safe-area-inset-top))',
        zIndex: 10,
      }}>
        <button
          onClick={() => { stopCamera(); navigate(-1); }}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: theme.radius.full,
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <X size={22} color="#fff" />
        </button>

        <div style={{
          background: 'rgba(255,255,255,0.15)',
          padding: '6px 14px',
          borderRadius: '20px',
          color: '#fff',
          fontSize: '13px',
          fontWeight: '600',
        }}>
          {mode === 'baby' ? '👶 아기 모드' : '💩 성인 모드'}
        </div>

        {/* 오버레이 토글 */}
        <button
          onClick={toggleOverlay}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '12px',
            fontWeight: '600',
          }}
        >
          {overlayType === 'mosaic' ? <Grid3x3 size={16} /> : <span style={{ fontSize: '16px' }}>💩</span>}
          {overlayType === 'mosaic' ? '모자이크' : '스티커'}
        </button>
      </div>

      {/* 카메라 뷰 / 촬영된 이미지 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {error ? (
          <div style={{
            textAlign: 'center',
            color: '#fff',
            padding: '40px',
          }}>
            <p style={{ fontSize: '16px', marginBottom: '16px' }}>{error}</p>
            <button
              onClick={startCamera}
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
              다시 시도
            </button>
          </div>
        ) : capturedImage ? (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <MosaicOverlay
              imageSrc={capturedImage}
              type={overlayType}
              width={360}
              height={480}
            />
            <p style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '13px',
              marginTop: '8px',
            }}>
              {overlayType === 'mosaic' ? '🔒 모자이크 적용됨' : '🔒 스티커 적용됨'} - AI만 원본을 봐요
            </p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {!cameraReady && (
              <div style={{
                position: 'absolute',
                color: '#fff',
                textAlign: 'center',
              }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: '14px', marginTop: '8px' }}>카메라 준비 중...</p>
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      {/* 하단 버튼 */}
      <div style={{
        padding: '20px',
        paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
        alignItems: 'center',
      }}>
        {capturedImage ? (
          <>
            <button
              onClick={handleRetake}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: theme.radius.full,
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={24} color="#fff" />
            </button>
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              style={{
                padding: '16px 48px',
                borderRadius: '32px',
                background: analyzing
                  ? theme.colors.textMuted
                  : `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.primaryDark})`,
                color: '#fff',
                border: 'none',
                fontSize: '17px',
                fontWeight: '700',
                cursor: analyzing ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: `0 4px 20px ${theme.colors.primary}50`,
              }}
            >
              {analyzing ? (
                <>
                  <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                  분석 중...
                </>
              ) : (
                '분석하기 ✨'
              )}
            </button>
          </>
        ) : (
          <button
            onClick={handleCapture}
            disabled={!cameraReady}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: theme.radius.full,
              background: cameraReady ? '#fff' : 'rgba(255,255,255,0.3)',
              border: `4px solid ${cameraReady ? theme.colors.primary : 'rgba(255,255,255,0.3)'}`,
              cursor: cameraReady ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: cameraReady ? `0 0 0 4px ${theme.colors.primary}40` : 'none',
            }}
          >
            <Camera size={28} color={cameraReady ? theme.colors.primary : '#999'} />
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
