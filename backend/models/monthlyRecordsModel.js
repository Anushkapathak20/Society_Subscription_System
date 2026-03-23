const pool = require("../config/db")
const getAllRecords = async () => {
  const result = await pool.query(`
    SELECT
      mr.id AS record_id,
      f.id AS flat_id,
      f.flat_number,
      u.name AS full_name,
      mr.amount AS amount_due,
      mr.status,
      mr.month AS billing_month
    FROM monthly_records mr
    JOIN flats f ON mr.flat_id = f.id
    LEFT JOIN users u ON f.user_id = u.id
    ORDER BY mr.month DESC, f.flat_number ASC`)
  return result.rows
}
const getPaginatedMonthlyData = async (monthDate, limit, offset, statusFilter = null) => {
  const result = await pool.query(`
    SELECT
      mr.id AS record_id,
      f.id AS flat_id,
      f.flat_number,
      u.name AS full_name,
      COALESCE(mr.amount, sp.monthly_amount, 0) AS amount_due,
      COALESCE(mr.status, 'Pending') AS status,
      $1::date AS billing_month
    FROM flats f
    LEFT JOIN users u ON f.user_id = u.id
    LEFT JOIN subscription_plans sp ON f.flat_type = sp.flat_type
    LEFT JOIN monthly_records mr ON f.id = mr.flat_id AND DATE_TRUNC('month', mr.month) = DATE_TRUNC('month', $1::date)
    WHERE DATE_TRUNC('month', f.created_at) <= DATE_TRUNC('month', $1::date)
      AND ($4::text IS NULL OR COALESCE(mr.status, 'Pending') = $4)
    ORDER BY f.flat_number ASC
    LIMIT $2 OFFSET $3`, [monthDate, limit, offset, statusFilter])
  return result.rows
}
const getMonthlyRecordsCount = async (monthDate, statusFilter = null) => {
  const result = await pool.query(`
    SELECT COUNT(*) 
    FROM flats f
    LEFT JOIN monthly_records mr ON f.id = mr.flat_id AND DATE_TRUNC('month', mr.month) = DATE_TRUNC('month', $1::date)
    WHERE DATE_TRUNC('month', f.created_at) <= DATE_TRUNC('month', $1::date)
      AND ($2::text IS NULL OR COALESCE(mr.status, 'Pending') = $2)`, [monthDate, statusFilter])
  return parseInt(result.rows[0].count)
}

const getMonthlySummary = async (monthDate) => {
  const result = await pool.query(`
    SELECT
      COUNT(*) FILTER (WHERE COALESCE(mr.status, 'Pending') = 'Paid') AS paid_count,
      COUNT(*) FILTER (WHERE COALESCE(mr.status, 'Pending') = 'Pending') AS pending_count,
      SUM(CASE WHEN COALESCE(mr.status, 'Pending') = 'Pending' THEN COALESCE(mr.amount, sp.monthly_amount, 0) ELSE 0 END) AS total_pending
    FROM flats f
    LEFT JOIN subscription_plans sp ON f.flat_type = sp.flat_type
    LEFT JOIN monthly_records mr ON f.id = mr.flat_id AND DATE_TRUNC('month', mr.month) = DATE_TRUNC('month', $1::date)
    WHERE DATE_TRUNC('month', f.created_at) <= DATE_TRUNC('month', $1::date)`, [monthDate])
  return result.rows[0]
}
const getRecordForUpdate = async (client, id) => {
  const result = await client.query(`
SELECT id, amount, status
FROM monthly_records
WHERE id = $1
FOR UPDATE`, [id] )
  return result.rows[0]
}
const insertPayment = async (client, record_id, amount, payment_mode, transaction_id) => {
await client.query(
`INSERT INTO payments (record_id, amount, payment_mode, transaction_id)
 VALUES ($1,$2,$3,$4)`,
[record_id, amount, payment_mode, transaction_id]
)}
const updateRecordStatus = async (client, id) => {
await client.query(`
UPDATE monthly_records
SET status='Paid'
WHERE id=$1`, [id]
)}
const getFlatByNumber = async (client, flat_number) => {
const result = await client.query(`
SELECT f.id, COALESCE(sp.monthly_amount,0) AS amount
FROM flats f
LEFT JOIN subscription_plans sp ON f.flat_type = sp.flat_type
WHERE f.flat_number=$1`,[flat_number])
return result.rows[0]
}
const getMonthlyRecord = async (client, flat_id, monthDate) => {
const result = await client.query(`
SELECT id,status
FROM monthly_records
WHERE flat_id=$1
AND DATE_TRUNC('month',month)=DATE_TRUNC('month',$2::date)`, [flat_id,monthDate])
return result.rows[0]
}
const createMonthlyRecord = async (client, flat_id, monthDate, amount) => {
  const result = await client.query(
    `INSERT INTO monthly_records(flat_id,month,amount,status)
    VALUES($1,$2::date,$3,'Pending')
    RETURNING id`, [flat_id, monthDate, amount]
  )
  return result.rows[0].id
}
module.exports = {
  getAllRecords,
  getPaginatedMonthlyData,
  getMonthlyRecordsCount,
  getMonthlySummary,
  getRecordForUpdate,
  insertPayment,
  updateRecordStatus,
  getFlatByNumber,
  getMonthlyRecord,
  createMonthlyRecord
}