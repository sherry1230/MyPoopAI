import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

// === Users ===

export const createUserDoc = (userId, data) =>
  setDoc(doc(db, 'users', userId), {
    uid: userId,
    createdAt: serverTimestamp(),
    mode: 'adult',
    cameraSettings: {
      coverType: 'mosaic',
      stickerSet: 'adult',
      coverEnabled: true,
    },
    profile: {
      adult: { name: '', birthYear: null, gender: 'N', conditions: [], medications: [] },
      baby: { name: '', birthDate: null, feedType: 'breast', weaningStart: null },
    },
    ...data,
  }, { merge: true });

export const getUserDoc = async (userId) => {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? snap.data() : null;
};

export const updateUserDoc = (userId, data) =>
  updateDoc(doc(db, 'users', userId), data);

// === Records ===

export const addRecord = (recordData) =>
  addDoc(collection(db, 'records'), {
    ...recordData,
    createdAt: serverTimestamp(),
  });

export const getUserRecords = async (userId, limitCount = 50) => {
  const q = query(
    collection(db, 'records'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const deleteRecord = (recordId) =>
  deleteDoc(doc(db, 'records', recordId));

export const deleteAllUserRecords = async (userId) => {
  const q = query(collection(db, 'records'), where('userId', '==', userId));
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  return batch.commit();
};

// === Analytics (비식별) ===

export const addAnalyticsEntry = (data) =>
  addDoc(collection(db, 'analytics'), {
    createdAt: serverTimestamp(),
    mode: data.mode,
    score: data.score,
    color: data.color,
    shape: data.shape,
    feedType: data.feedType || null,
    ageGroup: data.ageGroup || null,
    region: data.region || null,
  });
