const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3030;
require("dotenv").config();
const routes = require("./routes/routes");
const cors = require("cors");
const bodyParser = require("body-parser");
// const multer = require("multer");

const api = require('./routes/routes')


app.use(cors());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static('public'));
app.use('/api', api)

// app.use(bodyParser.urlencoded())
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
//Database Connection
mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((result) => console.log("Database Connected Successfully"))
  .catch((err) => console.log(err.message));

app.get("/", (req, res) => {
  res.send("Hello World")
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
