const express = require("express")

const router = express.Router()

const { getYearlyReport, getMonthlyReport } = require("../controllers/reportController")
const authMiddleware = require("../middleware/authMiddleware")

router.use(authMiddleware)

router.get("/yearly", getYearlyReport)
router.get("/monthly", getMonthlyReport)

module.exports = router