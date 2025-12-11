const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { execFile } = require("child_process");
const path = require("path");
require("./utils/dailyBackup");
require("./utils/dailyBackup");


// IMPORTS (FIXED)
const { connectSql } = require("./db/sql");
const connectMongo = require("./db/mongo");

const poseRoutes = require("./routes/poseRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// uploads folder config
const upload = multer({ dest: path.join(__dirname, "../uploads") });

// Pose Extraction API
app.post("/extract-pose", upload.single("image"), (req, res) => {
  // SAFETY CHECK
  if (!req.file) {
    return res.status(400).json({ error: "No image file uploaded" });
  }

  // Uploaded image path
  const imagePath = path.join(__dirname, "../uploads", req.file.filename);

  // Use VENV Python only
  const pythonPath = path.join(
    __dirname,
    "../../mediapipe-service/venv/Scripts/python.exe"
  );

  const scriptPath = path.join(
    __dirname,
    "../../mediapipe-service/pose_extractor.py"
  );

  execFile(pythonPath, [scriptPath, imagePath], (err, stdout, stderr) => {
    if (err) {
      console.error("Python Exec Error:", err);
      console.error("Python STDERR:", stderr);

      return res.status(500).json({
        error: "Pose extraction failed",
        details: stderr,
      });
    }

    try {
      const data = JSON.parse(stdout);
      res.json(data);
    } catch (e) {
      console.error("❌ JSON Parse Error:", stdout);
      res.status(500).json({
        error: "Invalid JSON from Python",
        raw: stdout,
      });
    }
  });
});

// MySQL Connect
connectSql();
connectMongo(); // MongoDB connect


//Pose Routes Register
app.use("/", poseRoutes);

//Server Start
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
