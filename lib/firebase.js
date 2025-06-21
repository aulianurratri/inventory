// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ tambahkan ini

const firebaseConfig = {
  apiKey: "AIzaSyDM0Hd-fV2sPmR2Ur_g2eedIb4ahpc6318",
  authDomain: "fairel-inventory.firebaseapp.com",
  projectId: "fairel-inventory",
  storageBucket: "fairel-inventory.appspot.com", // ✅ pastikan ini sesuai
  messagingSenderId: "5226649335",
  appId: "1:5226649335:web:0096fd818b66037603a5f2",
  measurementId: "G-3JF81PPJPK"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ ini penting untuk upload gambar
