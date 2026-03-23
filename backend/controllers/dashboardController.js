const {
  getTotalFlats,
  getTotalCollection,
  getPendingPayments,
  getMonthlyCollection
} = require("../models/dashboardModel")

exports.getDashboard = async (req, res) => {
  try {

    const totalFlatsResult = await getTotalFlats()
    const totalCollectedResult = await getTotalCollection()
    const pendingPaymentsResult = await getPendingPayments()
    const monthlyCollectionResult = await getMonthlyCollection()

    res.json({
      success: true,
      totalFlats: parseInt(totalFlatsResult.total_flats),
      totalCollection: parseFloat(totalCollectedResult.total_collected),
      pendingPayments: parseFloat(pendingPaymentsResult.pending_payments),
      monthlyCollection: monthlyCollectionResult.map(row => ({
        month: row.month,
        amount: parseFloat(row.collected)
      }))
    })

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}





















