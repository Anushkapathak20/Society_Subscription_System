"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { FaChartLine, FaBuilding, FaFileInvoiceDollar, FaCalendarAlt, FaMoneyCheckAlt, FaChartBar, FaBell, FaUser, FaBars, FaTimes} from "react-icons/fa"
const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: FaChartLine },
  { href: "/admin/flats", label: "Flats", icon: FaBuilding },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: FaFileInvoiceDollar },
  { href: "/admin/monthly-records", label: "Monthly Records", icon: FaCalendarAlt },
  { href: "/admin/payment-entry", label: "Payment Entry", icon: FaMoneyCheckAlt },
  { href: "/admin/reports", label: "Reports", icon: FaChartBar },
  { href: "/admin/notifications", label: "Notifications", icon: FaBell },
  { href: "/admin/profile", label: "Profile", icon: FaUser },
]
export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg">
        {isOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
      </button>
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)}/>
      )}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 h-screen bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-lg font-semibold tracking-tight text-white">
            Admin Panel
          </h2>
          <p className="text-xs text-slate-400 mt-1">Society Management</p>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                      ${isActive
                        ? "bg-teal-600 text-white"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white"}`}>
                    <Icon className="w-4 h-4 shrink-0 opacity-90" />
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>
    </>
  )
}