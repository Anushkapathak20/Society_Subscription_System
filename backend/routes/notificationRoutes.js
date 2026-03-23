const express = require("express")
const router = express.Router()

const notificationController = require("../controllers/notificationController")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

router.use(authMiddleware)

router.get("/", notificationController.getNotifications)

router.get("/user/:userId", notificationController.getUserNotifications)

router.post("/", roleMiddleware("admin"), notificationController.sendNotification)

router.put("/mark-all-read", notificationController.markAllNotificationsRead)
router.put("/:id/read", notificationController.markNotificationRead)

module.exports = router