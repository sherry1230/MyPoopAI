// Firebase 설정 - 실제 배포 시 .env로 대체
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mypoopai.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mypoopai',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mypoopai.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:0000000000000000',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');
export const db = getFirestore(app);
export const storage = getStorage(app);

// 카카오 SDK 초기화
const KAKAO_JS_KEY = import.meta.env.VITE_KAKAO_JS_KEY || '';
if (KAKAO_JS_KEY && typeof window !== 'undefined' && window.Kakao && !window.Kakao.isInitialized()) {
  window.Kakao.init(KAKAO_JS_KEY);
}

export default app;
