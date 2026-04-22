// AI 분석 서비스 - MVP에서는 Mock, 추후 실제 AI 모델 연동
// Bristol Stool Scale 기반 분석

const BRISTOL_TYPES = [
  { type: 1, name: '단단한 덩어리', description: '토끼똥처럼 단단한 개별 덩어리', health: '변비 가능성', score: 1.5 },
  { type: 2, name: '울퉁불퉁 소시지', description: '덩어리가 뭉친 소시지 모양', health: '경미한 변비', score: 2.5 },
  { type: 3, name: '갈라진 소시지', description: '표면에 균열이 있는 소시지', health: '정상', score: 4.0 },
  { type: 4, name: '부드러운 소시지', description: '뱀처럼 부드럽고 매끄러운 소시지', health: '이상적', score: 5.0 },
  { type: 5, name: '부드러운 덩어리', description: '경계가 명확한 부드러운 덩어리', health: '섬유질 부족 가능', score: 3.5 },
  { type: 6, name: '푸석푸석', description: '가장자리가 푸석한 덩어리', health: '경미한 설사', score: 2.0 },
  { type: 7, name: '액체', description: '덩어리 없이 완전히 액체 상태', health: '설사', score: 1.0 },
];

const COLORS = [
  { name: '갈색', meaning: '정상', score: 5.0 },
  { name: '진갈색', meaning: '정상 (수분 부족 가능)', score: 4.0 },
  { name: '연갈색', meaning: '정상 (섬유질 충분)', score: 4.5 },
  { name: '녹색', meaning: '채소 과다 섭취 또는 빠른 소화', score: 3.0 },
  { name: '노란색', meaning: '지방 흡수 이상 가능', score: 2.5 },
  { name: '검은색', meaning: '상부 소화기 출혈 가능 (병원 방문 권장)', score: 1.0 },
  { name: '빨간색', meaning: '하부 소화기 출혈 가능 (병원 방문 권장)', score: 1.0 },
];

const BABY_COLORS = [
  { name: '노란색 (모유변)', meaning: '정상 - 모유 수유아에서 흔함', score: 5.0 },
  { name: '겨자색', meaning: '정상 - 모유 수유아', score: 5.0 },
  { name: '갈색', meaning: '정상 - 분유 수유 또는 이유식 시작', score: 4.5 },
  { name: '녹색', meaning: '정상 - 철분 보충제 또는 녹색 채소', score: 4.0 },
  { name: '흰색/회백색', meaning: '담도 문제 가능 (즉시 병원 방문)', score: 0.5 },
  { name: '검은색 (태변 외)', meaning: '상부 소화기 출혈 가능 (병원 방문)', score: 1.0 },
  { name: '빨간색', meaning: '하부 소화기 출혈 가능 (병원 방문)', score: 1.0 },
];

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Mock 분석 - 추후 실제 Vision AI로 대체
export async function analyzeStool(imageData, mode = 'adult') {
  // 분석 시뮬레이션 딜레이
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));

  const bristolType = randomFromArray(BRISTOL_TYPES);
  const colorInfo = mode === 'baby' ? randomFromArray(BABY_COLORS) : randomFromArray(COLORS);

  const overallScore = Math.round(((bristolType.score + colorInfo.score) / 2) * 2) / 2; // 0.5 단위 반올림

  return {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    mode,
    overallScore: Math.min(5, Math.max(0, overallScore)),
    bristolType: {
      type: bristolType.type,
      name: bristolType.name,
      description: bristolType.description,
      health: bristolType.health,
      score: bristolType.score,
    },
    color: {
      name: colorInfo.name,
      meaning: colorInfo.meaning,
      score: colorInfo.score,
    },
    recommendations: generateRecommendations(bristolType, colorInfo, mode),
    alerts: generateAlerts(bristolType, colorInfo, mode),
  };
}

function generateRecommendations(bristol, color, mode) {
  const recs = [];

  if (mode === 'baby') {
    if (bristol.type <= 2) recs.push('수분 섭취를 늘려주세요');
    if (bristol.type >= 6) recs.push('이유식 양을 조절해보세요');
    if (color.score < 2) recs.push('소아과 방문을 권장합니다');
    recs.push('아기의 배변 패턴을 꾸준히 기록해주세요');
  } else {
    if (bristol.type <= 2) recs.push('수분과 식이섬유 섭취를 늘려보세요');
    if (bristol.type >= 6) recs.push('수분 보충과 소화에 좋은 음식을 드세요');
    if (bristol.type === 4) recs.push('현재 식습관을 유지하세요! 아주 좋습니다');
    if (color.score < 3) recs.push('지속되면 전문의 상담을 권장합니다');
  }

  return recs;
}

function generateAlerts(bristol, color, mode) {
  const alerts = [];
  if (color.score <= 1) {
    alerts.push({
      level: 'critical',
      message: mode === 'baby'
        ? '아기의 대변 색상이 비정상적입니다. 소아과에 즉시 방문해주세요.'
        : '대변 색상이 비정상적입니다. 병원 방문을 강력히 권장합니다.',
    });
  }
  if (bristol.type === 7) {
    alerts.push({
      level: 'warning',
      message: mode === 'baby'
        ? '심한 설사입니다. 탈수 주의하시고 소아과에 방문해주세요.'
        : '심한 설사입니다. 수분 보충을 하시고, 지속되면 병원에 방문하세요.',
    });
  }
  return alerts;
}
