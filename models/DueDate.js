const mongoose = require("mongoose");

const DueDateSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 3,
    max: 20,
  },
  amountToPay: {
    type: Number,
    require: true,
  },
  payMethod: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    require: true,
  },
  dueDate: {
    type: Date,
  },
  status: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
  },
});

module.exports = mongoose.model("DueDate", DueDateSchema);
