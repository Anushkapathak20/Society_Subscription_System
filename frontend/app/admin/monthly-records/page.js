"use client"
import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
const ALL_MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",]
const MONTH_INDEX = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
  July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 }
function toYYYYMM(monthName) {
  if (!monthName) return null
  const year = new Date().getFullYear()
  const m = MONTH_INDEX[monthName]
  return m ? `${year}-${String(m).padStart(2, "0")}` : null
}
export default function MonthlyRecords() {
  const [records, setRecords] = useState([])
  const [meta, setMeta] = useState({})
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" }))
  const [showPending, setShowPending] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(8)
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedMonth, showPending])
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    const params = new URLSearchParams()
    const m = toYYYYMM(selectedMonth)
    if (m) params.set("month", m)
    if (showPending) params.set("status", "Pending")
    params.set("page", currentPage)
    params.set("limit", limit)
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL
    const url = `${BACKEND}/api/monthly-records${params.toString() ? "?" + params : ""}`
    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json())
      .then(data => {
        if (data.success) {
          setRecords(data.data || [])
          if (data.meta) {
            setTotalPages(data.meta.totalPages)
            setMeta(data.meta)
          }}
      }).catch(err => console.error(err))
  }, [selectedMonth, currentPage, showPending])
  const markPaid = async (record) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        alert("Unauthorized")
        return
      }
      const m = toYYYYMM(selectedMonth)
      const isSynthetic = record.record_id == null
      const res = isSynthetic
        ? await fetch("http://localhost:5000/api/monthly-records/pay-flat", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              flat_number: record.flat_number,
              month: m
            })
          })
        : await fetch(`http://localhost:5000/api/monthly-records/${record.record_id}/pay`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                payment_mode: "Cash"
              })}
          )
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || "Failed to update payment")
      }
      setRecords(prev => prev.map(r => (isSynthetic ? r.flat_number === record.flat_number : r.record_id === record.record_id) ? { ...r, status: "Paid" } : r))
    } catch (err) {
      console.error(err)
    }}
  const paidCount = meta.paid_count || 0
  const pendingCount = meta.pending_count || 0
  const totalPending = meta.total_pending || 0
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-0 w-full pt-16 lg:pt-4">
        <div>
          <div className="mb-6 md:mb-8 flex flex-col gap-3 md:gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Monthly Subscription Records</h1>
              <p className="text-sm md:text-base text-slate-500 mt-1">Shows each flat&apos;s payment status</p>
            </div>
            <div className="flex flex-col items-start sm:items-end gap-2">
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Month</label>
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full sm:w-auto px-3 md:px-4 py-2 md:py-2.5 bg-white border border-slate-200 rounded-lg text-xs md:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent min-w-[160px]">
                {ALL_MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
            <div className="p-4 md:p-6 rounded-xl bg-emerald-600 text-white shadow-sm">
              <p className="text-xs md:text-sm font-medium opacity-90">Paid Flats</p>
              <p className="text-xl md:text-2xl font-bold mt-1">{paidCount}</p>
            </div>
            <div className="p-4 md:p-6 rounded-xl bg-rose-600 text-white shadow-sm">
              <p className="text-xs md:text-sm font-medium opacity-90">Pending Flats</p>
              <p className="text-xl md:text-2xl font-bold mt-1">{pendingCount}</p>
            </div>
            <div className="p-4 md:p-6 rounded-xl bg-teal-600 text-white shadow-sm">
              <p className="text-xs md:text-sm font-medium opacity-90">Pending Amount</p>
              <p className="text-xl md:text-2xl font-bold mt-1">Rs.{totalPending}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
            <label className="flex items-center gap-2 md:gap-3 cursor-pointer">
              <input type="checkbox" checked={showPending} onChange={() => setShowPending(!showPending)}
                className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"/>
              <span className="text-xs md:text-sm font-medium text-slate-700">Show only pending payments</span>
            </label>
            {selectedMonth && (
              <span className="text-xs text-slate-500">Showing {records.length} of {meta.totalCount || 0} records for {selectedMonth}</span>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">Flat</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">Resident</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">Amount</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">Status</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                 <tbody className="divide-y divide-slate-100">{records.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 md:px-6 py-4 md:py-6 text-center text-xs md:text-sm text-slate-500">No records for {selectedMonth}.</td>
                    </tr>
                  ) : (
                    records.map((record) => (
                      <tr key={record.record_id ?? `synthetic-${record.flat_number}-${record.billing_month}`} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-slate-900 whitespace-nowrap">{record.flat_number}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-700 whitespace-nowrap">{record.full_name}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-slate-600 whitespace-nowrap">Rs.{record.amount_due}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${record.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>{record.status}</span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-right whitespace-nowrap">{record.status === "Pending" && (
                            <button onClick={() => markPaid(record)}
                              className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
                              <span className="hidden sm:inline">Mark as Paid</span>
                              <span className="sm:hidden">Paid</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              </div>
            </div>
            {/* Pagination*/}
            <div className="px-4 md:px-6 py-3 md:py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs md:text-sm text-slate-500">
                Page <span className="font-medium text-slate-700">{currentPage}</span> of <span className="font-medium text-slate-700">{totalPages}</span>
              </div>
              <div className="flex gap-2"><button disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-3 py-1.5 text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)}
                  className="px-3 py-1.5 text-xs md:text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}