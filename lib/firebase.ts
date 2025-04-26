import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyD4a-mryT5qPBuk6oHDLDNOY3zbVVKu998",
  authDomain: "tradewave-f9423.firebaseapp.com",
  projectId: "tradewave-f9423",
  storageBucket: "tradewave-f9423.firebasestorage.app",
  messagingSenderId: "1018259317110",
  appId: "1:1018259317110:web:8ec4c807953b7650f6da57",
  measurementId: "G-3MSF7XJ7D5"
}

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage } 