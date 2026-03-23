const pool = require("../config/db")
const model = require("../models/monthlyRecordsModel")
const getMonthlyRecords = async (req,res)=>{
try{
const {month} = req.query
const page = parseInt(req.query.page) || 1
const limit = parseInt(req.query.limit) || 8
const offset = (page - 1) * limit
const monthDate = `${month}-01`
const statusFilter = req.query.status === "Pending" ? "Pending" : null
const rows = await model.getPaginatedMonthlyData(monthDate, limit, offset, statusFilter)
const totalCount = await model.getMonthlyRecordsCount(monthDate, statusFilter)
const summary = await model.getMonthlySummary(monthDate)
const totalPages = Math.ceil(totalCount / limit)
res.json({
success:true,
data:rows,
meta: {
  totalCount,
  totalPages,
  currentPage: page,
  limit,
  ...summary
}
})
}catch(err){
res.status(500).json({
success:false,
error:err.message
})}
}
const markAsPaid = async (req,res)=>{
const client = await pool.connect()
try{
const {id} = req.params
const {payment_mode="Cash",transaction_id=null} = req.body
await client.query("BEGIN")
const record = await model.getRecordForUpdate(client,id)
if(!record){
await client.query("ROLLBACK")
return res.status(404).json({
success:false,
error:"Record not found"
})}
if(record.status==="Paid"){
await client.query("ROLLBACK")
return res.status(400).json({
success:false,
error:"Already paid"
})
}
await model.insertPayment(client, id, record.amount, payment_mode, transaction_id )
await model.updateRecordStatus(client,id)
await client.query("COMMIT")
res.json({
success:true,
message:"Payment recorded successfully"
})
}catch(err){
await client.query("ROLLBACK")
res.status(500).json({
success:false,
error:err.message
})}finally{
client.release()
}}
const markAsPaidByFlat = async (req,res)=>{
const client = await pool.connect()
try{
const {flat_number,month} = req.body
const monthDate = `${month}-01`
await client.query("BEGIN")
const flat = await model.getFlatByNumber(client,flat_number)
if(!flat){
await client.query("ROLLBACK")
return res.status(404).json({
success:false,
error:"Flat not found"
})
}
let record = await model.getMonthlyRecord(client,flat.id,monthDate)
let record_id
if(!record){
record_id = await model.createMonthlyRecord(
client,
flat.id,
monthDate,
flat.amount )
}else{
if(record.status==="Paid"){
await client.query("ROLLBACK")
return res.status(400).json({
success:false,
error:"Already paid"
})}
record_id = record.id
}
await model.insertPayment(
client,
record_id,
flat.amount,
"UPI",
"TXN" + Date.now(),
)
await model.updateRecordStatus(client,record_id)
await client.query("COMMIT")
res.json({
success:true,
message:"Payment recorded successfully"
})
}catch(err){
await client.query("ROLLBACK")
res.status(500).json({
success:false,
error:err.message
})}finally{
client.release()
}}
module.exports = {
  getMonthlyRecords,
  markAsPaid,
  markAsPaidByFlat
}