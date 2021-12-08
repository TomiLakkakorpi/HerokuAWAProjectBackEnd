const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  cart: { type: Object, required: true },
  userName : { type: String, required: true },
  address : { type: String, required: true },
});
const model = mongoose.model("orders", orderSchema);

module.exports = model;
