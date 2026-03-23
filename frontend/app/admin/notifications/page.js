"use client"
import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [type, setType] = useState("all")
  const [flatNumber, setFlatNumber] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(4)
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    const fetchNotifications = async () => {
      const res = await fetch(`${BACKEND}/api/notifications?page=${currentPage}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (data.success) {
        setNotifications(data.data)
        if (data.meta) {
          setTotalPages(data.meta.totalPages)
        }}
    }
    fetchNotifications()
  }, [currentPage])
  const sendNotification = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem("token")
    const res = await fetch(`${BACKEND}/api/notifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        message,
        type,
        flat_number: flatNumber
      })
    })
    const data = await res.json()
    if (data.success) {
      alert("Notification Sent Successfully")
      setTitle("")
      setMessage("")
      setFlatNumber("")
      window.location.reload()
    }}
  const inputClass =
    "px-3 md:px-4 py-2 md:py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-0 w-full pt-16 lg:pt-4">
        <div>
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Notifications</h1>
            <p className="text-sm md:text-base text-slate-500 mt-1">Send and view notifications</p>
          </div>
          <form onSubmit={sendNotification} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 mb-6 md:mb-8">
            <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-3 md:mb-4">Send Notification</h2>
            <div className="space-y-3 md:space-y-4 mb-3 md:mb-4">
              <select value={type} onChange={(e) => setType(e.target.value)} className={`${inputClass} w-full text-sm md:text-base`}>
                <option value="all">All Users</option>
                <option value="user">Specific Flat</option>
              </select>
              {type === "user" && (
                <input type="text" placeholder="Enter Flat Number (ex: A101)" value={flatNumber} onChange={(e) => setFlatNumber(e.target.value)} className={`${inputClass} w-full text-sm md:text-base`}/>
              )}
              <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} className={`${inputClass} w-full text-sm md:text-base`}/>
              <textarea placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} className={`${inputClass} w-full min-h-[100px] text-sm md:text-base`}/>
            </div>
            <button type="submit" className="px-4 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700">
              Send Notification
            </button>
          </form>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">Title</th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">Message</th>
                    <th className="text-left text-xs font-semibold text-slate-500 px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">Created At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <tr key={n.id}>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-slate-900 whitespace-nowrap">{n.title}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-600">
                        <div className="max-w-xs md:max-w-md truncate">{n.message}</div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-500 whitespace-nowrap">{new Date(n.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
            {/* Pagination */}
            <div className="px-4 md:px-6 py-3 md:py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs md:text-sm text-slate-500">
                Page <span className="font-medium text-slate-700">{currentPage}</span> of <span className="font-medium text-slate-700">{totalPages}</span>
              </div>
              <div className="flex gap-2">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="px-3 py-1.5 text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-3 py-1.5 text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}