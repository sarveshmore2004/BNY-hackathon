// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "newsifier-cca81.firebaseapp.com",
  projectId: "newsifier-cca81",
  storageBucket: "newsifier-cca81.appspot.com",
  messagingSenderId: "950470810593",
  appId: "1:950470810593:web:0d55bb8650aba3b70290a0",
  measurementId: "G-FH0Y9GJT4Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);