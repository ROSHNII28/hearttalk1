// src/firebase.js
import { initializeApp } from "firebase/app";
import { signOut as firebaseSignOut, getAuth, GoogleAuthProvider, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
export { firebaseSignOut as signOut };




const firebaseConfig = {
  apiKey: "AIzaSyAfwagzDlWzdSorNrVyPr0ikE4lhgha7Ec",
  authDomain: "hearttalk-a239b.firebaseapp.com",
  projectId: "hearttalk-a239b",
  storageBucket: "hearttalk-a239b.appspot.com",
  messagingSenderId: "310695683244",
  appId: "1:310695683244:web:a534bc87c619e80c94ab09",
  measurementId: "G-EJQK1R9J98"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Messaging (for push notifications)
export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Permission not granted for notifications");
      return null;
    }

    // Register SW explicitly
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log("Service Worker registered:", registration);

    // Get FCM token
    const token = await getToken(messaging, {
      vapidKey: "BDGHahDUkCow8hQYU51BupB-TwXFXcH8z91zYpo2bL0JTaZLz2DkZxnzLEXkaw7QlboBPJ2ohbjfEtxj68loOL8",
      serviceWorkerRegistration: registration,
    });

    console.log("FCM Token:", token);
    return token;
  } catch (err) {
    console.error("Error getting notification token:", err);
    return null;
  }
};


// Receive foreground notifications
onMessage(messaging, (payload) => {
  console.log("Foreground notification received:", payload);
});

let skipAnonymous = false; // flag to stop auto-login after logout

export const disableAnonymousLogin = () => {
  skipAnonymous = true;
};

export const ensureAuth = async () => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) return resolve(user);

      if (skipAnonymous) return resolve(null); // do not auto-login

      try {
        const newUser = await signInAnonymously(auth);
        resolve(newUser.user);
      } catch (error) {
        reject(error);
      }
    });
  });
};