import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8W8nYUv8iUTKmIIDnWNO6OH_OPg6dqIs",
  authDomain: "inkartzo.firebaseapp.com",
  projectId: "inkartzo",
  storageBucket: "inkartzo.firebasestorage.app",
  messagingSenderId: "923188522523",
  appId: "1:923188522523:web:608ff2fa19e2e80c6a12be"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);