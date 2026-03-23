"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
export default function PaymentEntry() {
const router = useRouter()
const [flat_number, setFlat_number] = useState("")
const [billing_month, setBilling_month] = useState("")
const [amount, setAmount] = useState("")
const [payment_mode, setPayment_mode] = useState("Cash")
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL
const addPayment = async (e) => {
e.preventDefault()
const token = localStorage.getItem("token")
if (!flat_number || !billing_month || !amount) {
  alert("Please fill all required fields")
  return
} try {
  const res = await fetch(`${BACKEND}/api/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      flat_number,
      billing_month,
      amount,
      payment_mode
    })
  })
  const data = await res.json()
  if (data.success) {
    alert("Payment recorded successfully")
    setFlat_number("")
    setBilling_month("")
    setAmount("")
    router.push("/admin/monthly-records")
  } else {
    alert(data.error)
  }
} catch (err) {
  console.error(err)
  alert("Something went wrong")
}
}
const inputClass = "px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
return ( 
<div className="flex min-h-screen"> 
  <Sidebar />
  <div className="flex-1 p-4 md:p-6 w-full pt-16 lg:pt-4">
    <div className="mb-6 md:mb-8">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Manual Payment Entry</h1>
      <p className="text-sm md:text-base text-slate-500 mt-1">Record payments manually</p>
    </div>
    <form onSubmit={addPayment} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-4">Add Payment</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <input type="text" placeholder="Flat Number" value={flat_number} onChange={(e) => setFlat_number(e.target.value)} className={inputClass}/>
        <select value={billing_month} onChange={(e) => setBilling_month(e.target.value)} className={inputClass}>
          <option value="">Select Month</option>
          <option value="2026-01-01">January</option>
          <option value="2026-02-01">February</option>
          <option value="2026-03-01">March</option>
          <option value="2026-04-01">April</option>
          <option value="2026-05-01">May</option>
          <option value="2026-06-01">June</option>
          <option value="2026-07-01">July</option>
          <option value="2026-08-01">August</option>
          <option value="2026-09-01">September</option>
          <option value="2026-10-01">October</option>
          <option value="2026-11-01">November</option>
          <option value="2026-12-01">December</option>
        </select>
        <input type="number" placeholder="Amount Paid" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass}/>
        <select value={payment_mode} onChange={(e) => setPayment_mode(e.target.value)} className={inputClass}>
          <option>Cash</option>
          <option>UPI</option>
        </select>
      </div>
      <button type="submit" className="mt-5 px-6 py-2.5 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors">Record Payment</button>
    </form>
  </div>
</div>
)}















