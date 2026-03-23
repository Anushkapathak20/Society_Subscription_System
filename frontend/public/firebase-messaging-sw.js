/* eslint-disable no-undef */

importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js")
const urlParams = new URL(location).searchParams
const firebaseConfig = {
  apiKey: urlParams.get("apiKey"),
  authDomain: urlParams.get("authDomain"),
  projectId: urlParams.get("projectId"),
  storageBucket: urlParams.get("storageBucket"),
  messagingSenderId: urlParams.get("messagingSenderId"),
  appId: urlParams.get("appId"),
}

if (firebaseConfig.apiKey) {
  firebase.initializeApp(firebaseConfig)
} else {
  console.warn("[firebase-messaging-sw.js] Firebase config not provided in query string.")
}

const messaging = firebase.messaging()
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message:", payload)

  const { title, body } = payload.notification || payload.data || {}

  if (title) {
    self.registration.showNotification(title, {
      body: body || "",
      icon: "/favicon.ico",
    })
  }
})
