"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import UserLayout from "../layout-user"
export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [phone_number, setPhone_number] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    fetch(`${BACKEND}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          localStorage.removeItem("token")
          localStorage.removeItem("residentUser")
          router.push("/login")
          return
        }
        setUser(data.user)
        setPhone_number(data.user.phone || "")
      }).catch((err) => {
        console.error("Failed to load profile:", err)
        localStorage.removeItem("token")
        localStorage.removeItem("residentUser")
        router.push("/login")
      })
  }, [router])
  const updateProfile = async (e) => {
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
        name: user?.name,
        phone: phone_number,
        email: user?.email
      })
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.message || "Failed to update profile")
      return
    }
    setUser(data.user)
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
        currentPassword,
        newPassword
      })
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.message || "Failed to change password")
      return
    }
    alert("Password changed successfully")
    setCurrentPassword("")
    setNewPassword("")
  }
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("residentUser")
    localStorage.removeItem("userRole")
    router.push("/login")
  }
  const inputClass = "px-3 md:px-4 py-2 md:py-2.5 text-sm md:text-base bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
  return (
    <UserLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-teal-600 flex items-center justify-center text-white text-xl md:text-2xl font-semibold flex-shrink-0">{user?.name?.charAt(0) ?? "U"}</div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">{user?.name || "User"}</h1>
                <p className="text-sm md:text-base text-slate-500 break-words">{user?.email}</p>
                <span className="inline-block mt-1 md:mt-2 px-3 py-1 text-xs font-medium bg-teal-100 text-teal-700 rounded-full">{user?.role}</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-3 md:mb-4">Profile Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
            <div>
              <p className="text-xs md:text-sm text-slate-500">Full Name</p>
              <p className="text-sm md:text-base font-medium text-slate-900 break-words">{user?.name}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-slate-500">Email</p>
              <p className="text-sm md:text-base font-medium text-slate-900 break-words">{user?.email}</p>
            </div>
          </div>
          <form onSubmit={updateProfile} className="flex flex-col sm:flex-row flex-wrap gap-3">
            <input type="text" value={phone_number} onChange={(e) => setPhone_number(e.target.value)} placeholder="Phone Number" className={`${inputClass} flex-1 min-w-[200px]`}/>
            <button type="submit" className="px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition w-full sm:w-auto">
              Update Phone
            </button>
          </form>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 mb-6 md:mb-8">
          <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-3 md:mb-4">Change Password</h2>
          <form onSubmit={changePassword}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass}/>
              <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass}/>
            </div>
            <button type="submit" className="mt-3 md:mt-4 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition w-full sm:w-auto">
              Update Password
            </button>
          </form>
        </div>
        <div className="flex justify-center sm:justify-end">
          <button onClick={logout} className="px-5 md:px-6 py-2 md:py-2.5 text-xs md:text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition w-full sm:w-auto">
            Logout
          </button>
        </div>
      </div>
    </UserLayout>
  )}