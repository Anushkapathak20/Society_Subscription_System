"use client"
import { useState, useEffect } from "react"
import jsPDF from "jspdf"
import Sidebar from "@/components/Sidebar"
const MONTH_INDEX = { January: 1, February: 2, March: 3, April: 4, May: 5, June: 6, July: 7, August: 8, September: 9, October: 10, November: 11, December: 12 }
const MONTHS = ["All", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState("All")
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    const token = localStorage.getItem("token")
    const fetchReport = async () => {
      try {
        setError(null)
        let url = ""
        if (selectedMonth === "All") {
          url = `http://localhost:5000/api/reports/yearly?month=12`
        } else {
          const monthNumber = MONTH_INDEX[selectedMonth]
          url = `http://localhost:5000/api/reports/monthly?month=${monthNumber}`
        }
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        const result = await res.json()
        if (result.success) {
          setData(result.data)
        } else {
          setError("Failed to fetch report")
        }
      } catch (err) {
        console.error(err)
        setError("Server error")
      }
    }
    fetchReport()
  }, [selectedMonth])
  const downloadCSV = () => {
    if (!data) return
    const rows = [
      ["Metric", "Value"],
      ["Report Type", selectedMonth === "All" ? "Yearly" : "Monthly"],
      ["Month", selectedMonth],
      ["Total Collection", data.total_collection],
      ["Pending Amount", data.pending_amount],
      ["Cash Payments", data.cash_payments],
      ["UPI Payments", data.upi_payments]
    ]
    const csv = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "financial_report.csv"
    link.click()
  }
  const downloadPDF = () => {
    if (!data) return
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("Society Financial Report", 20, 20)
    doc.setFontSize(12)
    doc.text(`Report Type: ${selectedMonth === "All" ? "Yearly" : "Monthly"}`, 20, 30)
    doc.text(`Month: ${selectedMonth}`, 20, 40)
    doc.text(`Total Collection: Rs ${data.total_collection}`, 20, 60)
    doc.text(`Pending Amount: Rs ${data.pending_amount}`, 20, 70)
    doc.text(`Cash Payments: ${data.cash_payments}`, 20, 80)
    doc.text(`UPI Payments: ${data.upi_payments}`, 20, 90)
    doc.save("financial_report.pdf")
  }
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Financial Reports</h1>
          <p className="text-slate-500 mt-1">{selectedMonth === "All" ? "Yearly financial report" : `Financial report for ${selectedMonth}`}</p>
        </div>
        <div className="mb-6">
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg">
            {MONTHS.map(m => (<option key={m} value={m}>{m}</option>))}
          </select>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {!error && data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="p-6 rounded-xl bg-emerald-600 text-white">
              <p>Total Collection</p>
              <p className="text-2xl font-bold">Rs.{data.total_collection}</p>
            </div>
            <div className="p-6 rounded-xl bg-rose-600 text-white">
              <p>Pending Amount</p>
              <p className="text-2xl font-bold">Rs.{data.pending_amount}</p>
            </div>
            <div className="p-6 rounded-xl bg-teal-600 text-white">
              <p>Paid Flats</p>
              <p className="text-2xl font-bold">{data.paid_flats}</p>
            </div>
            <div className="p-6 rounded-xl bg-violet-600 text-white">
              <p>Pending Flats</p>
              <p className="text-2xl font-bold">{data.pending_flats}</p>
            </div>
          </div>
        )}
        <div className="flex gap-4">
          <button onClick={downloadCSV} className="px-5 py-2.5 bg-teal-600 text-white rounded-lg" >Download CSV</button>
          <button onClick={downloadPDF} className="px-5 py-2.5 bg-rose-600 text-white rounded-lg">Download PDF</button>
        </div>
      </div>
    </div>
  )
}
















