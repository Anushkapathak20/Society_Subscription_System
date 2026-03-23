const { getYearlyReportModel, getMonthlyReportModel } = require("../models/reportModel")
const getYearlyReport = async (req, res) => {
  try {
    const month = parseInt(req.query.month)
    const year = new Date().getFullYear()
    const data = await getYearlyReportModel(year, month)
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false })
  }
}
const getMonthlyReport = async (req, res) => {
  try {
    const month = parseInt(req.query.month)
    const year = new Date().getFullYear()
    const data = await getMonthlyReportModel(year, month)
    res.json({ success: true, data })
  } catch (err) {
    res.status(500).json({ success: false })
  }
}
module.exports = { getYearlyReport, getMonthlyReport }




















// const pool = require("../config/db")
// const getYearlyReport = async (req, res) => {
//   try {
//     const month = parseInt(req.query.month)
//     const year = new Date().getFullYear()
//     const result = await pool.query(`
//       SELECT
//         COALESCE(SUM(CASE WHEN mr.status='Paid' THEN mr.amount ELSE 0 END),0) AS total_collection,
//         COALESCE(SUM(CASE WHEN mr.status='Pending' THEN mr.amount ELSE 0 END),0) AS pending_amount,
//         COUNT(*) FILTER (WHERE mr.status='Paid') AS paid_flats,
//         COUNT(*) FILTER (WHERE mr.status='Pending') AS pending_flats,
//         COALESCE(COUNT(p.id) FILTER (WHERE p.payment_mode='Cash'),0) AS cash_payments,
//         COALESCE(COUNT(p.id) FILTER (WHERE p.payment_mode='UPI'),0) AS upi_payments
//       FROM monthly_records mr
//       LEFT JOIN payments p ON p.record_id = mr.id
//       WHERE EXTRACT(YEAR FROM mr.month) = $1
//       AND EXTRACT(MONTH FROM mr.month) <= $2
//     `,[year, month])
//     res.json({ success: true, data: result.rows[0] })
//   } catch (err) {
//     res.status(500).json({ success: false })
//   }
// }


// const getMonthlyReport = async (req, res) => {
//   try {
//     const month = parseInt(req.query.month)
//     const year = new Date().getFullYear()
//     const result = await pool.query(`
//       SELECT
//         COALESCE(SUM(CASE WHEN mr.status='Paid' THEN mr.amount ELSE 0 END),0) AS total_collection,
//         COALESCE(SUM(CASE WHEN mr.status='Pending' THEN mr.amount ELSE 0 END),0) AS pending_amount,
//         COUNT(DISTINCT mr.flat_id) FILTER (WHERE mr.status='Paid') AS paid_flats,
//         COUNT(DISTINCT mr.flat_id) FILTER (WHERE mr.status='Pending') AS pending_flats,
//         COALESCE(COUNT(p.id) FILTER (WHERE p.payment_mode='Cash'),0) AS cash_payments,
//         COALESCE(COUNT(p.id) FILTER (WHERE p.payment_mode='UPI'),0) AS upi_payments
//       FROM monthly_records mr
//       LEFT JOIN payments p ON p.record_id = mr.id
//       WHERE EXTRACT(MONTH FROM mr.month) = $1
//       AND EXTRACT(YEAR FROM mr.month) = $2
//     `, [month, year])
//     res.json({ success: true, data: result.rows[0] })
//   } catch (err) {
//     res.status(500).json({ success: false })
//   }
// }
// module.exports = { getYearlyReport, getMonthlyReport }