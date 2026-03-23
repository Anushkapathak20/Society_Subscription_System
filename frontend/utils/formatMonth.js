
export default function formatMonth(dateString) {
  if (!dateString) return ""

  const date = new Date(dateString)

  if (isNaN(date)) return dateString

  return date.toLocaleString("en-IN", {
    month: "long",
    year: "numeric"
  })
}