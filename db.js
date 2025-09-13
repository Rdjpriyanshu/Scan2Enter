const mongoose=require("mongoose");

mongoose.connect(
  process.env.MONGO_DB_URL,
  {
    dbName:"qrcode_ticket_scan",
  }
).then(()=>{
    console.log("------------------ Database connected -------------------------")
}).catch((err)=>{
    console.log("------------------- Database error -----------------------------")
    console.log(err.message);
})