let express = require("express"),
  multer = require("multer"),
  mongoose = require("mongoose"),
  router = express.Router();
const DIR = "./public/";
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

// User model
let Restaurant = require("../models/restaurant");
//create new restaurant
router.post(
  "/user-profile",
  upload.single("restaurantImage"),
  (req, res, next) => {
    const {
      restaurantName,
      restaurantAddress,
      operatingHours,
      priceLevel,
      restaurantType,
    } = req.body;
    const url = req.protocol + "://" + req.get("host");
    console.log(restaurantName);
    const restaurant = new Restaurant({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      restaurantImage: url + "/public/" + req.file.filename,
      restaurantName: restaurantName,
      restaurantAddress: restaurantAddress,
      operatingHours: operatingHours,
      priceLevel: priceLevel,
      restaurantType: restaurantType,
    });
    restaurant
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User registered successfully!",
          userCreated: {
            _id: result._id,
            restaurantImage: result.restaurantImage,
          },
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-unused-expressions
        console.log(err),
          res.status(500).json({
            error: err,
          });
      });
  }
);

let Menu = require("../models/menu");

//add menu to restaurant
router.post("/addMenu", upload.single("menuImage"), (req, res, next) => {
  // console.log(req.body)
  const { menuName, menuDescription, menuPrice, restaurantName } = req.body;
  console.log(menuName, menuDescription, menuPrice);
  const url = req.protocol + "://" + req.get("host");

  const menu = new Menu({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    menuImage: url + "/public/" + req.file.filename,
    menuName: menuName,
    menuDescription: menuDescription,
    menuPrice: menuPrice,
    restaurantName: restaurantName,
  });
  menu
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Menu Added successfully!",
        userCreated: {
          _id: result._id,
          menuImage: result.menuImage,
        },
      });
    })
    .catch((err) => {
      // eslint-disable-next-line no-unused-expressions
      console.log(err),
        res.status(500).json({
          error: err,
        });
    });
});

//get all restaurants
router.get("/allRestaurants", async (req, res) => {
  const search = req.query.search;
  const allRestaurants = await Restaurant.find({
    restaurantName: { $regex: search, $options: "i" },
  });
  res.send(allRestaurants);
});

//get menus under restaurant
router.get("/allMenus/:restaurantName", async (req, res) => {
  const restaurantName = req.params;
  // console.log(restaurantName)
  const menus = await Menu.find(restaurantName);
  res.send(menus);
});

let User = require("../models/users");
//create user
router.post("/newUser", (req, res) => {
  console.log(req.body);
  const { firstName, lastName, email, password } = req.body;
  // console.log("Working")
  const user = new User({ firstName, lastName, email, password, role: "user" });
  user.save((err) => {
    if (err) {
      if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        res.send({ message });
      }
    } else {
      res.send({ message: "sucessfull", user: user });
    }
  });
});

//create admin
router.post("/newAdmin", (req, res, next) => {
  // console.log(req.body)
  const { email, firstName, lastName, password } = req.body;
  console.log(email, firstName, lastName, password);

  const user = new User({
    email,
    firstName,
    lastName,
    password,
    role: "admin",
  });
  user
    .save()
    .then((result) => {
      res.status(201).json({
        message: "User Added successfully!",
        userCreated: {
          _id: result._id,
        },
      });
    })
    .catch((err) => {
      // eslint-disable-next-line no-unused-expressions
      console.log(err),
        res.status(500).json({
          error: err,
        });
    });
});

//login system
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  User.findOne({ email: email }, (err, user) => {
    if (!user) {
      res.send({ message: "Sorry You are not a user" });
    } else {
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          res.send({ message: "Login Succes", user: user });
        } else {
          res.send({ message: "Wrong Credentials" });
        }
      });
    }
  });
});

//save order to database
const Order = require("../models/orders");
router.post("/orders", (req, res) => {
  const { orderedItems, userName, address } = req.body;
  const order = new Order({
    cart: orderedItems,
    userName: userName,
    address: address,
  });
  order.save((err) => {
    if (err) {
      if (err.code === 11000) {
        const message = "Error Occured";
        res.send({ message });
      }
    } else {
      res.send({ message: "sucessfull" });
    }
  });
});

//get all orders
router.get("/allOrders", async (req, res) => {
  const allOrders = await Order.find({});
  res.send(allOrders);
});

//find menu
router.get("/findMenu/:id", async (req, res) => {
  const id = req.params;
  console.log(id);
  const menus = await Menu.findOne(id);
  console.log(menus);
  res.send(menus);
});

router.get("/findAndDelete/:id", (req, res) => {
  const id = req.params;
  // console.log(id);

  Order.findOneAndDelete({ id }, (err) => {
    if (err) {
      if (err.code === 11000) {
        const message = "Error Occured";
        res.send({ message });
      }
    } else {
      res.send({ message: "Sucessfull" });
    }
  });

});

module.exports = router;
