import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithPopup,
  signInWithCredential,
  signOut,
  linkWithCredential,
  linkWithPopup,
  EmailAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider, appleProvider } from './firebase';

// 이메일 회원가입
export const signUpWithEmail = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

// 이메일 로그인
export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

// Google 로그인
export const signInWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

// Apple 로그인
export const signInWithApple = () =>
  signInWithPopup(auth, appleProvider);

// 카카오 로그인
// 카카오 SDK로 인증 후 Firebase Custom Token 또는 OIDC 연동
// MVP에서는 카카오 로그인 → 이메일 정보 획득 → 이메일+임시비번으로 Firebase 계정 생성/로그인
export const signInWithKakao = () => {
  return new Promise((resolve, reject) => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      reject(new Error('카카오 SDK가 초기화되지 않았어요. VITE_KAKAO_JS_KEY를 설정해주세요.'));
      return;
    }

    window.Kakao.Auth.login({
      success: async (authObj) => {
        try {
          // 카카오 사용자 정보 가져오기
          const kakaoUser = await new Promise((res, rej) => {
            window.Kakao.API.request({
              url: '/v2/user/me',
              success: res,
              fail: rej,
            });
          });

          const kakaoId = kakaoUser.id;
          const kakaoEmail = kakaoUser.kakao_account?.email;
          const kakaoNickname = kakaoUser.kakao_account?.profile?.nickname;

          // 카카오 인증 정보를 resolve (AuthContext에서 처리)
          resolve({
            kakaoId,
            email: kakaoEmail,
            nickname: kakaoNickname,
            accessToken: authObj.access_token,
          });
        } catch (err) {
          reject(err);
        }
      },
      fail: (err) => {
        reject(new Error(err.error_description || '카카오 로그인에 실패했어요'));
      },
    });
  });
};

// 게스트 로그인 (익명)
export const signInAsGuest = () =>
  signInAnonymously(auth);

// 게스트 → 이메일 계정 연결
export const linkGuestToEmail = (email, password) => {
  const credential = EmailAuthProvider.credential(email, password);
  return linkWithCredential(auth.currentUser, credential);
};

// 게스트 → Google 계정 연결
export const linkGuestToGoogle = () =>
  linkWithPopup(auth.currentUser, googleProvider);

// 게스트 → Apple 계정 연결
export const linkGuestToApple = () =>
  linkWithPopup(auth.currentUser, appleProvider);

// 로그아웃
export const signOutUser = () => signOut(auth);

// Auth 상태 변경 구독
export const onAuthChange = (callback) =>
  onAuthStateChanged(auth, callback);
