const express = require("express");
const router = express.Router();
const mysql = require("mysql2");

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "NewPassword123!",
  database: "ecommerce_db"
});

db.connect((err) => {
  if (err) console.error("DB error:", err);
  else console.log("Connected to MySQL - products");
});

// ✔ GET all products or filtered by category
router.get("/", (req, res) => {
  const category = req.query.category;
  let query = "SELECT * FROM products";
  let values = [];

  if (category) {
    query += " WHERE main_category = ?";
    values.push(category);
  }

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: "Failed to load products" });
    res.json(results);
  });
});

// ✔ GET single product page
router.get("/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM products WHERE uniq_id = ?";

  db.query(query, [id], (err, results) => {
    if (err || results.length === 0)
      return res.status(404).json({ error: "Product not found" });

    res.json(results[0]);
  });
});

module.exports = router;
