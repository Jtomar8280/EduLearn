const express = require("express");
const pool = require("../config/database");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.id;
    const courseId = Number(req.body?.course_id);

    if (!Number.isInteger(courseId) || courseId <= 0) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: "A valid course ID is required.",
      });
    }

    await connection.beginTransaction();

    const [courses] = await connection.query(
      "SELECT id, title FROM courses WHERE id = ? LIMIT 1",
      [courseId]
    );

    if (courses.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const [existing] = await connection.query(
      `SELECT id, status FROM enrollments
       WHERE user_id = ? AND course_id = ? LIMIT 1`,
      [userId, courseId]
    );

    if (existing.length > 0) {
      await connection.rollback();
      connection.release();
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course.",
      });
    }

    const [result] = await connection.query(
      `INSERT INTO enrollments (user_id, course_id, status)
       VALUES (?, ?, 'active')`,
      [userId, courseId]
    );

    await connection.query(
      `INSERT INTO course_progress
       (user_id, course_id, completed_lessons, progress_percentage)
       VALUES (?, ?, 0, 0)`,
      [userId, courseId]
    );

    await connection.query(
      `UPDATE courses
       SET total_students = total_students + 1
       WHERE id = ?`,
      [courseId]
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      success: true,
      message: "Successfully enrolled in the course.",
      data: {
        enrollmentId: result.insertId,
        courseId,
        courseTitle: courses[0].title,
      },
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    next(error);
  }
});

router.get("/my-courses", protect, async (req, res, next) => {
  try {
    const [courses] = await pool.query(
      `SELECT
         e.id AS enrollment_id,
         e.status,
         e.enrolled_at,
         e.completed_at,
         c.id AS course_id,
         c.slug,
         c.title,
         c.icon,
         c.price,
         c.level,
         c.duration,
         c.total_lessons,
         u.full_name AS instructor,
         cp.completed_lessons,
         cp.progress_percentage,
         cp.last_lesson_id
       FROM enrollments e
       INNER JOIN courses c ON e.course_id = c.id
       INNER JOIN users u ON c.instructor_id = u.id
       LEFT JOIN course_progress cp
         ON cp.user_id = e.user_id
        AND cp.course_id = e.course_id
       WHERE e.user_id = ?
       ORDER BY e.enrolled_at DESC`,
      [req.user.id]
    );

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
