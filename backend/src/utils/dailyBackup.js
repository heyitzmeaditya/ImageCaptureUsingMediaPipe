const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const nodemailer = require("nodemailer");
const mysqldump = require("mysqldump");
require("dotenv").config();

// TEST LOAD CONFIRM
console.log("Daily Backup Script Loaded");

// EMAIL SETUP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// MAIN BACKUP FUNCTION
async function runBackup() {
  try {
    console.log("BACKUP STARTED...");

    const backupDir = path.join(__dirname, "../../temp");
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    const sqlBackupPath = path.join(backupDir, "mysql.sql");

    // MYSQL BACKUP
    await mysqldump({
      connection: {
        host: "localhost",
        user: "root",
        password: "root", 
        database: "keypoint_db",
      },
      dumpToFile: sqlBackupPath,
    });

    console.log("MySQL Backup Done");

    // ZIP CREATE
    const zipPath = path.join(backupDir, "backup.zip");
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip");

    archive.pipe(output);
    archive.file(sqlBackupPath, { name: "mysql.sql" });
    await archive.finalize();

    console.log("ZIP Created");

    // SEND EMAIL
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "SMARTAN Daily Database Backup",
      text: "Attached is your daily database backup.",
      attachments: [{ path: zipPath }],
    });

    console.log("BACKUP EMAIL SENT ");

    fs.unlinkSync(sqlBackupPath);
    fs.unlinkSync(zipPath);

  } catch (err) {
    console.error("BACKUP FAILED:", err.message);
  }
}

// DAILY AUTO 2 AM BACKUP
cron.schedule("0 2 * * *", runBackup);

// FORCE BACKUP AFTER SERVER START (5 sec)
setTimeout(runBackup, 5000);

module.exports = { runBackup };
