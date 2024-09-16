const express = require("express");
const router = express.Router();
const User = require("../models/Users");
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    await newUser.save();

    res.send("User registered successfully");
  } catch (error) {
    return res
      .status(402)
      .json({ message: "Something is wrong while registering new user." });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.send(user);
  } catch (error) {
    return res.json({ message: "Error while login..." });
  }
});

router.get("/getAllUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

router.post("/deleteUser", async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from the request body
    console.log("User Id to be deleted------>.", userId);

    const result = await User.deleteOne({ _id: userId });
    User.save();
    if (result.deletedCount === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log("User deletion result------------>", result);
    res.json({ message: "User deleted successfully" }); // Send a success message
  } catch (error) {
    res.status(500).json({ message: "Error while deleting user" });
  }
});

module.exports = router;
