const express = require("express")
const router = express.Router()
const dashboardController = require("../controllers/dashboardController")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin"),
  dashboardController.getDashboard
)

module.exports = router
