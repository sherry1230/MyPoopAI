import { useRef, useEffect } from 'react';

// 모자이크 오버레이 - 원본 이미지를 모자이크 처리하여 표시
export function applyMosaic(canvas, ctx, blockSize = 15) {
  const w = canvas.width;
  const h = canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  for (let y = 0; y < h; y += blockSize) {
    for (let x = 0; x < w; x += blockSize) {
      let r = 0, g = 0, b = 0, count = 0;
      for (let dy = 0; dy < blockSize && y + dy < h; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < w; dx++) {
          const idx = ((y + dy) * w + (x + dx)) * 4;
          r += data[idx]; g += data[idx + 1]; b += data[idx + 2];
          count++;
        }
      }
      r = Math.floor(r / count); g = Math.floor(g / count); b = Math.floor(b / count);
      for (let dy = 0; dy < blockSize && y + dy < h; dy++) {
        for (let dx = 0; dx < blockSize && x + dx < w; dx++) {
          const idx = ((y + dy) * w + (x + dx)) * 4;
          data[idx] = r; data[idx + 1] = g; data[idx + 2] = b;
        }
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

// 스티커 오버레이 - 이미지 위에 캐릭터 스티커를 덮어씌움
export function applyStickerOverlay(canvas, ctx) {
  const w = canvas.width;
  const h = canvas.height;

  // 부드러운 그라데이션 배경
  const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w, h)/2);
  gradient.addColorStop(0, '#D4C8E2');
  gradient.addColorStop(1, '#B8A9C9');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // 귀여운 이모지 스티커들
  const stickers = ['💩', '✨', '🌟', '💜', '🦄'];
  const mainSize = Math.min(w, h) * 0.35;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 메인 스티커
  ctx.font = `${mainSize}px sans-serif`;
  ctx.fillText('💩', w/2, h/2);

  // 데코 스티커들
  const decoSize = mainSize * 0.3;
  ctx.font = `${decoSize}px sans-serif`;
  const positions = [
    [w*0.2, h*0.2], [w*0.8, h*0.15],
    [w*0.15, h*0.75], [w*0.85, h*0.8],
    [w*0.5, h*0.15], [w*0.5, h*0.85],
  ];
  positions.forEach(([x, y], i) => {
    ctx.fillText(stickers[(i + 1) % stickers.length], x, y);
  });
}

export default function MosaicOverlay({ imageSrc, type = 'mosaic', width = 300, height = 300 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      if (type === 'mosaic') {
        applyMosaic(canvas, ctx, 12);
      } else {
        applyStickerOverlay(canvas, ctx);
      }
    };

    img.src = imageSrc;
  }, [imageSrc, type, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        maxWidth: `${width}px`,
        height: 'auto',
        borderRadius: '16px',
      }}
    />
  );
}
