const pool = require("../config/db")
const bcrypt = require("bcrypt")
const getAllFlats = async () => {
  const result = await pool.query(`SELECT
      f.id AS flat_id,
      f.flat_number,
      f.flat_type,
      u.name AS owner_name,
      u.email,
      u.phone AS phone_number
    FROM flats f
    LEFT JOIN users u
    ON f.user_id = u.id
    ORDER BY f.flat_number`)
  return result.rows
}
const getPaginatedFlats = async (limit, offset, search = "") => {
  const query = `SELECT
      f.id AS flat_id,
      f.flat_number,
      f.flat_type,
      u.name AS owner_name,
      u.email,
      u.phone AS phone_number
    FROM flats f
    LEFT JOIN users u
    ON f.user_id = u.id
    WHERE u.name ILIKE $3 OR f.flat_number::text ILIKE $3
    ORDER BY f.flat_number
    LIMIT $1 OFFSET $2`
  const result = await pool.query(query, [limit, offset, `%${search}%`])
  return result.rows
}
const getFlatsCount = async (search = "") => {
  const query = `SELECT COUNT(*) 
    FROM flats f
    LEFT JOIN users u ON f.user_id = u.id
    WHERE u.name ILIKE $1 OR f.flat_number::text ILIKE $1`
  const result = await pool.query(query, [`%${search}%`])
  return parseInt(result.rows[0].count)
}
const createUser = async (client, owner_name, email, phone_number) => {
  const DEFAULT_PASSWORD = "resident123"
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 10)
  const user = await client.query(`
    INSERT INTO users (name,email,phone,password_hash,role)
    VALUES ($1,$2,$3,$4,'resident')
    RETURNING id`,
    [owner_name, email, phone_number, hashedPassword]
  )
  return user.rows[0].id
}
const createFlat = async (client, flat_number, flat_type, userId) => {
  const flatResult = await client.query(
    `INSERT INTO flats (flat_number,flat_type,user_id)
     VALUES ($1,$2,$3)
     RETURNING *
    `,
    [flat_number, flat_type, userId])

  const flat = flatResult.rows[0]
  
  const subRes = await client.query(
    ` SELECT monthly_amount
      FROM subscription_plans
      WHERE flat_type = $1
      LIMIT 1 `, [flat_type]
  )
  const monthlyAmount = subRes.rows.length > 0 ? subRes.rows[0].monthly_amount : 0
  await client.query(
    `INSERT INTO monthly_records (flat_id,month,amount,status)
    VALUES ($1,date_trunc('month',CURRENT_DATE),$2,'Pending')`,
    [flat.id, monthlyAmount]
  )
  return flat
}
const getFlatUser = async (client, flat_id) => {
  const flat = await client.query(
    `SELECT user_id FROM flats WHERE id=$1`,
    [flat_id]
  )
  return flat.rows[0]?.user_id
}
const updateUser = async (client, owner_name, email, phone_number, userId) => {
  await client.query(
    `UPDATE users
    SET name=$1,email=$2,phone=$3
    WHERE id=$4`,
    [owner_name, email, phone_number, userId])
}
const updateFlat = async (client, flat_number, flat_type, flat_id) => {
  const result = await client.query(
    `UPDATE flats
    SET flat_number=$1,flat_type=$2
    WHERE id=$3
    RETURNING *`,
    [flat_number, flat_type, flat_id])
  return result.rows[0]
}
const checkFlatNumberExists = async (client, flat_number, excludeFlatId = null) => {
  let query = `SELECT id FROM flats WHERE flat_number = $1`
  const params = [flat_number]

  if (excludeFlatId) {
    query += ` AND id != $2`
    params.push(excludeFlatId)
  }

  const result = await client.query(query, params)
  return result.rows.length > 0
}

const deleteFlat = async (client, flat_id) => {
  const flat = await client.query(
    `SELECT user_id FROM flats WHERE id=$1`,
    [flat_id])
  const userId = flat.rows[0]?.user_id
  await client.query(`DELETE FROM flats WHERE id=$1`, [flat_id])
  if (userId) {
    await client.query(
      `UPDATE users SET is_active=false WHERE id=$1`,
      [userId])
  }
}
module.exports = {
  getAllFlats,
  getPaginatedFlats,
  getFlatsCount,
  createUser,
  createFlat,
  getFlatUser,
  updateUser,
  updateFlat,
  deleteFlat,
  checkFlatNumberExists
}







