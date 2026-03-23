const express = require("express")
const router = express.Router()

const controller = require("../controllers/residentController")
const notificationController = require("../controllers/notificationController")
const authMiddleware = require("../middleware/authMiddleware")

router.use(authMiddleware)

router.get("/subscriptions", controller.getResidentSubscriptions)
router.get("/receipt", controller.getResidentReceipt)
router.get("/pending-payment", controller.getPendingPayment)
router.get("/dashboard", controller.getResidentDashboard)

router.put("/notifications/mark-all-read", notificationController.markAllNotificationsRead)
router.put("/notifications/:id/read", notificationController.markNotificationRead)

module.exports = router