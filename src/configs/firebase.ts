import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD53EabCHRGk1Dd-LOs0MmcAFii3-SqqL8",
  authDomain: "ai-quiz-app-1cc11.firebaseapp.com",
  databaseURL: "https://ai-quiz-app-1cc11-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ai-quiz-app-1cc11",
  storageBucket: "ai-quiz-app-1cc11.firebasestorage.app",
  messagingSenderId: "576952411232",
  appId: "1:576952411232:web:4070792ec723db7f0acf05",
  measurementId: "G-TSPBKM9SYS"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)