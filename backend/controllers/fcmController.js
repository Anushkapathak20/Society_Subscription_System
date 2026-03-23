const {
  registerTokenModel,
  unregisterTokenModel
} = require("../models/fcmModel")
exports.registerToken = async (req, res) => {
  try {
    const userId = req.user.user_id
    const { token } = req.body
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "FCM token is required"
      })
    }
    await registerTokenModel(userId, token)
    res.json({
      success: true,
      message: "FCM token registered"
    })
  } catch (err) {
    console.error("Error registering FCM token:", err)
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}
exports.unregisterToken = async (req, res) => {
  try {
    const userId = req.user.user_id
    const { token } = req.body
    await unregisterTokenModel(userId, token)
    res.json({
      success: true,
      message: "FCM token removed"
    })
  } catch (err) {
    console.error("Error unregistering FCM token:", err)
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}