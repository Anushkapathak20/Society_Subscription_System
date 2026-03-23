"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
export default function AdminAuth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const searchParams = useSearchParams();
  useEffect(() => {
    const urlToken = searchParams.get("token");
    const errorParam = searchParams.get("error");
    if (errorParam) {
      alert(errorParam);
      const newUrl = `${window.location.pathname}`;
      window.history.replaceState({}, "", newUrl);
    } if (urlToken) {
      localStorage.setItem("token", urlToken);
      router.push("/admin/dashboard");
    }
  }, [searchParams, router]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${BACKEND}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      if (data.user.role !== "admin") {
        alert("Only admin can access admin dashboard");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);
      router.push("/admin/dashboard")
    } else {
      alert(data.message);
    }};
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900">Admin Login</h2>
          <p className="text-slate-500 mt-2 text-xs md:text-sm">Sign in to manage your society</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <input type="email" placeholder="Email" className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-slate-200 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" className="w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base border border-slate-200 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full py-2.5 md:py-3 text-sm md:text-base bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700">Sign In</button>
        </form>
        <div className="flex items-center gap-3 my-4 md:my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs md:text-sm text-slate-400">or</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <button className="w-full py-2.5 md:py-3 text-sm md:text-base bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700"
          onClick={() => (window.location.href = `${BACKEND}/api/auth/google`)}>
          Continue with Google
        </button>
      </div>
    </div>
  )
}

