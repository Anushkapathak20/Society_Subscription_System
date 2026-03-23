const pool = require("../config/db")
const NotificationModel = {
  getUserNotifications: async (userId, userCreatedAt, limit, offset) => {
    const dataQuery = `SELECT n.*,
        CASE 
          WHEN nr.id IS NOT NULL THEN TRUE
          ELSE FALSE
        END AS is_read
      FROM notifications n
      LEFT JOIN notification_reads nr
        ON n.id = nr.notification_id AND nr.user_id = $1
      WHERE (n.recipient_id IS NULL AND n.created_at > $2)
         OR n.recipient_id = $1
      ORDER BY n.created_at DESC
      LIMIT $3 OFFSET $4`
    const result = await pool.query(dataQuery, [userId, userCreatedAt, limit, offset])
    return result.rows
  },
  getNotificationsCount: async (userId, userCreatedAt) => {
    const countQuery = `SELECT COUNT(*) 
      FROM notifications 
      WHERE (recipient_id IS NULL AND created_at > $1) OR recipient_id = $2`
    
    const result = await pool.query(countQuery, [userCreatedAt, userId])
    return parseInt(result.rows[0].count)
  },
  getUserCreatedAt: async (userId) => {
    const result = await pool.query(`SELECT created_at FROM users WHERE id = $1`, [userId])
    return result.rows[0]?.created_at || new Date(0)
  },
  createNotification: async (recipientId, title, message) => {
    const query = `INSERT INTO notifications (recipient_id, title, message) VALUES ($1, $2, $3) RETURNING *`
    const result = await pool.query(query, [recipientId, title, message])
    return result.rows[0]
  },
  getUserIdByFlat: async (flatNumber) => {
    const result = await pool.query(`SELECT user_id FROM flats WHERE flat_number = $1`, [flatNumber])
    return result.rows[0]?.user_id
  },
  getAllFCMTokens: async () => {
    const result = await pool.query(`SELECT token FROM fcm_tokens`)
    return result.rows.map(r => r.token)
  },
  getUserFCMTokens: async (userId) => {
    const result = await pool.query(`SELECT token FROM fcm_tokens WHERE user_id = $1`, [userId])
    return result.rows.map(r => r.token)
  },
  deleteFCMToken: async (token) => {
    await pool.query("DELETE FROM fcm_tokens WHERE token = $1", [token])
  },
  getDashboardNotifications: async (userId, userCreatedAt) => {
    const query = `
      SELECT 
        n.id,
        n.title,
        n.message,
        CASE 
          WHEN nr.id IS NOT NULL THEN TRUE
          ELSE FALSE
        END AS is_read
      FROM notifications n
      LEFT JOIN notification_reads nr
      ON n.id = nr.notification_id AND nr.user_id = $1
      WHERE (n.recipient_id IS NULL AND n.created_at > $2) OR n.recipient_id = $1
      ORDER BY n.created_at DESC
      LIMIT 3
    `
    const result = await pool.query(query, [userId, userCreatedAt])
    return result.rows
  },
  markNotificationRead: async (notificationId, userId) => {
    const query = `
      INSERT INTO notification_reads (notification_id, user_id)
      VALUES ($1, $2)
      ON CONFLICT (notification_id, user_id) DO NOTHING
    `
    await pool.query(query, [notificationId, userId])
  },
  markAllNotificationsRead: async (userId) => {
    const query = `
      INSERT INTO notification_reads (notification_id, user_id)
      SELECT id, $1 FROM notifications
      ON CONFLICT (notification_id, user_id) DO NOTHING
    `
    await pool.query(query, [userId])
  }
}

module.exports = NotificationModel
