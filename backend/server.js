
const express = require("express")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./routes/authRoutes")
const flatsRoutes = require("./routes/flatRoutes")
const subscriptionRoutes = require("./routes/subscriptionRoutes")
const monthlyRoutes = require("./routes/monthlyRecords")
const paymentRoutes = require("./routes/paymentRoutes")
const reportRoutes = require("./routes/reportRoutes")
const residentRoutes = require("./routes/residentRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const fcmRoutes = require("./routes/fcmRoutes")
const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("/api/flats", flatsRoutes)
app.use("/api", subscriptionRoutes)
app.use("/api/monthly-records", monthlyRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/resident", residentRoutes)
app.use("/api/admin", dashboardRoutes)
app.use("/api/notifications", notificationRoutes)
app.use("/api/fcm", fcmRoutes)

app.get("/", (req, res) => {
    res.send("API Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

