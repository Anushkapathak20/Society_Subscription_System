"use client"
import { useEffect, useState } from "react"
import UserLayout from "../layout-user"
import formatMonth from "@/utils/formatMonth"
import useFCM from "@/utils/useFCM"
import { Bell } from "lucide-react"
export default function Dashboard() {
  const [data, setData] = useState(null)
  const [payments, setPayments] = useState([])
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
  const { fcmMessage, clearMessage, permissionStatus, permissionChecked, requestPermissionAndRegister } = useFCM()
  const [alert, setAlert] = useState(null)
  useEffect(() => {
    if (fcmMessage) {
      setAlert(fcmMessage)
      const timer = setTimeout(() => {
        setAlert(null)
        clearMessage()
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [fcmMessage, clearMessage])
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    fetch(`${BACKEND}/api/resident/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json())
      .then(res => {
        if (!res.success) {
          console.error(res.error)
          return
        }
        setData(res.summary ?? null)
        setPayments(res.data ?? [])
      }).catch(err => console.error("Error fetching dashboard data:", err))
  }, [])
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token")
      await fetch(
        `${BACKEND}/api/resident/notifications/${id}/read`,
        { 
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      setData(prev => ({
        ...prev, notifications: prev.notifications.map(n => n.id === id ? { ...n, is_read: true } : n)
      }))
    } catch (err) {
      console.error("Error marking notification read:", err)
    }
  }
  return (
    <UserLayout>
        {alert && (
          <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50">
            <div className="bg-white border-l-4 border-teal-500 rounded-xl shadow-lg p-3 flex gap-3">
              <div className="w-7 h-7 bg-teal-100 rounded-full flex items-center justify-center"><Bell className="w-4 h-4 text-teal-600" /></div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-slate-900">{alert.title}</p>
                <p className="text-xs text-slate-500 mt-1">{alert.body}</p></div>
                <button onClick={() => { setAlert(null); clearMessage() }} className="text-slate-400 text-lg">✕</button>
                </div>
                </div>
              )}
     <div>
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Resident Dashboard</h1>
          <p className="text-sm md:text-base text-slate-500 mt-1">Your subscription overview</p>
        </div>
        {permissionChecked && permissionStatus !== "granted" && (
  <div className="mb-4 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 p-3 md:p-4 rounded-xl border bg-teal-50 border-teal-200">
    <div className="flex items-start gap-2 md:gap-3"><Bell className="w-4 h-4 md:w-5 md:h-5 text-teal-600 mt-0.5" /><div>
        <p className="font-semibold text-slate-900 text-xs md:text-sm">Enable Push Notifications</p>
        <p className="text-slate-500 text-xs">Get instant alerts when the admin sends you a notification.</p>
      </div>
    </div>
    <button onClick={requestPermissionAndRegister} className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-white rounded-lg w-full sm:w-auto bg-teal-500 whitespace-nowrap">
      Enable Now
    </button>
  </div>
)}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xs md:text-sm text-slate-500">Flat</h2>
            <p className="text-lg md:text-xl font-bold mt-2">{data?.flat_number}</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xs md:text-sm text-slate-500">Billing Month</h2>
            <p className="text-lg md:text-xl font-bold mt-2">{formatMonth(data?.billing_month)}</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xs md:text-sm text-slate-500">Amount Due</h2>
            <p className="text-lg md:text-xl font-bold text-rose-600 mt-2">{data?.amount_due != null ? `Rs.${data.amount_due}` : "-"}</p>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold mb-2">Current Subscription Status</h2>
          <p className={`font-bold ${ data?.status === "Paid" ? "text-emerald-600" : "text-rose-600" }`}>{data?.status}</p>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold mb-4">Payment History</h2>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase py-3 px-4 whitespace-nowrap">Billing Month</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase py-3 px-4 whitespace-nowrap">Amount Paid</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase py-3 px-4 whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-sm whitespace-nowrap">{formatMonth(p?.billing_month)}</td>
                      <td className="py-3 px-4 text-sm whitespace-nowrap"> {p?.amount_paid != null ? `Rs.${p.amount_paid}` : "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-sm ${ p?.status === "Paid" ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}`}>{p?.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-base md:text-lg font-semibold mb-4">Notifications</h2>
          <ul className="space-y-2">
            {data?.notifications?.length ? (
              data.notifications.map((n, index) => (
                <li key={n?.id ?? index} onClick={() => markAsRead(n?.id)}
                  className={`flex items-start gap-2 cursor-pointer p-2 rounded text-sm md:text-base
                  ${
                    !n.is_read
                      ? "font-semibold text-slate-900"
                      : "text-slate-500"
                  }
                  hover:bg-slate-50`}>
                  <span className="text-teal-500 mt-1">•</span>
                  <span className="break-words">
                    <strong>{n.title}:</strong> {n.message}
                  </span>
                </li>
              ))
            ) : (
              <li key="no-notifications" className="text-slate-400 text-sm md:text-base">No notifications</li>
            )}
          </ul>
        </div>
      </div>
    </UserLayout>
  )
}