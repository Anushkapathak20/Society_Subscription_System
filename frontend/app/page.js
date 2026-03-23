import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <main className="w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Society Subscription System
        </h1>
        <p className="mt-4 text-slate-600">
          Manage your society subscriptions and payments in one place
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700"
          >
            Admin Portal
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Resident Portal
          </Link>
        </div>
      </main>
    </div>
  )
}
