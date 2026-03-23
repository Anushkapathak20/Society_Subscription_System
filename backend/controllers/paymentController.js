const { createPaymentModel } = require("../models/paymentModel")
const createPayment = async (req, res) => {
  try {
    const { flat_number, billing_month, amount, payment_mode } = req.body
    if (!flat_number || !amount) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      })
    }
    const data = await createPaymentModel({
      flat_number,
      billing_month,
      amount,
      payment_mode
    })
    res.json({
      success: true,
      data
    })
  } catch (err) {
    console.error("Create Payment Error:", err)
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}
module.exports = {
  createPayment
}









// const pool = require("../config/db")
// const createPayment = async (req, res) => {
//   const client = await pool.connect()
//   try {
//     const { flat_number, billing_month, amount, payment_mode } = req.body
//     if (!flat_number || !amount) {
//       return res.status(400).json({
//         success: false,
//         error: "Missing required fields"
//       })
//     }
//     await client.query("BEGIN")
//     const flat = await client.query(
//       `SELECT id FROM flats WHERE flat_number = $1`,
//       [flat_number])
//     if (flat.rows.length === 0) {
//       await client.query("ROLLBACK")
//       return res.status(404).json({
//         success: false,
//         error: "Flat not found"
//       })
//     }
//     const flat_id = flat.rows[0].id
//     let targetMonth = billing_month
//     if (!targetMonth) {
//       const now = new Date()
//       const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
//       targetMonth = firstOfMonth.toISOString().slice(0, 10)
//     }
//     const record = await client.query(
//       `SELECT id, status
//        FROM monthly_records
//        WHERE flat_id = $1
//          AND DATE_TRUNC('month', month) = DATE_TRUNC('month', $2::date)
//        FOR UPDATE`,
//       [flat_id, targetMonth]
//     )
//     let record_id
//     if (record.rows.length === 0) {
//       const newRecord = await client.query(
//         `INSERT INTO monthly_records (flat_id, month, amount, status)
//          VALUES ($1, $2::date, $3, 'Pending')
//          RETURNING id`,
//         [flat_id, targetMonth, amount]
//       )
//       record_id = newRecord.rows[0].id
//     } else {
//       record_id = record.rows[0].id
//       if (record.rows[0].status === "Paid") {
//         await client.query("ROLLBACK")
//         return res.status(400).json({
//           success: false,
//           error: "Payment already recorded for this month"
//         })
//       }
//     }
//     // Double check payments table
//     const existingPayment = await client.query(
//       `SELECT id FROM payments WHERE record_id = $1`,
//       [record_id]
//     )
//     if (existingPayment.rows.length > 0) {
//       await client.query("ROLLBACK")
//       return res.status(400).json({
//         success: false,
//         error: "Payment record already exists"
//       })
//     }

//     // Insert payment
// const txnId =
//   payment_mode === "Cash" ? null : "TXN" + Date.now();

// const payment = await client.query(
//   `INSERT INTO payments
//   (record_id, amount, payment_mode, transaction_id, payment_date)
//   VALUES ($1,$2,$3,$4,$5::date)
//   RETURNING *`,
//   [
//     record_id,
//     amount,
//     payment_mode,
//     txnId,
//     targetMonth
//   ]
// );
//     // Update monthly record status
//     await client.query(
//       `UPDATE monthly_records
//        SET status='Paid'
//        WHERE id=$1`,
//       [record_id]
//     )

//     await client.query("COMMIT")

//     //  Return joined result
//     const result = await client.query(
//       `
//       SELECT
//         p.id,
//         p.transaction_id,
//         p.amount,
//         p.payment_mode,
//         p.payment_date,
//         f.flat_number,
//         TO_CHAR(mr.month, 'YYYY-MM-DD') AS billing_month,
//         mr.status
//       FROM payments p
//       JOIN monthly_records mr ON p.record_id = mr.id
//       JOIN flats f ON mr.flat_id = f.id
//       WHERE p.id = $1
//       `,
//       [payment.rows[0].id]
//     )

//     res.json({
//       success: true,
//       data: result.rows[0]
//     })

//   } catch (err) {
//     await client.query("ROLLBACK")
//     res.status(500).json({
//       success: false,
//       error: err.message
//     })
//   } finally {
//     client.release()
//   }
// }



// module.exports = {
//  createPayment
// }