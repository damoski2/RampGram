// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "##classified",
    authDomain: "##classified",
    projectId: "##classified",
    storageBucket: "##classified",
    messagingSenderId: "##classified",
    appId: "##classified",
    measurementId: "##classified"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
