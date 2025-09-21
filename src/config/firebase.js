// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2LQKFHolkFxVxJI7JU8RxmyOnvcWLSkw",
  authDomain: "book-stores-orka.firebaseapp.com",
  projectId: "book-stores-orka",
  storageBucket: "book-stores-orka.firebasestorage.app",
  messagingSenderId: "1050976956116",
  appId: "1:1050976956116:web:94d9fc0120a20ebbcb1541",
  measurementId: "G-NK69MZKQV4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);
