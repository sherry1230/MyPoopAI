import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { updateUserDoc } from '../services/firestoreService';
import { getUserRecords, addRecord, deleteAllUserRecords } from '../services/firestoreService';
import { uploadOriginalImage, uploadCoveredImage } from '../services/storageService';

const AppContext = createContext();

const STORAGE_KEY = 'mypoopai_state';

const defaultState = {
  mode: 'adult',
  overlayType: 'mosaic',
  history: [],
  babyProfiles: [],
};

function loadLocalState() {
  try {
    const saved = window.sessionStorage?.getItem(STORAGE_KEY);
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function AppProvider({ children }) {
  const { firebaseUser, isAuthenticated, isGuest, userProfile } = useAuth();
  const [state, setState] = useState(loadLocalState);
  const [firestoreLoaded, setFirestoreLoaded] = useState(false);

  // 로컬 상태 세션 저장 (게스트용)
  useEffect(() => {
    try {
      window.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  }, [state]);

  // 인증 유저: Firestore에서 설정 + 히스토리 로드
  useEffect(() => {
    if (!isAuthenticated || !firebaseUser) {
      setFirestoreLoaded(false);
      return;
    }

    const loadFromFirestore = async () => {
      try {
        // userProfile에서 설정 동기화
        if (userProfile) {
          setState(prev => ({
            ...prev,
            mode: userProfile.mode || prev.mode,
            overlayType: userProfile.cameraSettings?.coverType || prev.overlayType,
          }));
        }

        // 히스토리 로드 (게스트 아닌 경우만)
        if (!isGuest) {
          const records = await getUserRecords(firebaseUser.uid);
          setState(prev => ({
            ...prev,
            history: records.map(r => ({
              id: r.id,
              timestamp: r.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              mode: r.mode,
              imageRef: r.imageRef,
              imageCoveredRef: r.imageCoveredRef,
              ...r.analysis,
            })),
          }));
        }
      } catch (err) {
        console.error('Firestore 로드 실패:', err);
      }
      setFirestoreLoaded(true);
    };

    loadFromFirestore();
  }, [isAuthenticated, isGuest, firebaseUser, userProfile]);

  const syncToFirestore = useCallback(async (field, value) => {
    if (isAuthenticated && firebaseUser && !isGuest) {
      try {
        await updateUserDoc(firebaseUser.uid, { [field]: value });
      } catch (err) {
        console.error('Firestore 동기화 실패:', err);
      }
    }
  }, [isAuthenticated, firebaseUser, isGuest]);

  const actions = {
    setMode: (mode) => {
      setState(prev => ({ ...prev, mode }));
      syncToFirestore('mode', mode);
    },

    setOverlayType: (overlayType) => {
      setState(prev => ({ ...prev, overlayType }));
      syncToFirestore('cameraSettings.coverType', overlayType);
    },

    addAnalysis: async (analysis, originalImage, coveredImage) => {
      // 로컬 히스토리에 즉시 추가
      setState(prev => ({
        ...prev,
        history: [analysis, ...prev.history],
      }));

      // 인증 유저 (게스트 아님): Firestore + Storage 저장
      if (isAuthenticated && firebaseUser && !isGuest) {
        try {
          const recordData = {
            userId: firebaseUser.uid,
            mode: analysis.mode || state.mode,
            analysis: {
              score: analysis.score,
              comment: analysis.comment,
              drip: analysis.drip || '',
              color: analysis.color,
              shape: analysis.shape,
              alertLevel: analysis.alertLevel || 'normal',
              followUpQs: analysis.followUpQs || [],
            },
            coverEnabled: state.overlayType !== 'none',
            imageRef: '',
            imageCoveredRef: '',
          };

          // Firestore record 생성
          const docRef = await addRecord(recordData);
          const recordId = docRef.id;

          // Storage에 이미지 업로드
          if (originalImage) {
            const imageRef = await uploadOriginalImage(firebaseUser.uid, recordId, originalImage);
            const { updateDoc, doc } = await import('firebase/firestore');
            const { db } = await import('../services/firebase');
            await updateDoc(doc(db, 'records', recordId), { imageRef });
          }
          if (coveredImage) {
            const imageCoveredRef = await uploadCoveredImage(firebaseUser.uid, recordId, coveredImage);
            const { updateDoc, doc } = await import('firebase/firestore');
            const { db } = await import('../services/firebase');
            await updateDoc(doc(db, 'records', recordId), { imageCoveredRef });
          }
        } catch (err) {
          console.error('분석 결과 저장 실패:', err);
        }
      }
    },

    clearHistory: async () => {
      setState(prev => ({ ...prev, history: [] }));
      if (isAuthenticated && firebaseUser && !isGuest) {
        try {
          await deleteAllUserRecords(firebaseUser.uid);
        } catch (err) {
          console.error('히스토리 삭제 실패:', err);
        }
      }
    },

    addBabyProfile: (profile) => setState(prev => ({
      ...prev,
      babyProfiles: [...prev.babyProfiles, profile],
    })),
  };

  return (
    <AppContext.Provider value={{ ...state, firestoreLoaded, ...actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
