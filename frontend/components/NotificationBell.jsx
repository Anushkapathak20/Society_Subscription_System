"use client"
import { Bell } from "lucide-react"
import { useEffect, useState } from "react"
export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([])
  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(
        `http://localhost:5000/api/notifications/user/${userId}`
      )
      const data = await res.json()
      if (data.success) {
        setNotifications(data.data)
      }
    }
    fetchNotifications()
  }, [userId])
  const unreadCount = notifications.filter(n => !n.is_read).length
  return (
    <div className="relative">
      <Bell size={22} className="text-slate-700 cursor-pointer" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  )
}