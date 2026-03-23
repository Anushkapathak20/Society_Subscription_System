"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import UserSidebar from "@/components/UserSidebar"
import { Bell } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
export default function UserLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"
  const [unreadCount, setUnreadCount] = useState(0)
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
  const logoutUser = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("residentUser")
    router.push("/login")
  }
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return
      const res = await fetch(`${BACKEND}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (res.status === 401) {
        logoutUser()
        return
      }
      const data = await res.json()
      if (data.success && data.data) {
        const unread = data.data.filter(n => !n.is_read).length
        setUnreadCount(unread)
      }
    } catch (err) {
      console.error("Unread count error:", err)
    }
  }
  useEffect(() => {
    if (!isLoginPage) {
      fetchUnreadCount()
    }
  }, [isLoginPage, pathname])
  useEffect(() => {
    const handleFocus = () => {
      if (!isLoginPage) fetchUnreadCount()
    }
    window.addEventListener("focus", handleFocus)
    return () => window.removeEventListener("focus", handleFocus)
  }, [isLoginPage])
  return (
    <div className="flex min-h-screen bg-slate-50">
      <UserSidebar />
      <div className="flex-1 flex flex-col w-full">
        {!isLoginPage && (
          <header className="flex items-center justify-between px-4 md:px-6 py-3 bg-white border-b border-slate-200">
            <div className="lg:hidden w-12"></div>
            <div className="flex-1 flex justify-end">
              <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <Bell className="w-6 h-6 text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-rose-500 rounded-full">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </Link>
            </div>
          </header>
        )}
        <main className="flex-1 p-4 md:p-6">
          {isLoginPage ? (
            <ProtectedRoute role="resident" guestOnly={true}>
              {children}
            </ProtectedRoute>
          ) : (
            <ProtectedRoute role="resident">
              {children}
            </ProtectedRoute>
          )}
        </main>
      </div>
    </div>
  )
}




















