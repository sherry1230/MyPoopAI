import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './firebase';

// dataURL → Blob 변환
export const dataUrlToBlob = (dataUrl) => {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(base64);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
};

// 원본 이미지 업로드
export const uploadOriginalImage = async (userId, recordId, imageDataUrl) => {
  const blob = dataUrlToBlob(imageDataUrl);
  const path = `users/${userId}/originals/${recordId}.jpg`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  return path;
};

// 모자이크/스티커 처리된 이미지 업로드
export const uploadCoveredImage = async (userId, recordId, imageDataUrl) => {
  const blob = dataUrlToBlob(imageDataUrl);
  const path = `users/${userId}/covered/${recordId}.jpg`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, blob);
  return path;
};

// 이미지 URL 가져오기
export const getImageUrl = (path) =>
  getDownloadURL(ref(storage, path));

// 이미지 삭제
export const deleteImage = (path) =>
  deleteObject(ref(storage, path));
