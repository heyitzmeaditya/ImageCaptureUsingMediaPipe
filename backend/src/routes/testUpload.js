const express = require("express");
const upload = require("../utils/multer");

const router = express.Router();

// test image upload
router.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    message: "Image uploaded successfully ",
    file: req.file,
  });
});

module.exports = router;
