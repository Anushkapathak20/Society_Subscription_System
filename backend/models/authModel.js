const pool = require("../config/db")

const findUserByEmail = async (email) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email]
  )
  return result.rows
}

const insertUser = async (name, email, hashedPassword, phone, role) => {
  const result = await pool.query(
    `INSERT INTO users
     (name,email,password_hash,phone,role)
     VALUES ($1,$2,$3,$4,$5)
     RETURNING id,name,email,role`,
    [name, email, hashedPassword, phone, role]
  )
  return result.rows[0]
}

const updatePasswordByEmail = async (email, hashedPassword) => {
  await pool.query(
    `UPDATE users SET password_hash=$1 WHERE email=$2`,
    [hashedPassword, email]
  )
}

const findUserById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM users WHERE id=$1",
    [id]
  )
  return result.rows
}

const getFullUserById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE id=$1",
    [id]
  )
  return result.rows
}

const checkEmailExistsForOtherUser = async (email, userId) => {
  const result = await pool.query(
    "SELECT id FROM users WHERE email=$1 AND id <> $2",
    [email, userId]
  )
  return result.rows
}

const updateUserProfile = async (name, phone, email, userId) => {
  const result = await pool.query(
    `UPDATE users
     SET name=$1, phone=$2, email=$3
     WHERE id=$4
     RETURNING id, name, email, phone, role`,
    [name, phone, email, userId]
  )
  return result.rows[0]
}

const getPasswordHash = async (userId) => {
  const result = await pool.query(
    "SELECT password_hash FROM users WHERE id=$1",
    [userId]
  )
  return result.rows
}

const updatePassword = async (userId, hashedPassword) => {
  await pool.query(
    "UPDATE users SET password_hash=$1 WHERE id=$2",
    [hashedPassword, userId]
  )
}

module.exports = {
  findUserByEmail,
  insertUser,
  updatePasswordByEmail,
  findUserById,
  getFullUserById,
  checkEmailExistsForOtherUser,
  updateUserProfile,
  getPasswordHash,
  updatePassword
}