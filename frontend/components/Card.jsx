export default function Card({ title, value, color }) {
  return (
    <div
      className={`p-4 md:p-6 rounded-xl shadow-sm text-white ${color} transition-shadow hover:shadow-md`}>
      <h2 className="text-xs md:text-sm font-medium opacity-90 tracking-wide">
        {title}
      </h2>
      <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 tracking-tight break-words">
        {value}
      </p>
    </div>
  )
}