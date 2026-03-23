const admin = require("../config/firebase")
const NotificationModel = require("../models/notificationModel")
async function sendPushNotification(title, message, tokens) {
  if (!tokens || !tokens.length) return
  if (!admin.apps.length) {
    console.warn("Firebase not initialized – skipping push")
    return
  } try {
    const payload = {
      data: {
        title: title,
        body: message
      }
    }
    const response = await admin.messaging().sendEachForMulticast({
      tokens,
      ...payload
    })
    console.log(`FCM: ${response.successCount} sent, ${response.failureCount} failed`)
    response.responses.forEach(async (resp, idx) => {
      if (!resp.success) {
        const errorCode = resp.error?.code
        if (
          errorCode === "messaging/invalid-registration-token" ||
          errorCode === "messaging/registration-token-not-registered"
        ) {
          await NotificationModel.deleteFCMToken(tokens[idx])
        }
      }
    })
  } catch (err) {
    console.error("FCM send error:", err.message)
  }
}
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit
    const userCreatedAt = await NotificationModel.getUserCreatedAt(userId)
    const notifications = await NotificationModel.getUserNotifications(userId, userCreatedAt, limit, offset)
    const totalCount = await NotificationModel.getNotificationsCount(userId, userCreatedAt)
    const totalPages = Math.ceil(totalCount / limit)
    res.json({
      success: true,
      data: notifications,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        limit
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit
    const userCreatedAt = await NotificationModel.getUserCreatedAt(userId)
    const notifications = await NotificationModel.getUserNotifications(userId, userCreatedAt, limit, offset)
    const totalCount = await NotificationModel.getNotificationsCount(userId, userCreatedAt)
    const totalPages = Math.ceil(totalCount / limit)
    res.json({
      success: true,
      data: notifications,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        limit
      }
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
exports.sendNotification = async (req, res) => {
  try {
    const { title, message, type, flat_number } = req.body
    if (type === "all") {
      await NotificationModel.createNotification(null, title, message)
      const tokens = await NotificationModel.getAllFCMTokens()
      await sendPushNotification(title, message, tokens)
    } else if (type === "user") {
      const userId = await NotificationModel.getUserIdByFlat(flat_number)
      if (!userId) {
        return res.status(404).json({
          success: false,
          message: "Flat not found or no user associated"
        })
      }
      await NotificationModel.createNotification(userId, title, message)
      const tokens = await NotificationModel.getUserFCMTokens(userId)
      await sendPushNotification(title, message, tokens)
    }
    res.json({
      success: true,
      message: "Notification Sent Successfully"
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.user_id
    await NotificationModel.markNotificationRead(id, userId)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}

exports.markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user.user_id
    await NotificationModel.markAllNotificationsRead(userId)
    res.json({ success: true })
  } catch (err) {
    console.error("MARK ALL READ ERROR:", err)
    res.status(500).json({ success: false, error: err.message })
  }
}
