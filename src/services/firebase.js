import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const firebaseConfig = {
  apiKey: 'AIzaSyASm8E_gmpec2MUsNAXg41gmmlkgOBMCO4',
  authDomain: 'hospital-finder-c0ebe.firebaseapp.com',
  projectId: 'hospital-finder-c0ebe',
  storageBucket: 'hospital-finder-c0ebe.firebasestorage.app',
  messagingSenderId: '220800745817',
  appId: '1:220800745817:web:0167ac39fc30582a408c48'
};

// Initialize Firebase
/*const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    throw error;
  }
};*/
// services/firebase.js

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider)
    .then((result) => result.user)
    .catch((error) => {
      console.error("Google Sign-In Error:", error);
      throw error;
    });
};