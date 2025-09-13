const mongoose=require("mongoose");
const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  token: {
    type: String,
    unique: true,
    required: true,
  },
  qrCode: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["valid", "scanned", "expired"],
    default: "valid",
  },
},{timestamps:true});

module.exports=mongoose.model("Ticket",ticketSchema);