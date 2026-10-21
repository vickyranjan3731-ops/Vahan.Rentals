import admin from 'firebase-admin';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

let firebaseApp = null;
let isInitialized = false;

try {
  // Option 1: File path to serviceAccountKey.json
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
                  path.resolve(__dirname, '../../serviceAccountKey.json');

  if (fs.existsSync(keyPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isInitialized = true;
    console.log('🔥 Firebase Admin SDK initialized from serviceAccountKey.json');
  } 
  // Option 2: Raw JSON String in ENV
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isInitialized = true;
    console.log('🔥 Firebase Admin SDK initialized from FIREBASE_SERVICE_ACCOUNT_KEY env');
  } 
  // Option 3: Individual ENV variables
  else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
      })
    });
    isInitialized = true;
    console.log('🔥 Firebase Admin SDK initialized from individual env credentials');
  } 
  // Option 4: Default Application Credentials (GCP / Local Emulator)
  else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    firebaseApp = admin.initializeApp();
    isInitialized = true;
    console.log('🔥 Firebase Admin SDK initialized from GOOGLE_APPLICATION_CREDENTIALS');
  } else {
    console.warn('⚠️ Firebase Admin credentials not found. Auth middleware will run in Dev Mock Mode until Firebase credentials are configured in .env');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin initialization notice:', error.message);
}

export const auth = isInitialized ? admin.auth() : null;
export { admin, isInitialized };
export default firebaseApp;
