const ResidentModel = require("../models/residentModel")
const NotificationModel = require("../models/notificationModel")

const getResidentSubscriptions = async (req, res) => {
  try {
    const userId = req.user.user_id
    const result = await ResidentModel.getSubscriptions(userId)
    res.json({
      success: true,
      data: result
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}

const getResidentReceipt = async (req, res) => {
  try {
    const { month } = req.query
    const userId = req.user.user_id
    const result = await ResidentModel.getReceipt(userId, month)
    res.json({
      success: true,
      data: result
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}

const getPendingPayment = async (req, res) => {
  try {
    const userId = req.user.user_id
    const result = await ResidentModel.getPendingPayment(userId)
    res.json({
      success: true,
      data: result || null
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}

const getResidentDashboard = async (req, res) => {
  try {
    const userId = req.user.user_id
    const userFlatInfo = await ResidentModel.getUserFlatInfo(userId)

    if (!userFlatInfo) {
      return res.json({ success: false, error: "User or flat not found" })
    }

    const summary = await ResidentModel.getLatestRecordSummary(userFlatInfo.flat_id)
    const payments = await ResidentModel.getDashboardPaymentHistory(userFlatInfo.flat_id)
    const notifications = await NotificationModel.getDashboardNotifications(userId, userFlatInfo.created_at)

    res.json({
      success: true,
      summary: {
        ...summary,
        notifications
      },
      data: payments
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}

module.exports = {
  getResidentSubscriptions,
  getResidentReceipt,
  getPendingPayment,
  getResidentDashboard
}