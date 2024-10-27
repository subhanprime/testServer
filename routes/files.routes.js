const express = require("express");
const multer = require("multer");
const router = express.Router();
const { fileUpload } = require("../controllers/file.controller");
const upload = multer({ dest: "uploads/" });

router.route("/").post(upload.single("file"), fileUpload);
module.exports = router;
