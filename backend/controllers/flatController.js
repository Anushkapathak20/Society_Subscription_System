const pool = require("../config/db")
const flatModel = require("../models/flatModel")
const validateFlat = (data) => {
  const { owner_name, email, phone_number, flat_number } = data
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^[0-9]{10}$/
  const allowedHosts = ["gmail", "yahoo", "tothenew", "outlook", "hotmail"]
  if (!owner_name || !email || !phone_number || !flat_number) {
    return "All fields are required"
  }
  if (!emailRegex.test(email)) {
    return "Invalid email format"
  }
  const host = email.split("@")[1]?.split(".")[0]?.toLowerCase()
  if (!allowedHosts.includes(host)) {
    return "Allowed email providers: gmail, yahoo, tothenew, outlook, hotmail"
  }
  if (!phoneRegex.test(phone_number)) {
    return "Phone number must be exactly 10 digits"
  }
  return null
}
exports.getFlats = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 8
    const search = req.query.search || ""
    const offset = (page - 1) * limit
    const flats = await flatModel.getPaginatedFlats(limit, offset, search)
    const totalCount = await flatModel.getFlatsCount(search)
    const totalPages = Math.ceil(totalCount / limit)
    res.json({
      success: true,
      data: flats,
      meta: {
        totalCount,
        totalPages,
        currentPage: page,
        limit
      }
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    })
  }
}
exports.createFlat = async (req, res) => {
  const client = await pool.connect()
  try {
    const error = validateFlat(req.body)
    if (error) {
      return res.status(400).json({ success: false, error })
    }
    const { owner_name, email, phone_number, flat_number, flat_type } = req.body
    await client.query("BEGIN")
    const flatExists = await flatModel.checkFlatNumberExists(client, flat_number)
    if (flatExists) {
      await client.query("ROLLBACK")
      return res.status(400).json({
        success: false,
        error: `Flat number ${flat_number} is already assigned to someone`
      })
    }

    const userId = await flatModel.createUser(
      client,
      owner_name,
      email,
      phone_number
    )
    const flat = await flatModel.createFlat(
      client,
      flat_number,
      flat_type,
      userId
    )
    await client.query("COMMIT")
    res.status(201).json({
      success: true,
      data: flat
    })
  } catch (err) {
    await client.query("ROLLBACK")
    console.error(err)
    res.status(500).json({
      success: false,
      error: err.message
    })
  } finally {
    client.release()
  }
}
exports.updateFlat = async (req, res) => {
  const client = await pool.connect()
  try {
    const error = validateFlat(req.body)
    if (error) {
      return res.status(400).json({ success: false, error })
    }
    const { flat_id } = req.params
    const {
      owner_name,
      email,
      phone_number,
      flat_number,
      flat_type
    } = req.body
    await client.query("BEGIN")
    const flatExists = await flatModel.checkFlatNumberExists(client, flat_number, flat_id)
    if (flatExists) {
      await client.query("ROLLBACK")
      return res.status(400).json({
        success: false,
        error: `Flat number ${flat_number} is already assigned to someone`
      })
    }

    const userId = await flatModel.getFlatUser(client, flat_id)
    if (userId) {
      await flatModel.updateUser(
        client,
        owner_name,
        email,
        phone_number,
        userId
      )
    }
    const flat = await flatModel.updateFlat(
      client,
      flat_number,
      flat_type,
      flat_id
    )
    await client.query("COMMIT")
    res.json({
      success: true,
      data: flat
    })
  } catch (err) {
    await client.query("ROLLBACK")
    res.status(500).json({
      success: false,
      error: err.message
    })
  } finally {
    client.release()
  }
}
exports.deleteFlat = async (req, res) => {
  const client = await pool.connect()
  try {
    const { flat_id } = req.params
    await client.query("BEGIN")
    await flatModel.deleteFlat(client, flat_id)
    await client.query("COMMIT")
    res.json({
      success: true,
      message: "Flat deleted successfully"
    })
  } catch (err) {
    await client.query("ROLLBACK")
    res.status(500).json({
      success: false,
      error: err.message
    })
  } finally {
    client.release()
  }
}






