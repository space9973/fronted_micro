import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDk70KcR-_C8SDyI0HF66h2lEEvtor6sW4",
  authDomain: "micro-frontend-e06a3.firebaseapp.com",
  projectId: "micro-frontend-e06a3",
  storageBucket: "micro-frontend-e06a3.firebasestorage.app",
  messagingSenderId: "365048519933",
  appId: "1:365048519933:web:e0b34505df706495943294",
  measurementId: "G-GDNGT20WJK"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);