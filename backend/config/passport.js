const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "../.env") })
const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const pool = require("../config/db")
passport.use(
 new GoogleStrategy(
  {
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: "/api/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
   try {
    const email = profile.emails[0].value
    const userResult = await pool.query(
     "SELECT * FROM users WHERE email=$1",
     [email]
    )
    // Only allow login for existing admin
    if (userResult.rows.length === 0) {
      return done(null, false, { message: "User not found" })
    }
    return done(null, userResult.rows[0])
   } catch(err) {
    return done(err,null)
   }
  })
)
module.exports = passport