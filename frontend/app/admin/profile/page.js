"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/Sidebar"
export default function AdminProfile() {
  const router = useRouter()
  const [full_name, setFull_name] = useState("")
  const [email, setEmail] = useState("")
  const [phone_number, setPhone_number] = useState("")
  const [password, setPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    fetch(`${BACKEND}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          localStorage.removeItem("token")
          router.push("/admin/login")
          return
        }
        setFull_name(data.user.name || "")
        setEmail(data.user.email || "")
        setPhone_number(data.user.phone || "")
      }).catch((err) => {
        console.error("Failed to load profile:", err)
        localStorage.removeItem("token")
        router.push("/admin")
      })
  }, [router])
const saveProfile = async (e) => {
  e.preventDefault()
  const token = localStorage.getItem("token")
  if (!token) return
  const res = await fetch(`${BACKEND}/api/auth/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      name: full_name,
      phone: phone_number,
      email
    })
  })
  const data = await res.json()
  if (!res.ok) {
    alert(data.message || "Failed to update profile")
    return
  }
  alert("Profile updated successfully")
}
const changePassword = async (e) => {
  e.preventDefault()
  const token = localStorage.getItem("token")
  if (!token) return
  const res = await fetch(`${BACKEND}/api/auth/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      currentPassword: password,
      newPassword
    })
  })
  const data = await res.json()
  if (!res.ok) {
    alert(data.message || "Failed to change password")
    return
  }
  alert("Password changed successfully")
  setPassword("")
  setNewPassword("")
}
const logout = () => {
  localStorage.removeItem("token")
  router.push("/admin/login")
}
const inputClass =
"px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
return ( 
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 p-4 md:p-6 lg:ml-0 w-full pt-16 lg:pt-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl md:text-2xl font-semibold flex-shrink-0">{full_name.charAt(0)}</div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">{full_name}</h1>
              <p className="text-sm md:text-base text-slate-500 break-words">{email}</p>
              <span className="inline-block mt-1 md:mt-2 px-3 py-1 text-xs font-medium bg-teal-100 text-teal-700 rounded-full">Admin</span>
            </div>
          </div>
        </div>
        <form onSubmit={saveProfile} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-3 md:mb-4">Update Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <input type="text" value={full_name} onChange={(e) => setFull_name(e.target.value)} placeholder="Full Name" className={inputClass}/>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className={inputClass}/>
            <input type="text" value={phone_number} onChange={(e) => setPhone_number(e.target.value)} placeholder="Phone Number" className={inputClass}/>
          </div>
          <button type="submit" className="mt-3 md:mt-4 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition w-full sm:w-auto">
            Save Changes
          </button>
        </form>
        <form onSubmit={changePassword} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-3 md:mb-4">Change Password</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <input type="password" placeholder="Current Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass}/>
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass}/>
          </div>
          <button type="submit"
            className="mt-3 md:mt-4 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition w-full sm:w-auto">
            Update Password
          </button>
        </form>
        <div className="flex justify-center sm:justify-end mt-6 md:mt-8">
          <button onClick={logout}
            className="px-5 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition w-full sm:w-auto">Logout</button>
        </div>
      </div>
    </div>
  </div>
)}
