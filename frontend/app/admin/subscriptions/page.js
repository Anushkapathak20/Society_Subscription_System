"use client"
import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
export default function Subscriptions() {
  const [plans, setPlans] = useState([])
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL
  const api = (url, method = "GET", body) => {
    const token = localStorage.getItem("token")
    return fetch(url, {
      method,
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: body ? JSON.stringify(body) : undefined
    }).then(res => res.json())
  }
  const fetchPlans = async () => {
    try {
      const { success, data } = await api(`${BACKEND}/api/subscriptions`)
      if (success) {
        setPlans(
          data.map(p => ({
            plan_id: p.id,
            flat_type: p.flat_type,
            monthly_rate: p.monthly_amount
          }))
        )}
    } catch (err) {
      console.error("Error fetching plans", err)}
  }
  useEffect(() => {
    fetchPlans()
  }, [])
  const handleChange = (id, value) => {
    setPlans(plans.map(p =>
      p.plan_id === id ? { ...p, monthly_rate: Number(value) } : p
    ))}
  const handleUpdate = async (plan) => {
    try {
      const data = await api(
        `${BACKEND}/api/subscriptions/${plan.plan_id}`,
        "PUT",
        {
          flat_type: plan.flat_type,
          monthly_amount: Number(plan.monthly_rate)
        })
      if (data.success) {
        alert(`${plan.flat_type} subscription updated to ₹${plan.monthly_rate}`)
        fetchPlans()
      } else {
        alert(data.message || "Failed to update subscription")
      }
    } catch (err) {
      console.error(err)
      alert("Error updating subscription")
    }
  }
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-0 w-full pt-16 lg:pt-4">
        <div>
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Subscription Plans</h1>
            <p className="text-sm md:text-base text-slate-500 mt-1">Manage flat-type monthly rates</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">Flat Type</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">Monthly Rate (Rs.)</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {plans.map((plan) => (
                    <tr key={plan.plan_id} className="hover:bg-slate-50/50 transition-colors" >
                     <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-slate-900 whitespace-nowrap">{plan.flat_type}</td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <input type="number" value={plan.monthly_rate} onChange={(e) => handleChange(plan.plan_id, e.target.value)}
                          className="w-24 md:w-32 px-2 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"/>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right whitespace-nowrap">
                        <button onClick={() => handleUpdate(plan)}
                          className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"  >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}






























