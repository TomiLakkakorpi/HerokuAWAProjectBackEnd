const mongoose = require('mongoose')
const { Schema } = mongoose;

const restaurantSchema = new Schema({
  restaurantName: String,
  restaurantAddress: String,
  operatingHours: Number,
  priceLevel: String,
  restaurantType: String,
});
const model = mongoose.model("restaurants", restaurantSchema);

module.exports = model;

// const mongoose = require('mongoose')

// const UserSchema = new mongoose.Schema(
// 	{
// 		email: { type: String, required: true, unique: true },
// 		password: { type: String, required: true },
// 		role:{ type: String, required: true },
// 		name:{ type: String, required: true },
// 		surname:{ type: String, required: true }
// 		},
// 	{ collection: 'users' }
// )

// const model = mongoose.model('UserSchema', UserSchema)

// module.exports = model
