import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyALNjM6shLpXFul51Zi_zFb3aIsyH7z_5s",
  authDomain: "chat-app-c98ba.firebaseapp.com",
  projectId: "chat-app-c98ba",
  storageBucket: "chat-app-c98ba.firebasestorage.app",
  messagingSenderId: "703757200303",
  appId: "1:703757200303:web:15940d8379609e0dde9d5a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const signIn = () => signInWithPopup(auth, provider);
const logOut = () => signOut(auth);

export { auth, db, signIn, logOut, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp };