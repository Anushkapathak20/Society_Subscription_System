const pool = require("../config/db")
const ResidentModel = {
  getSubscriptions: async (userId) => {
    const query = `
      SELECT
        TO_CHAR(mr.month, 'YYYY-MM-DD') AS billing_month,
        mr.amount AS amount_paid,
        mr.status,
        p.payment_mode
      FROM monthly_records mr
      JOIN flats f ON mr.flat_id = f.id
      JOIN users u ON f.user_id = u.id
      LEFT JOIN payments p ON mr.id = p.record_id
      WHERE u.id = $1
      ORDER BY mr.month DESC
    `
    const result = await pool.query(query, [userId])
    return result.rows
  },
  getReceipt: async (userId, month) => {
    const query = `
      SELECT
        p.transaction_id,
        COALESCE(p.amount, mr.amount) AS amount,
        p.payment_mode,
        p.payment_date,
        f.flat_number,
        TO_CHAR(mr.month, 'YYYY-MM-DD') AS billing_month,
        mr.amount AS amount_due,
        mr.status
      FROM monthly_records mr
      JOIN flats f ON mr.flat_id = f.id
      JOIN users u ON f.user_id = u.id
      LEFT JOIN payments p ON mr.id = p.record_id
      WHERE u.id = $1
        AND DATE_TRUNC('month', mr.month) = DATE_TRUNC('month', $2::date)
    `
    const result = await pool.query(query, [userId, month])
    return result.rows[0]
  },
  getPendingPayment: async (userId) => {
    const query = `
      SELECT
        f.flat_number,
        TO_CHAR(mr.month,'YYYY-MM-DD') AS billing_month,
        mr.amount
      FROM monthly_records mr
      JOIN flats f ON mr.flat_id = f.id
      JOIN users u ON f.user_id = u.id
      WHERE u.id = $1
      AND mr.status = 'Pending'
      AND mr.month >= DATE_TRUNC('month', f.created_at)
      ORDER BY mr.month ASC
      LIMIT 1
    `
    const result = await pool.query(query, [userId])
    return result.rows[0]
  },
  getUserFlatInfo: async (userId) => {
    const query = `
      SELECT u.id AS user_id, f.id AS flat_id, f.flat_number, u.created_at
      FROM users u
      JOIN flats f ON f.user_id = u.id
      WHERE u.id = $1
    `
    const result = await pool.query(query, [userId])
    return result.rows[0]
  },
  getLatestRecordSummary: async (flatId) => {
    const query = `
      SELECT
        f.flat_number,
        mr.month AS billing_month,
        CASE 
          WHEN mr.status = 'Paid' THEN 0
          ELSE mr.amount
        END AS amount_due,
        mr.status
      FROM monthly_records mr
      JOIN flats f ON mr.flat_id = f.id
      WHERE f.id = $1
      ORDER BY mr.month DESC
      LIMIT 1
    `
    const result = await pool.query(query, [flatId])
    return result.rows[0]
  },
  getDashboardPaymentHistory: async (flatId) => {
    const query = `
      SELECT
        mr.month AS billing_month,
        p.amount AS amount_paid,
        mr.status
      FROM monthly_records mr
      LEFT JOIN payments p ON p.record_id = mr.id
      WHERE mr.flat_id = $1
      ORDER BY mr.month DESC
    `
    const result = await pool.query(query, [flatId])
    return result.rows
  }
}

module.exports = ResidentModel
