// Firebase + Firestore Service
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirestore, collection, addDoc, getDocs,
  query, orderBy, limit, onSnapshot, serverTimestamp,
  doc, updateDoc, deleteDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

let app, db, storage, auth, googleProvider;
let firebaseReady = false;

try {
  if (import.meta.env.VITE_FIREBASE_API_KEY) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    firebaseReady = true;
  }
} catch (e) {
  console.warn('Firebase not configured — using local mode');
}

// Auth Functions
export async function signInWithGoogle() {
  if (!firebaseReady) throw new Error('Firebase not initialized');
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function logoutUser() {
  if (!firebaseReady) return;
  await signOut(auth);
}

// Threats
export async function saveThreat(threat) {
  if (!firebaseReady) return { id: `local_${Date.now()}`, ...threat };
  const ref2 = await addDoc(collection(db, 'threats'), { ...threat, createdAt: serverTimestamp() });
  return { id: ref2.id, ...threat };
}

export async function getThreats(limitCount = 50) {
  if (!firebaseReady) return [];
  const q = query(collection(db, 'threats'), orderBy('createdAt', 'desc'), limit(limitCount));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function subscribeThreats(callback) {
  if (!firebaseReady) return () => {};
  const q = query(collection(db, 'threats'), orderBy('createdAt', 'desc'), limit(20));
  return onSnapshot(q, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

export async function updateThreat(id, data) {
  if (!firebaseReady) return;
  await updateDoc(doc(db, 'threats', id), data);
}

export async function deleteThreat(id) {
  if (!firebaseReady) return;
  await deleteDoc(doc(db, 'threats', id));
}

// Assets
export async function saveAsset(asset) {
  if (!firebaseReady) return { id: `local_${Date.now()}`, ...asset };
  const ref2 = await addDoc(collection(db, 'assets'), { ...asset, createdAt: serverTimestamp() });
  return { id: ref2.id, ...asset };
}

export async function getAssets() {
  if (!firebaseReady) return [];
  const q = query(collection(db, 'assets'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// File upload to Storage
export async function uploadAssetFile(file) {
  if (!firebaseReady) return null;
  const storageRef = ref(storage, `assets/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// Reports
export async function saveReport(report) {
  if (!firebaseReady) return { id: `local_${Date.now()}`, ...report };
  const ref2 = await addDoc(collection(db, 'reports'), { ...report, createdAt: serverTimestamp() });
  return { id: ref2.id, ...report };
}

export async function getReports() {
  if (!firebaseReady) return [];
  const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export { firebaseReady };
