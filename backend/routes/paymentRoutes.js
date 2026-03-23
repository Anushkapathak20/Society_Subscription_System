const express = require("express")
const router = express.Router()

const { createPayment } = require("../controllers/paymentController")
const authMiddleware = require("../middleware/authMiddleware")

router.use(authMiddleware)

router.post("/", createPayment)

module.exports = router