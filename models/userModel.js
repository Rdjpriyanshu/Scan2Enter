const mongoose=require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
  },
  phone: {
    type: String,
  },
});

module.exports=mongoose.model("User",userSchema);