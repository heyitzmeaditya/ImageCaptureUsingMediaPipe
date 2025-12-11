const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/sql");

const Pose = sequelize.define(
  "Pose",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    image_mongo_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    keypoints: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    original_filename: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    pose_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "poses",
    timestamps: false,
  }
);

module.exports = Pose;
