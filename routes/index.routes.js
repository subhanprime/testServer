const express = require("express");
const router = express.Router();
const usersRoutes = require("./users.routes");
const filesRoutes = require("./files.routes");

router.use("/users", usersRoutes);
router.use("/file", filesRoutes);

module.exports = router;
