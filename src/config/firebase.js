// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDjXmqgUu50-otaGwZyPUUUy5WbGWQlwo0",
  authDomain: "instagram-clone-51506.firebaseapp.com",
  projectId: "instagram-clone-51506",
  storageBucket: "instagram-clone-51506.appspot.com",
  messagingSenderId: "450511403816",
  appId: "1:450511403816:web:3b00cd50c75fc6684d6e1d",
  measurementId: "G-FC9ERXLQBT"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
