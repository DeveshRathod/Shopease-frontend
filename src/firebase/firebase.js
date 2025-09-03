import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_APIKEY,
  authDomain: "ecom-ease.firebaseapp.com",
  projectId: "ecom-ease",
  storageBucket: "ecom-ease.appspot.com",
  messagingSenderId: import.meta.env.FIREBASE_ID,
  appId: import.meta.env.FIREBASE_APPID,
};

export const app = initializeApp(firebaseConfig);
