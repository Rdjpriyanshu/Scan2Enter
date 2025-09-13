const mongoose=require("mongoose");
const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
  location: {
    type: String,
  },
  capacity: {
    type: Number,
    require: true,
  },
});

module.exports=mongoose.model("Event",eventSchema);