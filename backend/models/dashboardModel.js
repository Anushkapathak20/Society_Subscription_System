const pool = require("../config/db")

const getTotalFlats = async () => {
  const result = await pool.query(`
    SELECT COUNT(*) as total_flats
    FROM flats
  `)
  return result.rows[0]
}

const getTotalCollection = async () => {
  const result = await pool.query(`
    SELECT COALESCE(SUM(amount), 0) as total_collected
    FROM payments
  `)
  return result.rows[0]
}

const getPendingPayments = async () => {
  const result = await pool.query(`
    SELECT COALESCE(SUM(amount), 0) as pending_payments
    FROM monthly_records
    WHERE status != 'Paid'
  `)
  return result.rows[0]
}

const getMonthlyCollection = async () => {
  const result = await pool.query(`
    SELECT
      TO_CHAR(month, 'YYYY-MM') as month,
      COALESCE(SUM(p.amount), 0) as collected
    FROM monthly_records mr
    LEFT JOIN payments p ON mr.id = p.record_id
    GROUP BY TO_CHAR(month, 'YYYY-MM')
    ORDER BY month DESC
    LIMIT 12
  `)
  return result.rows
}

module.exports = {
  getTotalFlats,
  getTotalCollection,
  getPendingPayments,
  getMonthlyCollection
}