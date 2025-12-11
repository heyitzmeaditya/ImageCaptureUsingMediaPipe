const express = require("express");
const multer = require("multer");
const {
  extractAndSavePose,
} = require("../controllers/poseController");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/extract-pose", upload.single("image"), extractAndSavePose);

module.exports = router;
