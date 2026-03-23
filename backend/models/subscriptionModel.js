const pool = require("../config/db")
const getSubscriptionsModel = async () => {
  const result = await pool.query(
    "SELECT * FROM subscription_plans ORDER BY flat_type"
  )
  return result.rows
}
const updateSubscriptionModel = async (id, flat_type, monthly_amount) => {
  const result = await pool.query(
    `UPDATE subscription_plans
     SET flat_type=$1,
         monthly_amount=$2
     WHERE id=$3
     RETURNING *`,
    [flat_type, monthly_amount, id]
  )
  return result.rows[0]
}

module.exports = {
  getSubscriptionsModel,
  updateSubscriptionModel
}