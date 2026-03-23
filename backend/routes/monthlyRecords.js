const express = require("express")
const router = express.Router()
const controller = require("../controllers/monthlyRecordsController")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

router.use(authMiddleware)

router.get("/", controller.getMonthlyRecords)
router.patch("/:id/pay", roleMiddleware("admin"), controller.markAsPaid)
router.post("/pay-flat", controller.markAsPaidByFlat)

module.exports = router