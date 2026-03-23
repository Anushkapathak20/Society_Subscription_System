"use client"
import { useEffect, useState } from "react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import formatMonth from "@/utils/formatMonth.js"
import UserLayout from "../layout-user"
export default function PayNow() {
  const [payment, setPayment] = useState(null)
  const [payment_mode, setPayment_mode] = useState("UPI")
  const [transaction_id, setTransaction_id] = useState("")
  const [paid, setPaid] = useState(false)
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return;
    fetch(`http://localhost:5000/api/resident/pending-payment`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json())
      .then(res => {
        if (res.success) {
          setPayment(res.data)
          console.log("Pending payment data:", res.data)
        }
      }).catch(err => console.error(err))
  }, [])
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("http://localhost:5000/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          flat_number: payment.flat_number,
          billing_month: payment.billing_month,
          amount: payment.amount,
          payment_mode
        })
      })
      const data = await res.json()
      if (data.success) {
        setTransaction_id(data.data.transaction_id)
        setPaid(true)
      }
    } catch (err) {
      console.error(err)
    }
  }
  const downloadReceipt = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text("Society Payment Receipt", 14, 20)
    const tableData = [
      ["Flat", payment.flat_number],
      ["Billing Month", formatMonth(payment.billing_month)],
      ["Amount Paid", `Rs.${payment.amount}`],
      ["Payment Mode", payment_mode],
      ["Transaction ID", transaction_id],
      ["Date", new Date().toLocaleDateString()],
    ]
    autoTable(doc, {
      startY: 30,
      head: [["Field", "Details"]],
      body: tableData,
      theme: "grid",
    })
    doc.save("receipt.pdf")
  }
  if (!payment) {
    return (
      <UserLayout>
        <div className="text-center py-8 md:py-12">
          <p className="text-sm md:text-base text-slate-500">No pending payments found.</p>
        </div>
      </UserLayout>
    )}
  return (
    <UserLayout>
      <div className="flex justify-center py-6 md:py-8">
        <div className="w-full max-w-md bg-white p-4 md:p-6 rounded-xl shadow-sm border">
          <h1 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Subscription Payment</h1>
          {!paid ? (
            <>
              <div className="space-y-2 mb-4">
                <p className="text-sm md:text-base"><b>Flat:</b> {payment.flat_number}</p>
                <p className="text-sm md:text-base"><b>Billing Month:</b> {formatMonth(payment.billing_month)}</p>
                <p className="text-sm md:text-base"><b>Amount Due:</b> ₹{payment.amount}</p>
              </div>
              <select value={payment_mode} onChange={(e) => setPayment_mode(e.target.value)} className="w-full mt-3 md:mt-4 border p-2 md:p-2.5 text-sm md:text-base rounded-lg">
                <option>UPI</option>
                <option>Net Banking</option>
              </select>
              <button onClick={handlePayment} className="w-full mt-4 md:mt-6 py-2.5 md:py-3 text-sm md:text-base bg-teal-600 text-white rounded-lg hover:bg-teal-700">Pay Now</button>
            </>
          ) : (
            <>
              <h2 className="text-base md:text-lg text-emerald-600 font-semibold mb-3 md:mb-4">Payment Successful</h2>
              <div className="space-y-2 mb-4">
                <p className="text-sm md:text-base"><b>Transaction ID:</b> {transaction_id}</p>
                <p className="text-sm md:text-base"><b>Amount:</b> Rs.{payment.amount}</p>
                <p className="text-sm md:text-base"><b>Payment Mode:</b> {payment_mode}</p>
              </div>
              <button onClick={downloadReceipt} className="w-full mt-4 md:mt-6 py-2.5 md:py-3 text-sm md:text-base bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                Download Receipt
              </button>
            </>
          )}
        </div>
      </div>
    </UserLayout>
  )}










