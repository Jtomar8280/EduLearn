const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "EduLearn backend is running successfully!",
  });
});

module.exports = router;
