import { auth, functions } from './FirebaseConfig';
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

/**
 * Deletes the current user's Auth account and triggers a background 
 * function to wipe their Firestore data (Recipes, Profile, etc.)
 */
export async function deleteUserAccount() {
  const user = auth.currentUser;
  if (!user) throw new Error('No user signed in');

  try {
    // 1. Trigger Cloud Function to wipe data (Firestore/Storage)
    const wipeData = httpsCallable(functions, 'wipeUserData');
    await wipeData();

    // 2. Delete the Auth record
    await deleteUser(user);
    
    return true;
  } catch (error: any) {
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('REAUTHENTICATION_REQUIRED');
    }
    throw error;
  }
}
