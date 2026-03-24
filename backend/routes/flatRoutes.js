const express = require("express")
const router = express.Router()

const flatController = require("../controllers/flatController")
const authMiddleware = require("../middleware/authMiddleware")
const roleMiddleware = require("../middleware/roleMiddleware")

router.use(authMiddleware)

router.get("/", flatController.getFlats)
router.post("/", roleMiddleware("admin"), flatController.createFlat)
router.put("/:flat_id", roleMiddleware("admin"), flatController.updateFlat)
router.delete("/:flat_id", roleMiddleware("admin"), flatController.deleteFlat)

module.exports = router