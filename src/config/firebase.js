// Frontend Firebase Client Configuration
// Fill in your Firebase Web App configuration from Firebase Console:
// Project Settings -> General -> Your apps -> Web App (</>)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoDummyKeyForVahanRentalsDev123",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "vahan-rentals-app.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "vahan-rentals-app",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "vahan-rentals-app.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:abcdef123456"
};

export default firebaseConfig;
