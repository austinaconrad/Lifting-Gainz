// ============================================================
//  FIREBASE CONFIG — replace with your project's credentials
//  Firebase Console → Project Settings → Your Apps → Web App
// ============================================================

const firebaseConfig = {
  apiKey:            "AIzaSyCjSsPdNvAyyOEe7c5iPOMKbdWIbRqqmWk",
  authDomain:        "lifting-gainz.firebaseapp.com",
  databaseURL:       "https://lifting-gainz-default-rtdb.firebaseio.com",
  projectId:         "lifting-gainz",
  storageBucket:     "lifting-gainz.firebasestorage.app",
  messagingSenderId: "474597587841",
  appId:             "1:474597587841:web:c8b5fa6aaa1be0e1858680",
  measurementId:     "G-B3YK5WLEPH"
};

// Initialize Firebase
import { initializeApp }              from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }                    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }               from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

export { auth, db };
