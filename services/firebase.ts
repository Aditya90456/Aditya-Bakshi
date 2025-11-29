import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';

// Your web app's Firebase configuration
// These should be set in your .env file
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
// We wrap in a try-catch to prevent app crash if config is missing (for demo purposes)
let auth: any = null;
let googleProvider: any = null;

try {
  // Check if apiKey is present and looks valid (not undefined/empty)
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
  } else {
    // Config missing - silent fallback to simulation
  }
} catch (error) {
  console.error("Firebase Initialization Error:", error);
}

// Export a flag to check if Firebase is ready
export const isFirebaseReady = !!auth;

export const signInWithGoogle = async () => {
  if (!isFirebaseReady || !auth || !googleProvider) {
    throw new Error("Firebase not configured");
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    // The signed-in user info.
    const user = result.user;
    return {
      name: user.displayName || 'User',
      email: user.email || '',
      photoUrl: user.photoURL,
      uid: user.uid
    };
  } catch (error: any) {
    console.error("Google Sign In Error", error);
    throw error;
  }
};

export const logoutFirebase = async () => {
  if (auth) {
    await firebaseSignOut(auth);
  }
};