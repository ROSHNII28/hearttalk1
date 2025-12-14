importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAfwagzDlWzdSorNrVyPr0ikE4lhgha7Ec",
  authDomain: "hearttalk-a239b.firebaseapp.com",
  projectId: "hearttalk-a239b",
  messagingSenderId: "310695683244",
  appId: "1:310695683244:web:a534bc87c619e80c94ab09",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
