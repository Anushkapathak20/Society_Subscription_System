"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import UserLayout from "../layout-user"
import formatMonth from "@/utils/formatMonth.js"
export default function Subscriptions() {
  const [data, setData] = useState([])
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL
    fetch(`${BACKEND}/api/resident/subscriptions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => res.json())
      .then(res => {
        console.log("Subscriptions data:", res)
        if (res.success) {
          setData(res.data)
        }
      }).catch(err => console.error(err))
  }, [])
  return (
    <UserLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">Monthly Subscription History</h1>
          <p className="text-slate-500 mt-1">View your payment records </p></div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">Billing Month</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">Amount Paid</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">Payment Mode</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.map((sub, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm text-slate-700">{formatMonth(sub.billing_month)}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">Rs.{sub.amount_paid}</td>
                    <td className="px-6 py-4">
                      <span className={
                        sub.status === "Paid" ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"
                      }>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{sub.payment_mode || "--"}</td>
                    <td className="px-6 py-4">
                      {sub.status === "Paid" ? (
                        <Link  href={`/subscriptions/${sub.billing_month?.slice(0, 7) || ""}`} className="text-teal-600 hover:text-teal-700 font-medium">
                          View Receipt
                        </Link>
                      ) : (
                        <span className="text-slate-400">--</span>
                      )}
                    </td>
                  </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </UserLayout>
  )}



