import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCWrA7DVWa5pe3anj4VDX82BCRwOSJZ_rQ',
  authDomain: 'security-system-739a5.firebaseapp.com',
  projectId: 'security-system-739a5',
  storageBucket: 'security-system-739a5.appspot.com',
  messagingSenderId: '1037678575752',
  appId: '1:1037678575752:web:2e3b1c853f51041edb9f3d',
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

const db = getFirestore()
const storage = getStorage()

export { app, db, storage }
