"use client"
import { useEffect, useState, useRef, useCallback } from "react"
import { getToken, onMessage } from "firebase/messaging"
import { getFirebaseMessaging, firebaseConfig } from "./firebase"

export default function useFCM() {
  const [fcmMessage, setFcmMessage] = useState(null)
  const [permissionStatus, setPermissionStatus] = useState("default")
  const [permissionChecked, setPermissionChecked] = useState(false)
  const initialized = useRef(false)
  const messageListenerRef = useRef(null)
  const setupFCM = useCallback(async () => {
    if (initialized.current) {
      console.log("FCM already initialized, skipping...")
      return
    }
    initialized.current = true
    try {
      const authToken = localStorage.getItem("token")
      if (!authToken) {
        initialized.current = false
        return
      }
      const messaging = await getFirebaseMessaging()
      if (!messaging) {
        initialized.current = false
        return
      }
      const params = new URLSearchParams(firebaseConfig).toString()
      const swRegistration = await navigator.serviceWorker.register(
        `/firebase-messaging-sw.js?${params}`
      )
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
      const fcmToken = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: swRegistration,
      })
      if (fcmToken) {
        console.log("FCM token obtained:", fcmToken.substring(0, 20) + "...")
        const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
        await fetch(`${BACKEND}/api/fcm/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ token: fcmToken }),
        })
        console.log("FCM token registered with backend")
      }
      if (messageListenerRef.current) {
        messageListenerRef.current()
      }
      messageListenerRef.current = onMessage(messaging, (payload) => {
        console.log("Foreground FCM message:", payload)
        const notification = payload.notification || {}
        const data = payload.data || {}
        const title = notification.title || data.title
        const body = notification.body || data.body || ""
        if (title) {
          setFcmMessage({ title, body })
          if (Notification.permission === "granted") {
            new Notification(title, {
              body,
              icon: "/favicon.ico",
            })
          }
        }
      })
    } catch (err) {
      console.error("FCM setup error:", err)
      initialized.current = false
    }
  }, [])
  useEffect(() => {
    if (typeof Notification !== "undefined") {
      const perm = Notification.permission
      setPermissionStatus(perm)
      if (perm === "granted") {
        setupFCM()
      }
    }
    setPermissionChecked(true)
    return () => {
      if (messageListenerRef.current) {
        messageListenerRef.current()
      }
    }
  }, [setupFCM])
  const requestPermissionAndRegister = useCallback(async () => {
    try {
      const permission = await Notification.requestPermission()
      setPermissionStatus(permission)

      if (permission === "granted") {
        await setupFCM()
      } else {
        console.warn("Notification permission denied")
      }
    } catch (err) {
      console.error("Permission request error:", err)
    }
  }, [setupFCM])

  const clearMessage = useCallback(() => setFcmMessage(null), [])

  return { fcmMessage, clearMessage, permissionStatus, permissionChecked, requestPermissionAndRegister }
}
