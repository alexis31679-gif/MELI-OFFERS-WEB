import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyOIBYyzN2Mxw8hZFrEwVvjuyJmgaSxjo",
  authDomain: "melioffers.firebaseapp.com",
  projectId: "melioffers",
  storageBucket: "melioffers.firebasestorage.app",
  messagingSenderId: "627985936723",
  appId: "1:627985936723:web:666cbc0e3f502b031df1a6"
};

// Inicializamos Firebase y exportamos la base de datos (Firestore)
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);