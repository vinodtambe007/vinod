const mongoose = require("mongoose");
const User = require("../model/registerUserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log("Hello");
    console.log(name);
    console.log(email);
    return res.status(200).json({ data: name, state: email });
  } catch (error) {}
};

// *************************** REGISTER CONTROLLER ***************************
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirm_password, role } = req.body;
    console.log(name, email, password, confirm_password, role);
    if (!name || !email || !password || !confirm_password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
    if (password !== confirm_password) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match!",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// *************************** LOGIN CONTROLLER ***************************
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required!",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Incorrect credentials!",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect credentials!",
      });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30m" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful!",
      data: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

const fetchAlluser = async (req, res) => {
  try {
    const userData = await User.find();

    if (!userData) {
      res.status(400).json({
        success: false,
        message: "cant find userData",
        data: userData,
      });
    }
    res.status(200).json({
      success: true,
      message: "User data fetch successful!",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

module.exports = { createUser, registerUser, loginUser, fetchAlluser };
