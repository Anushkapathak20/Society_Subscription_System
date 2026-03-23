const express = require("express")

const router = express.Router()


const passport = require("../config/passport")
const authMiddleware = require("../middleware/authMiddleware")
const {
  googleCallback,
  loginUser,
  getCurrentUser,
  updateProfile,
  changePassword
} = require("../controllers/authController")

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
)


router.post("/login", loginUser)

router.get("/me", authMiddleware, getCurrentUser)
router.put("/me", authMiddleware, updateProfile)
router.put("/password", authMiddleware, changePassword)

module.exports = router


