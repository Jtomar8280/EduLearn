const express = require("express");
const pool = require("../config/database");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/start", protect, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const courseId = Number(req.body?.course_id);
    const lessonId = Number(req.body?.lesson_id);

    if (!Number.isInteger(courseId) || !Number.isInteger(lessonId)) {
      return res.status(400).json({
        success: false,
        message: "Course ID and lesson ID are required.",
      });
    }

    const [enrollment] = await pool.query(
      `SELECT id FROM enrollments
       WHERE user_id = ? AND course_id = ?
       LIMIT 1`,
      [userId, courseId]
    );

    if (enrollment.length === 0) {
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course.",
      });
    }

    const [lesson] = await pool.query(
      `SELECT id FROM lessons
       WHERE id = ? AND course_id = ? LIMIT 1`,
      [lessonId, courseId]
    );

    if (lesson.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found for this course.",
      });
    }

    const [result] = await pool.query(
      `INSERT INTO learning_sessions
       (user_id, course_id, lesson_id, started_at)
       VALUES (?, ?, ?, NOW())`,
      [userId, courseId, lessonId]
    );

    res.status(201).json({
      success: true,
      data: { session_id: result.insertId },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/end", protect, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const sessionId = Number(req.body?.session_id);

    if (!Number.isInteger(sessionId)) {
      return res.status(400).json({
        success: false,
        message: "Session ID is required.",
      });
    }

    const [result] = await pool.query(
      `UPDATE learning_sessions
       SET ended_at = NOW(),
           duration_seconds = GREATEST(0, TIMESTAMPDIFF(SECOND, started_at, NOW()))
       WHERE id = ? AND user_id = ? AND ended_at IS NULL`,
      [sessionId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Active learning session not found.",
      });
    }

    const [rows] = await pool.query(
      `SELECT duration_seconds FROM learning_sessions
       WHERE id = ? LIMIT 1`,
      [sessionId]
    );

    res.status(200).json({
      success: true,
      data: {
        session_id: sessionId,
        duration_seconds: rows[0]?.duration_seconds || 0,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/time", protect, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT COALESCE(SUM(duration_seconds), 0) AS total_seconds
       FROM learning_sessions
       WHERE user_id = ?`,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      data: {
        total_seconds: Number(rows[0].total_seconds),
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
