/* eslint-disable no-undef */
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";   // For authentication
import { getFirestore } from "firebase/firestore"; // For database

console.log("Firebase API Key:", import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY);
const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY, // supports Vite and CRA
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID,
};

console.log("Firebase Config:", firebaseConfig); // ✅ debug

const app = initializeApp(firebaseConfig);

//export services you need
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
