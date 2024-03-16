const mongoose = require("mongoose");

const sequenceSchema = new mongoose.Schema({
  _id: String,
  seq: {
    type: Number,
    default: 0,
  },
});

const sequenceModel = mongoose.model("sequence", sequenceSchema);

module.exports = sequenceModel;
