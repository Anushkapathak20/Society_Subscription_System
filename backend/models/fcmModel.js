const pool = require("../config/db")

const registerTokenModel = async (userId, token) => {
  const result = await pool.query(
    `INSERT INTO fcm_tokens (user_id, token)
     VALUES ($1, $2)
     ON CONFLICT (user_id, token) DO NOTHING`,
    [userId, token]
  )
  return result
}

const unregisterTokenModel = async (userId, token) => {
  const result = await pool.query(
    `DELETE FROM fcm_tokens 
     WHERE user_id = $1 AND token = $2`,
    [userId, token]
  )
  return result
}

module.exports = {
  registerTokenModel,
  unregisterTokenModel
}