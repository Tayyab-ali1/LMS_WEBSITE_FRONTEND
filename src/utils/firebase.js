import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ✅ Replace with your actual environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY, // ✅ Correctly placed
  authDomain: "learning-hub-6e192.firebaseapp.com",
  projectId: "learning-hub-6e192",
  storageBucket: "learning-hub-6e192.firebasestorage.app",
  messagingSenderId: "699771680503",
  appId: "1:699771680503:web:d8586456b722a567db05f2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase Auth setup
const auth = getAuth(app);
const provider = new GoogleAuthProvider(); // ✅ Correct instantiation

export { auth, provider };