const mongoose = require("mongoose");
const { Schema } = mongoose;

const menuSchema = new Schema({
  menuName: String,
  menuDescription: String,
  menuPrice: Number,
  menuImage: {
    type: String
},
restaurantName: String
});
const model = mongoose.model("restaurantMenu", menuSchema);

module.exports = model;
