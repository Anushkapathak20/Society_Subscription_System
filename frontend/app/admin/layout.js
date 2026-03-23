"use client"
import { usePathname } from "next/navigation"
import ProtectedRoute from "@/components/ProtectedRoute"
export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/admin/login"
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <div className="flex-1 flex flex-col min-w-0 w-full lg:ml-0">
        <main className="flex-1">
          {isLoginPage ? (
            <ProtectedRoute role="admin" guestOnly={true}>
              {children}
            </ProtectedRoute>
          ) : (
            <ProtectedRoute role="admin">
              {children}
            </ProtectedRoute>
          )}
        </main>
      </div>
    </div>
  )}