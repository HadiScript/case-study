const express = require("express");
const errorHandler = require("../middleware/ErrorHandler");
const User = require("../models/user");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verify");

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(400, "Wrong credentials!"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    res.status(200).json({ token, user: validUser });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "User not found!"));
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    return next(errorHandler(400, "You already registered"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ email, password: hashedPassword });

  await newUser.save();
  res.status(201).json({ message: "User created successfully!" });
});

router.get("/current-user", verifyToken, async (req, res, next) => {
  try {
    const _user = await User.findOne({ _id: req.user.id });
    res.status(201).json({ msg: "hi", _user });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
