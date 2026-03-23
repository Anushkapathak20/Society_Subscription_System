"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Card from "@/components/Card"
import Chart from "@/components/Chart"
import Sidebar from "@/components/Sidebar"
export default function Dashboard() {
  const router = useRouter()
  const [data, setData] = useState({
    totalFlats: 0,
    totalCollected: 0,
    pendingPayments: 0,
    monthlyCollection: []
  })
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    fetch(`${BACKEND}/api/admin/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (res.status === 401) {
          localStorage.removeItem("token")
          router.push("/admin/login")
        }
        return res.json()
      })
      .then(res => {
        console.log("Admin Dashboard API:", res)
        setData({
          totalFlats: res.totalFlats || 0,
          totalCollected: res.totalCollection || 0,
          pendingPayments: res.pendingPayments || 0,
          monthlyCollection: res.monthlyCollection || []
        })
      })
      .catch(err => {
        console.error("Dashboard error:", err)
      })
  }, [])
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:ml-0 w-full pt-16 lg:pt-4">
        <div className="w-full h-full">
          <div className="mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              Society Admin Dashboard
            </h1>
            <p className="text-sm md:text-base text-slate-500 mt-1">
              Overview of your society management
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-10">
            <Card title="Total Flats" value={data.totalFlats} color="bg-teal-600"/>
            <Card title="Total Collection" value={`Rs. ${data.totalCollected}`} color="bg-emerald-600"/>
            <Card title="Pending Payments" value={data.pendingPayments} color="bg-rose-600"/>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 w-full">
            <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-4">
              Monthly Subscription Collection
            </h2>
            <div className="w-full overflow-x-auto">
              <Chart data={data.monthlyCollection} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )}