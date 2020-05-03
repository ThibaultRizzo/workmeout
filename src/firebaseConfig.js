import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAJGdwMsjCrNqgC_jKpGpaVJnvhwQScdNs",
  authDomain: "workmeout-394ed.firebaseapp.com",
  databaseURL: "https://workmeout-394ed.firebaseio.com",
  projectId: "workmeout-394ed",
  storageBucket: "workmeout-394ed.appspot.com",
  messagingSenderId: "600482934330",
  appId: "1:600482934330:web:e9d7113cff3df14b54cf03",
  measurementId: "G-5Y765MRHGF",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

const workoutsCollection = db.collection("workouts");

const fb = { db, auth, currentUser, workoutsCollection };

export default fb;
