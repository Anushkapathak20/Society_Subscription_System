"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
export default function UserAuth() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch(`${BACKEND}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })
    const data = await res.json()
    if (res.ok) {
      if (data.user.role !== "resident") {
        alert("This portal is only for residents")
        return
      }
      localStorage.setItem("token", data.token)
      localStorage.setItem("userRole", data.user.role)
      localStorage.setItem("residentUser", JSON.stringify(data.user))
      router.push("/dashboard")
    } else {
      alert(data.message)
    }
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900">Resident Login</h2>
          <p className="text-slate-500 mt-2 text-xs md:text-sm">Sign in to your resident portal</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <input type="email" placeholder="Email" className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-slate-200 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          <input type="password" placeholder="Password" className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-slate-200 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          <button type="submit" className="w-full py-2.5 md:py-3 text-sm md:text-base bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700">Sign In</button>
        </form>
        <p className="text-center mt-4 md:mt-6 text-xs md:text-sm text-slate-500">Contact administrator if you don't have an account</p>
      </div>
    </div>
  )}