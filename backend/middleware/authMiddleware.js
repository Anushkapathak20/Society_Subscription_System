const jwt = require("jsonwebtoken")
const pool = require("../config/db")
require("dotenv").config()
const authMiddleware = async (req, res, next) => {
    try {
        const header = req.header("Authorization")
        if (!header) {
            return res.status(401).json({
                message: "Access denied. No token provided"
            })
        }
        const token = header.split(" ")[1]
        if (!token) {
            return res.status(401).json({
                message: "Token missing"
            })
        }
        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET)
        // store user info in request
        req.user = verified
        // Verify user exists in DB
        const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [verified.user_id])
        if (userCheck.rows.length === 0) {
            return res.status(401).json({
                message: "User no longer exists"
            })}
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token"
        })}
}
module.exports = authMiddleware














