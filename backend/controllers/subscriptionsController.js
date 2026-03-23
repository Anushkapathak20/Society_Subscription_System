const { getSubscriptionsModel, createSubscriptionModel, updateSubscriptionModel, deleteSubscriptionModel } = require("../models/subscriptionModel")
const getSubscriptions = async (req, res) => {
  try {
    const plans = await getSubscriptionsModel()
    res.json({
      success: true,
      data: plans
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    })}
}
const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params
    const { flat_type, monthly_amount } = req.body
    const updatedPlan = await updateSubscriptionModel(
      id,
      flat_type,
      monthly_amount
    )
    if (!updatedPlan) {
      return res.status(404).json({
        success: false,
        message: "Plan not found"
      })
    }
    res.json({
      success: true,
      data: updatedPlan
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    })}
}

module.exports = {
  getSubscriptions,
  updateSubscription
}




















