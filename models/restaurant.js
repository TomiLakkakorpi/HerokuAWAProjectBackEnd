const mongoose = require('mongoose')
const { Schema } = mongoose;

const restaurantSchema = new Schema({
  restaurantName: String,
  restaurantAddress: String,
  operatingHours: Number,
  priceLevel: String,
  restaurantType: String,
  restaurantImage: {
    type: String
}});
const model = mongoose.model("restaurants", restaurantSchema);

module.exports = model;
