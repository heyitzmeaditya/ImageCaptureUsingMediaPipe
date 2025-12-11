const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

const Pose = require("../models/Pose");    // MySQL Model
const Image = require("../models/Image");  // MongoDB Model

exports.extractAndSavePose = async (req, res) => {
  try {
    // SAFETY CHECK
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const imagePath = path.join(
      __dirname,
      "../../uploads",
      req.file.filename
    );

    // SAVE IMAGE TO MONGODB
    const imageBuffer = fs.readFileSync(imagePath);

    const newImage = new Image({
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      data: imageBuffer,
    });

    const savedImage = await newImage.save(); // returns _id

    // CALL PYTHON FOR POSE
    const pythonPath = path.join(
      __dirname,
      "../../../mediapipe-service/venv/Scripts/python.exe"
    );

    const scriptPath = path.join(
      __dirname,
      "../../../mediapipe-service/pose_extractor.py"
    );

    execFile(pythonPath, [scriptPath, imagePath], async (err, stdout, stderr) => {
      if (err) {
        console.error("Python Error:", err);
        return res.status(500).json({
          error: "Pose extraction failed",
          details: stderr,
        });
      }

      const poseData = JSON.parse(stdout);

      // SAVE POSE TO MYSQL WITH MONGO ID
      const savedPose = await Pose.create({
        image_mongo_id: savedImage._id.toString(),
        keypoints: poseData,
        original_filename: req.file.originalname,
        pose_type: "human",
      });

      return res.json({
        message: "Image saved to MongoDB & Pose saved to MySQL",
        mongo_image_id: savedImage._id,
        mysql_pose: savedPose,
      });
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
