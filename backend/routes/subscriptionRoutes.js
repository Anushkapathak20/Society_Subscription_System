const express = require("express")
const router = express.Router()
const {
  getSubscriptions,
  updateSubscription
} = require("../controllers/subscriptionsController")

const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

router.use(authMiddleware)

router.get("/subscriptions", getSubscriptions)
router.put("/subscriptions/:id", roleMiddleware("admin"), updateSubscription)


module.exports = router