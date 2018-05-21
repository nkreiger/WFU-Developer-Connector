// modals are singular and start with a capital
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema Object
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});
// export User which calls the user schema function
// "users" establish that as the input
module.exports = User = mongoose.model("users", UserSchema);
