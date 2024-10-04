// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-blog-d22a8.firebaseapp.com",
  projectId: "mern-blog-d22a8",
  storageBucket: "mern-blog-d22a8.appspot.com",
  messagingSenderId: "434881639579",
  appId: "1:434881639579:web:2778c04154ca03ed3b023e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
