# 🧠 SMARTAN – Pose Extraction & Keypoint Storage System

SMARTAN is a full-stack backend system that extracts human pose keypoints from images using **Python + MediaPipe**, sends them to a **Node.js backend**, and stores them in both **MongoDB** (image metadata) and **MySQL** (structured pose data).
It also includes a **daily automated backup system** using Node-Cron + Email delivery.

---

## 🚀 Features

* Upload an image → extract pose keypoints (33 body keypoints)
* Python Mediapipe service processes the image
* Node.js forwards Python output to databases
* Stores:

  * Raw extracted response in **MongoDB**
  * Keypoints + metadata in **MySQL**
* **Automatic Daily Database Backups** emailed via Gmail App Password
* Clean modular backend structure
* Fully working Postman-tested API

---

## 🛠 Tech Stack

### **Backend**

* Node.js
* Express.js
* Multer (file upload)
* Python (MediaPipe pose model)
* MySQL + Sequelize ORM
* MongoDB + Mongoose
* Node-Cron
* Nodemailer
* Archiver (Zip backups)

### **AI / Vision**

* MediaPipe Pose (Python)

---

## 📂 Folder Structure

```
SMARTAN/
│
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── mongo.js
│   │   │   ├── sql.js
│   │   ├── models/
│   │   ├── routes/
│   │   │   └── poseRoutes.js
│   │   ├── utils/
│   │   │   └── dailyBackup.js
│   │   ├── uploads/
│   │   ├── temp/
│   │   └── index.js
│   ├── package.json
│   └── .env
│
├── mediapipe-service/
│   ├── pose_extractor.py
│   ├── venv/
│   └── requirements.txt
│
├── database_dumps/
│   ├── mysql.sql
│   └── mongodb.json
│
└── README.md
```

---

# ⚙️ Setup Instructions

---

## 1️⃣ Clone the Repository

```
git clone https://github.com/yourusername/SMARTAN.git
cd SMARTAN/backend
```

---

## 2️⃣ Install Node Dependencies

```
npm install
```

---

## 3️⃣ Setup Python Virtual Environment

```
cd mediapipe-service
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
```

---

## 4️⃣ Create `.env` File

Inside `/backend/` create a `.env` file:

```
MONGO_URI=mongodb://127.0.0.1:27017/smartan
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your-app-password
```

⚠️ Use Gmail **App Password**, not your login password.

---

## 5️⃣ Setup MySQL Database

Run in MySQL console:

```sql
CREATE DATABASE keypoint_db;
```

A `poses` table will be created automatically by Sequelize:

| Field             | Type         |
| ----------------- | ------------ |
| id                | int (PK)     |
| image_mongo_id    | varchar(100) |
| keypoints         | JSON         |
| original_filename | varchar(255) |
| pose_type         | varchar(50)  |
| created_at        | timestamp    |

---

## 6️⃣ Start Node.js Backend

```
cd backend
nodemon src/index.js
```

Output should show:

```
✅ Server started on port 5000
✅ MongoDB Connected Successfully
✅ MySQL Connected Successfully
```

---

## 7️⃣ Test Pose Extraction API (Postman)

### **POST** `/extract-pose`

Body → form-data:

| Key   | Type | Value          |
| ----- | ---- | -------------- |
| image | File | yourimage.jpeg |

### ✔ Expected Output (Example)

```json
{
  "total_keypoints": 33,
  "keypoints": [
    { "id": 0, "x": 0.39, "y": 0.57, "z": -0.72, "visibility": 0.70 },
    ...
  ]
}
```

---

# 🤖 Python Pose Extractor (MediaPipe)

```
python pose_extractor.py input.jpg
```

Produces:

```
{
 "total_keypoints": 33,
 "keypoints": [...]
}
```

Use this screenshot in README.

---

# ⏰ Daily Cron Backup (2 AM Auto Backup)

### The backup includes:

✔ MySQL dump
✔ MongoDB JSON export
✔ Zipped
✔ E-mailed automatically

### Cron Schedule

Runs every day at **2:00 AM**:

```js
cron.schedule("0 2 * * *", async () => {
```

### Backup Email Example

Subject:

```
SMARTAN Daily Database Backup
```

Attachment:
`backup.zip`

---

# 📨 Email Backup Setup

Uses Nodemailer:

```js
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
```

Make sure 2-Step Verification is ON and App Password is generated.

---

# 🗄 Sample DB Dumps

Include inside:

```
database_dumps/mysql.sql
database_dumps/mongodb.json
```
---

# 🧪 Example Screenshots to Add in README
<img width="940" height="442" alt="image" src="https://github.com/user-attachments/assets/8d787e1f-23f1-4d6c-b7ac-d6e093cb8502" />
<img width="940" height="239" alt="image" src="https://github.com/user-attachments/assets/a4beb5a5-6a34-44f7-87e1-01b5ab59ab6b" />
<img width="940" height="908" alt="image" src="https://github.com/user-attachments/assets/bdd94ed8-f3a7-494b-9577-37dc423456a7" />
<img width="940" height="423" alt="image" src="https://github.com/user-attachments/assets/70b67304-5690-46cb-a574-3a884c8e000b" />
<img width="940" height="724" alt="image" src="https://github.com/user-attachments/assets/fef876c2-8d4e-46e1-a725-773491ebff67" />


This project includes:

✔ Full Node.js Backend
✔ Python MediaPipe Pose Model
✔ Dual Database System
✔ Auto Backup with Email
✔ Full API + Documentation
