const express = require("express")
const router = express.Router()

const fcmController = require("../controllers/fcmController")
const authMiddleware = require("../middleware/authMiddleware")

router.use(authMiddleware)

router.post("/register", fcmController.registerToken)
router.delete("/unregister", fcmController.unregisterToken)

module.exports = router
