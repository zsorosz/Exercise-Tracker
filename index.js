const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./models/User.model");
require("dotenv").config();
require("./db");

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

//Create a new user
app.post("/api/users", async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({ username: newUser.username, _id: newUser._id });
});
