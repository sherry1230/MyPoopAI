import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthChange,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithApple,
  signInWithKakao,
  signInAsGuest,
  signOutUser,
  linkGuestToEmail,
  linkGuestToGoogle,
  linkGuestToApple,
} from '../services/authService';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { createUserDoc, getUserDoc } from '../services/firestoreService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!firebaseUser;
  const isGuest = firebaseUser?.isAnonymous ?? false;

  // Firebase auth 상태 구독
  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      setFirebaseUser(user);
      if (user) {
        const profile = await getUserDoc(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 로그인 타입 판별
  const getLoginType = (user) => {
    if (user.isAnonymous) return 'guest';
    const providerId = user.providerData?.[0]?.providerId;
    if (providerId === 'google.com') return 'google';
    if (providerId === 'apple.com') return 'apple';
    if (providerId === 'password') return 'email';
    return 'custom'; // 카카오 등
  };

  // 신규 유저 Firestore 문서 생성
  const ensureUserDoc = async (user) => {
    const existing = await getUserDoc(user.uid);
    if (!existing) {
      await createUserDoc(user.uid, {
        email: user.email || '',
        loginType: getLoginType(user),
      });
    }
    const profile = await getUserDoc(user.uid);
    setUserProfile(profile);
    return profile;
  };

  const actions = {
    loginWithEmail: async (email, password) => {
      const result = await signInWithEmail(email, password);
      await ensureUserDoc(result.user);
      return result;
    },

    signupWithEmail: async (email, password) => {
      const result = await signUpWithEmail(email, password);
      await ensureUserDoc(result.user);
      return result;
    },

    loginWithGoogle: async () => {
      const result = await signInWithGoogle();
      await ensureUserDoc(result.user);
      return result;
    },

    loginWithApple: async () => {
      const result = await signInWithApple();
      await ensureUserDoc(result.user);
      return result;
    },

    loginWithKakao: async () => {
      // 카카오 SDK 로그인 → 이메일 기반 Firebase 계정 생성/로그인
      const kakaoData = await signInWithKakao();
      const kakaoEmail = kakaoData.email || `kakao_${kakaoData.kakaoId}@kakao.mypoopai.com`;
      // 카카오 ID 기반 비밀번호 (사용자가 직접 쓸 일 없음)
      const kakaoPassword = `kakao_${kakaoData.kakaoId}_mypoop`;

      let result;
      try {
        // 기존 계정 로그인 시도
        result = await signInWithEmailAndPassword(auth, kakaoEmail, kakaoPassword);
      } catch {
        // 없으면 새 계정 생성
        result = await createUserWithEmailAndPassword(auth, kakaoEmail, kakaoPassword);
      }

      await ensureUserDoc(result.user);
      // loginType을 kakao로 업데이트
      const { updateUserDoc } = await import('../services/firestoreService');
      await updateUserDoc(result.user.uid, {
        email: kakaoData.email || '',
        loginType: 'kakao',
        kakaoId: String(kakaoData.kakaoId),
        displayName: kakaoData.nickname || '',
      });
      const profile = await getUserDoc(result.user.uid);
      setUserProfile(profile);
      return result;
    },

    continueAsGuest: async () => {
      const result = await signInAsGuest();
      await ensureUserDoc(result.user);
      return result;
    },

    logout: async () => {
      await signOutUser();
      setFirebaseUser(null);
      setUserProfile(null);
    },

    // 게스트 → 정식 계정 업그레이드
    upgradeGuestAccount: async (method, email, password) => {
      let result;
      if (method === 'email') {
        result = await linkGuestToEmail(email, password);
      } else if (method === 'google') {
        result = await linkGuestToGoogle();
      } else if (method === 'apple') {
        result = await linkGuestToApple();
      } else if (method === 'kakao') {
        // 카카오는 link 방식이 안되므로, 게스트 데이터를 새 카카오 계정으로 마이그레이션
        // MVP에서는 간단히 알림만 표시
        throw new Error('카카오 계정 연결은 준비 중이에요. 이메일 또는 Google로 연결해주세요.');
      }
      // loginType 업데이트
      const { updateUserDoc } = await import('../services/firestoreService');
      await updateUserDoc(result.user.uid, {
        email: result.user.email || '',
        loginType: getLoginType(result.user),
      });
      const profile = await getUserDoc(result.user.uid);
      setUserProfile(profile);
      return result;
    },

    refreshProfile: async () => {
      if (firebaseUser) {
        const profile = await getUserDoc(firebaseUser.uid);
        setUserProfile(profile);
      }
    },
  };

  return (
    <AuthContext.Provider value={{
      firebaseUser,
      userProfile,
      isAuthenticated,
      isGuest,
      loading,
      ...actions,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
