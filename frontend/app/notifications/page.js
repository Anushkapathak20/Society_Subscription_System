"use client"
import { useEffect, useState } from "react"
import UserLayout from "../layout-user"
import { Bell, ChevronLeft, ChevronRight } from "lucide-react"
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const limit = 6
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const fetchData = async () => {
        try {
          setLoading(true)
          await fetch(`${BACKEND}/api/resident/notifications/mark-all-read`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
          })
             const res = await fetch(`${BACKEND}/api/notifications?page=${currentPage}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const data = await res.json()
          console.log("Notifications API response:", data.data)
          if (data.success) {
            setNotifications(data.data || [])
            setTotalPages(data.meta?.totalPages || 1)
            setTotalCount(data.meta?.totalCount || 0)
          }
        } catch (err) {
          console.error("Error:", err)
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    } catch {
      setLoading(false)
    }
  }, [currentPage])
  return (
    <UserLayout>
      <div>
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Notifications</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">All your notifications</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 md:py-20">
            <div className="animate-spin rounded-full h-8 w-8 md:h-10 md:w-10 border-b-2 border-teal-600"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12 text-center">
            <Bell className="w-8 h-8 md:w-10 md:h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 text-xs md:text-sm">No notifications yet</p>
          </div>
        ) : (
          <>
            <div className="space-y-2 md:space-y-3">
              {notifications.map((n, index) => (
                <div key={n.id ?? index} className={`bg-white rounded-xl shadow-sm border p-4 md:p-5 
                  ${!n.is_read ? "border-teal-400 bg-teal-50" : "border-slate-200"}`}>
                  <div className="flex items-start justify-between gap-3 md:gap-4">
                    <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                      {!n.is_read && (
                        <div className="flex-shrink-0 w-2 h-2 mt-1.5 md:mt-2 rounded-full bg-teal-500"></div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs md:text-sm font-semibold text-slate-900 break-words">{n.title}</p>
                        <p className="text-xs md:text-sm text-slate-500 mt-1 break-words">{n.message}</p>
                      </div>
                    </div>
                    <span className="text-[10px] md:text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                      {new Date(n.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <div className="text-xs md:text-sm text-slate-600">
                  Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} notifications
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                  </button>
                  <span className="text-xs md:text-sm text-slate-600 px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </UserLayout>
  )}