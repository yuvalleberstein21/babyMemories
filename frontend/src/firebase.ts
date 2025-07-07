// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAyXtrXmRvg1Iyq4KZi05gjYX9J27NjStE',
  authDomain: 'babymemories-5764d.firebaseapp.com',
  projectId: 'babymemories-5764d',
  storageBucket: 'babymemories-5764d.firebasestorage.app',
  messagingSenderId: '268985935425',
  appId: '1:268985935425:web:3239d143e11fc4a8da48c0',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
