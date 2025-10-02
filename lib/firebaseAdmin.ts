import * as admin from 'firebase-admin';

const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (serviceAccountJson){
  const serviceAccount = JSON.parse(serviceAccountJson);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } 
} else {
      console.log("Skipping Firebase initialization (no credentials available)");
 }

export const verifyFirebaseToken = async (token: string) => {
  try {
    return await admin.auth().verifyIdToken(token);
  } catch (error) {
    console.error("Token verification failed", error);
    throw new Error("Unauthorized");
  }
};