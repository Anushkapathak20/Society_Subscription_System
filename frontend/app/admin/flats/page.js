"use client"
import { useEffect, useState } from "react"
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa"
import Sidebar from "@/components/Sidebar"
export default function Flats() {
  const [flats, setFlats] = useState([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(8)
  const [showModal, setShowModal] = useState(false)
  const [editingFlat, setEditingFlat] = useState(null)
  const [form, setForm] = useState({
    flat_number: "",
    owner_name: "",
    email: "",
    phone_number: "",
    flat_type: "",
  })
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^[0-9]{10}$/
    const allowedHosts = ["gmail", "yahoo", "tothenew", "outlook", "hotmail"]
    if (!form.owner_name.trim()) {
      alert("Owner name is required")
      return false
    }
    if (!emailRegex.test(form.email)) {
      alert("Enter valid email")
      return false
    }
    const host = form.email.split("@")[1].split(".")[0]
    if (!allowedHosts.includes(host.toLowerCase())) {
      alert("Allowed email providers: gmail, yahoo, tothenew, outlook, hotmail")
      return false
    }
    if (!phoneRegex.test(form.phone_number)) {
      alert("Phone must be exactly 10 digits")
      return false
    }
    if (!form.flat_number) {
      alert("Flat number required")
      return false
    }
    return true
  }
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL
  const fetchFlats = async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    const res = await fetch(
      `${BACKEND}/api/flats?page=${currentPage}&limit=${limit}&search=${search}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      })
    const data = await res.json()
    if (data.success) {
      setFlats(data.data)
      setTotalPages(data.meta.totalPages)
    }
  }
  const deleteFlat = async (id) => {
    const token = localStorage.getItem("token")
    await fetch(`${BACKEND}/api/flats/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    fetchFlats()
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    let url = `${BACKEND}/api/flats`
    let method = "POST"
    if (editingFlat) {
      url = `${BACKEND}/api/flats/${editingFlat.flat_id}`
      method = "PUT"
    }
    const token = localStorage.getItem("token")
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.success) {
      fetchFlats()
      setShowModal(false)
      setEditingFlat(null)
      setForm({
        flat_number: "",
        owner_name: "",
        email: "",
        phone_number: "",
        flat_type: "",
      })
    } else {
      alert(data.error || "An error occurred")
    }
  }
  useEffect(() => {
    setCurrentPage(1)
  }, [search])
  useEffect(() => {
    fetchFlats()
  }, [currentPage, search])
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Flats Management
          </h1>
          <p className="text-gray-500 text-sm">
            View and manage all flats
          </p>
        </div>
        <div className="flex gap-4 mb-5">
          <div className="flex items-center bg-white px-3 rounded-lg shadow-sm w-full">
            <FaSearch className="text-gray-400 mr-2" />
            <input type="text" placeholder="Search..." className="w-full py-2 outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={() => {
            setEditingFlat(null)
            setForm({
              flat_number: "",
              owner_name: "",
              email: "",
              phone_number: "",
              flat_type: "",
            })
            setShowModal(true)
          }}
            className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition">
            <FaPlus /> Add Flat
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-3 text-left">Flat</th>
                <th className="p-3 text-left">Owner</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {flats.map((f) => (
                <tr key={f.flat_id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-3 font-medium">{f.flat_number}</td>
                  <td className="py-4 px-3">{f.owner_name}</td>
                  <td className="py-4 px-3 text-gray-600">{f.email}</td>
                  <td className="py-4 px-3 text-gray-600">{f.phone_number}</td>
                  <td className="p-3">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs"> {f.flat_type} </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => {
                        setEditingFlat(f)
                        setForm(f)
                        setShowModal(true)
                      }}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded shadow-sm hover:shadow-md">
                        <FaEdit />
                      </button>
                      <button onClick={() => deleteFlat(f.flat_id)}
                        className="bg-red-100 text-red-700 px-3 py-1 rounded shadow-sm hover:shadow-md">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-5">
          <button disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="px-3 py-1 bg-white shadow-sm rounded disabled:opacity-50">
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="px-3 py-1 bg-white shadow-sm rounded disabled:opacity-50">
            Next
          </button>
        </div>
        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center"
            onClick={() => setShowModal(false)}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
              onClick={(e) => e.stopPropagation()}>
              <h2 className="text-lg font-semibold mb-4">
                {editingFlat ? "Edit Flat" : "Add Flat"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input placeholder="Flat Number" className="w-full p-2 bg-gray-50 rounded shadow-sm" value={form.flat_number} onChange={(e) => setForm({ ...form, flat_number: e.target.value })}
                  disabled={!!editingFlat}
                />
                <input placeholder="Owner Name" className="w-full p-2 bg-gray-50 rounded shadow-sm" value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })
                } />
                <input placeholder="Email" className="w-full p-2 bg-gray-50 rounded shadow-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })
                } />

                <input placeholder="Phone" maxLength="10" className="w-full p-2 bg-gray-50 rounded shadow-sm" value={form.phone_number} onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  setForm({ ...form, phone_number: value })
                }} />
                {editingFlat ? (
                  <input className="w-full p-2 bg-gray-100 rounded shadow-sm cursor-not-allowed" value={form.flat_type}
                    disabled />
                ) : (
                  <select className="w-full p-2 bg-gray-50 rounded shadow-sm" value={form.flat_type} onChange={(e) =>
                    setForm({ ...form, flat_type: e.target.value })
                  } >
                    <option value="">Select Flat Type</option>
                    <option value="1BHK">1 BHK</option>
                    <option value="2BHK">2 BHK</option>
                    <option value="3BHK">3 BHK</option>
                    <option value="4BHK">4 BHK</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                  <button type="submit" className="px-3 py-1 bg-teal-600 text-white rounded shadow-sm hover:shadow-md">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}