const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  userLogin,
} = require("../controllers/users.controllers");
const { authenticateToken } = require("../middleware/authentication");

router
  .route("/")
  .get(authenticateToken, getAllUsers)
  .post(authenticateToken, createUser);
router.route("/login").post(userLogin);
module.exports = router;
