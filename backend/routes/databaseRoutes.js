const express = require("express");
const pool = require("../config/database");

const router = express.Router();

router.get("/test", async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS result");

    res.status(200).json({
      success: true,
      message: "Database connection successful!",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
