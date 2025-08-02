const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db");

const router = express.Router();
const uploadDir = path.resolve(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// restrict to allowed file types
const allowedTypes = ["text/plain", "application/json", "image/png", "image/jpeg", "application/pdf" ];

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Unsupported file type"), false);
  }
});

// Upload file
router.post("/upload", upload.single("file"), (req, res) => {
  const { filename, originalname, mimetype, size } = req.file;

  db.run(
    `INSERT INTO files (filename, originalname, mimetype, size) VALUES (?, ?, ?, ?)`,
    [filename, originalname, mimetype, size],
    function (err) {
      if (err) return res.status(500).json({ error: "DB Error" });
      res.status(200).json({ id: this.lastID });
    }
  );
});

// List files
router.get("/files", (req, res) => {
  db.all(`SELECT * FROM files ORDER BY created_at DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB Error" });
    res.json(rows);
  });
});

// Download file
router.get("/download/:id", (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM files WHERE id = ?`, [id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: "File not found" });
    res.download(path.resolve(uploadDir, row.filename), row.originalname);
  });
});

module.exports = router;
