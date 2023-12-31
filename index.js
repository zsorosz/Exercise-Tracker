const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./models/User.model");
const Exercise = require("./models/Exercise.model");
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

//Get all users
app.get("/api/users", async (req, res, next) => {
  const allUsers = await User.find();
  res.json(allUsers);
});

//Create a new user
app.post("/api/users", async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({ username: newUser.username, _id: newUser._id });
});

//Create an exercise
app.post("/api/users/:_id/exercises", async (req, res, next) => {
  const date = req.body.date || new Date();
  const exercise = await Exercise.create({
    ...req.body,
    date: date,
  });
  const user = await User.findByIdAndUpdate(
    req.params._id,
    { $push: { exercises: exercise._id } },
    { new: true }
  ).populate("exercises");

  res.json({
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString(),
    _id: user._id,
  });
});

//Get log of a user's exercises
app.get("/api/users/:_id/logs", async (req, res, next) => {
  const user = await User.findById(req.params._id).populate("exercises");
  const from = req.query.from && new Date(req.query.from);
  const to = req.query.to && new Date(req.query.to);
  const createLog = () => {
    let exercises = [];
    //Filter excercises by optional params
    if (from || to) {
      exercises = user.exercises.filter((exercise) => exercise.date >= from);
    } else {
      exercises = user.exercises;
    }
    if (req.query.limit) {
      exercises = exercises.slice(0, req.query.limit);
    }
    //Create log
    const log = [];
    exercises.map((exercise) => {
      log.push({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString(),
      });
    });
    return log;
  };
  res.json({
    _id: user._id,
    username: user.username,
    from: from && from.toDateString(),
    to: to && to.toDateString(),
    count: user.exercises.length,
    log: createLog(),
  });
});
