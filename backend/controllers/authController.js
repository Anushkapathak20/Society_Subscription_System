const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const { findUserByEmail, findUserById, getFullUserById, checkEmailExistsForOtherUser, updateUserProfile, getPasswordHash, updatePassword } = require("../models/authModel")
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      })
    }
    const emailNormalized = email.toLowerCase()
    const user = await findUserByEmail(emailNormalized)
    if (user.length === 0) {
      return res.status(400).json({
        message: "User not found"
      })
    }
    if (!user[0].password_hash) {
      return res.status(400).json({
        message: "Please login using Google or activate account"
      })
    }
    const validPassword = await bcrypt.compare(password, user[0].password_hash)
    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid password"
      })
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined")
    }
    const token = jwt.sign(
      {
        user_id: user[0].id,
        role: user[0].role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        role: user[0].role
      }
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.user_id
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const userResult = await findUserById(userId)
    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ success: true, user: userResult[0] })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.user_id
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const { name, phone, email } = req.body
    const currentUserResult = await getFullUserById(userId)
    if (currentUserResult.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }
    const currentUser = currentUserResult[0]
    let emailToUpdate = currentUser.email
    if (email && email !== currentUser.email) {
      const normalizedEmail = email.toLowerCase()
      const existingUser = await checkEmailExistsForOtherUser(normalizedEmail, userId)
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email already in use" })
      }
      emailToUpdate = normalizedEmail
    }
    const updatedUser = await updateUserProfile(
      name ?? currentUser.name,
      phone ?? currentUser.phone,
      emailToUpdate,
      userId
    )
    res.json({
      success: true,
      user: updatedUser,
      message: "Profile updated"
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user?.user_id
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new password are required"
      })
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      })
    }
    const userResult = await getPasswordHash(userId)
    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }
    const validPassword = await bcrypt.compare(currentPassword, userResult[0].password_hash)
    if (!validPassword) {
      return res.status(401).json({
        message: "Current password is incorrect"
      })
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await updatePassword(userId, hashedPassword)
    res.json({
      success: true,
      message: "Password updated successfully"
    })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
}
// GOOGLE CALLBACK
exports.googleCallback = async (req, res) => {
  try {
    const CLIENT_URL = process.env.FRONTEND_URL || "http://localhost:3000"

    if (!req.user || !req.user.email) {
      return res.redirect(
        `${CLIENT_URL}/admin/login?error=Unauthorized`
      )
    }
    const email = req.user.email.toLowerCase()
    const existingUser = await findUserByEmail(email)
    if (existingUser.length === 0) {
      return res.redirect(
        `${CLIENT_URL}/admin/login?error=Contact admin for access`
      )
    }
    const user = existingUser[0]
    if (!["admin"].includes(user.role)) {
      return res.redirect(
        `${CLIENT_URL}/admin/login?error=Unauthorized`
      )
    }
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined")
    }
    const token = jwt.sign(
      {
        user_id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )
    res.redirect(`${CLIENT_URL}/admin/dashboard?token=${token}`)
  } catch (err) {
    const CLIENT_URL = process.env.FRONTEND_URL || "http://localhost:3000"
    res.redirect(
      `${CLIENT_URL}/admin/login?error=Login failed`
    )
  }
}
































