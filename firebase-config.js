// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

import 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyBViM_WIavB6NTZhjzYBMq9KjH3tfleMN8",
  authDomain: "tfgchinodef.firebaseapp.com",
  projectId: "tfgchinodef",
  storageBucket: "tfgchinodef.appspot.com",
  messagingSenderId: "278130530065",
  appId: "1:278130530065:web:13064dd1a38af455d2deb0",
  measurementId: "G-XSCFMJRRY2"
};

// Initialize Firebase

if (!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}
export {firebase};
