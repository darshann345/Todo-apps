import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCEh_YsvomWLcgHo8OkemCrJrDu0OMBaok",
  authDomain: "todo-authethication.firebaseapp.com",
  projectId: "todo-authethication",
  storageBucket: "todo-authethication.firebasestorage.app",
  messagingSenderId: "340435645879",
  appId: "1:340435645879:web:332c86c888a3a68e2de432",
  measurementId: "G-HKVJ2Z8W4Q",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); 
const provider = new GoogleAuthProvider(); 

export const signInWithGoogle = async (): Promise<User | null> => {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    const user = result.user;
    return user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.error("Google Sign-in Error:", errorCode, errorMessage, email, credential);
    return null;
  }
};

export { app, analytics, auth }; 