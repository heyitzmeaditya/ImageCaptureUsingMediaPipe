const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "keypoint_db",  
  "root",          
  "root", 
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

async function connectSql() {
  try {
    await sequelize.authenticate();
    console.log("MySQL Connected Successfully");
  } catch (error) {
    console.error("MySQL Connection Failed:", error.message);
  }
}

module.exports = { sequelize, connectSql };
