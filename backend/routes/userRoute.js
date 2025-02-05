const express = require("express");

const router = express.Router();

const {
  createUser,
  registerUser,
  loginUser,
  fetchAlluser,
} = require("../controller/userController");

router.post("/createUser", createUser);
router.post("/register-user", registerUser);
router.post("/login-form", loginUser);
router.get("/fetch-all-user", fetchAlluser);

module.exports = router;
