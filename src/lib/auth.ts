
'use client';

import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';

const provider = new GoogleAuthProvider();
// Request access to the user's Gmail messages and settings.
// This is a sensitive scope, and your app will need to go through Google's verification process
// to use it in production.
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');

export async function handleSignIn() {
  try {
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential) {
      const token = credential.accessToken;
      // You would typically send this token to your backend to be stored securely
      // and used for server-to-server API calls to scan the inbox.
      console.log('Access Token:', token);
    }
    const user = result.user;
    console.log('Signed in user:', user);
    // You can now update the UI to show the user is connected.
  } catch (error) {
    console.error('Error signing in:', error);
    // Handle errors here, such as showing a notification to the user.
  }
}

export async function handleSignOut() {
    try {
        await firebaseSignOut(auth);
        console.log('User signed out');
    } catch (error) {
        console.error('Error signing out:', error);
    }
}
