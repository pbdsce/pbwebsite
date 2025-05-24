// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBG_SOIvFjExIfZd_91AjFESGaqwRESLM",
  authDomain: "pbwebsite-d70a3.firebaseapp.com",
  projectId: "pbwebsite-d70a3",
  storageBucket: "pbwebsite-d70a3.appspot.com",
  messagingSenderId: "975915344098",
  appId: "1:975915344098:web:2c5a0e634950afd86afebb",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth,  db, googleProvider};
