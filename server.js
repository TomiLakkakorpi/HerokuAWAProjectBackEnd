const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const port = 3030;
const bodyParser = require("body-parser");
var cors = require("cors");
const restaurantSchema = require("./models/restaurant");

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Database Connection
mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("Database Connected Successfully"))
  .catch((err) => console.log(err.message));

app.post("/addRestaurant", async (req, res) => {
  const {
    restaurantName,
    restaurantAddress,
    operatingHours,
    priceLevel,
    restaurantType,
  } = req.body;
  // console.log(
  //   restaurantName,
  //   restaurantAddress,
  //   operatingHours,
  //   priceLevel,
  //   restaurantType
  // );

  const newRestaurant = new restaurantSchema({
    restaurantName: restaurantName,
    restaurantAddress: restaurantAddress,
    operatingHours: operatingHours,
    priceLevel: priceLevel,
    restaurantType: restaurantType,
  });

  try {
    await newRestaurant.save();
    console.log("Restaurant Successfully Added")
    return res.json({ status: 'Successfull'})
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
