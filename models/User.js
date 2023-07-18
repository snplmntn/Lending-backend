const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    require: true,
    max: 50,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    min: 6,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isGoodPayer: {
    type: Boolean,
    default: undefined,
  },
});

module.exports = mongoose.model("User", UserSchema);
