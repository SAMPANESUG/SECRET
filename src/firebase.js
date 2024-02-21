import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDmDbDdtpeCC6AM6xtzF3U_j0MK18tonaw",
  authDomain: "student-platform-d36fc.firebaseapp.com",
  projectId: "student-platform-d36fc",
  storageBucket: "student-platform-d36fc.appspot.com",
  messagingSenderId: "932592053444",
  appId: "1:932592053444:web:7ea1b32c08628b9a9dad91",
  measurementId: "G-0B0SR7PJMG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
