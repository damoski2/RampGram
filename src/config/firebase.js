// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDkgzZb-cdrcXbHg_Yfij6pDkeyI8qSipI",
    authDomain: "instagram-clone-983f1.firebaseapp.com",
    projectId: "instagram-clone-983f1",
    storageBucket: "instagram-clone-983f1.appspot.com",
    messagingSenderId: "21666663664",
    appId: "1:21666663664:web:640233e0c0816cdf0a4635",
    measurementId: "G-MVNBC3ZCX9"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
