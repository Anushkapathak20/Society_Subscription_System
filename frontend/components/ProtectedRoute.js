"use client"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
export default function ProtectedRoute({ children, role, guestOnly = false }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlToken = params.get("token")
    const errorParam = params.get("error")
    if (errorParam) {
      alert(errorParam)
      params.delete("error")
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`
      window.history.replaceState({}, "", newUrl)
    }
    if (urlToken) {
      localStorage.setItem("token", urlToken)
      localStorage.setItem("userRole", role || "resident") 
      params.delete("token")
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`
      window.history.replaceState({}, "", newUrl)
    }
    const token = localStorage.getItem("token")
    const userRole = localStorage.getItem("userRole")
    const loginPath = role === "admin" ? "/admin/login" : "/login"
    const dashboardPath = userRole === "admin" ? "/admin/dashboard" : "/notifications" // notifications is the resident dashboard
    // If guestOnly is true (e.g. for /login), and there's a token, redirect to dashboard
    // BUT only if the role matches. This allows a resident to see the admin login page.
    if (guestOnly && token) {
      const payload = JSON.parse(atob(token.split(".")[1]))
      if (payload.role === role) {
        router.push(dashboardPath)
        return
      }
    }
    if (!guestOnly && !token) {
      router.push(loginPath)
      return
    }
    if (!guestOnly) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        if (role && payload.role !== role) {
          alert(`Access denied. ${role} privileges required.`)
          router.push(loginPath)
          return
        }
      } catch (error) {
        console.error("Invalid token:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("userRole")
        router.push(loginPath)
        return
      }
    }
    setIsAuthorized(true)
  }, [role, router, pathname, guestOnly])
  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }
  return children
}
