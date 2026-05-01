import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyABqodGIhUBhB8QB_hYjRU5Ol0ncJjrykM',
  authDomain: 'agenda-app-26399.firebaseapp.com',
  projectId: 'agenda-app-26399',
  storageBucket: 'agenda-app-26399.firebasestorage.app',
  messagingSenderId: '1035505953404',
  appId: '1:1035505953404:web:714a5387c0ae5db8b4f7f9',
  measurementId: 'G-EFTP8WZ01Q',
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(
  (value) => value && !value.startsWith('TU_')
);

export const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const db = app ? getFirestore(app) : null;
export const taskCollection = db ? collection(db, 'tasks') : null;
