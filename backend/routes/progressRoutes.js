const express = require("express");
const pool = require("../config/database");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/complete", protect, async (req, res, next) => {
  const connection = await pool.getConnection();

  try {
    const userId = req.user.id;
    const courseId = Number(req.body?.course_id);
    const lessonId = Number(req.body?.lesson_id);

    if (!Number.isInteger(courseId) || !Number.isInteger(lessonId)) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: "Course ID and lesson ID are required.",
      });
    }

    await connection.beginTransaction();

    const [enrollments] = await connection.query(
      `SELECT id FROM enrollments
       WHERE user_id = ? AND course_id = ? AND status = 'active'
       LIMIT 1`,
      [userId, courseId]
    );

    if (enrollments.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(403).json({
        success: false,
        message: "You are not enrolled in this course.",
      });
    }

    const [lessons] = await connection.query(
      `SELECT id FROM lessons
       WHERE id = ? AND course_id = ? LIMIT 1`,
      [lessonId, courseId]
    );

    if (lessons.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({
        success: false,
        message: "Lesson not found for this course.",
      });
    }

    const [progressRows] = await connection.query(
      `SELECT completed_lessons
       FROM course_progress
       WHERE user_id = ? AND course_id = ? LIMIT 1`,
      [userId, courseId]
    );

    let completedLessons = progressRows.length > 0
      ? Number(progressRows[0].completed_lessons)
      : 0;

    const [completedRows] = await connection.query(
      `SELECT id FROM lesson_completions
       WHERE user_id = ? AND lesson_id = ? LIMIT 1`,
      [userId, lessonId]
    );

    if (completedRows.length === 0) {
      await connection.query(
        `INSERT INTO lesson_completions
         (user_id, lesson_id, course_id)
         VALUES (?, ?, ?)`,
        [userId, lessonId, courseId]
      );
      completedLessons += 1;
    }

    const [lessonCountRows] = await connection.query(
      `SELECT COUNT(*) AS total_lessons
       FROM lessons WHERE course_id = ?`,
      [courseId]
    );

    const totalLessons = Number(lessonCountRows[0].total_lessons);
    const progressPercentage = totalLessons > 0
      ? Math.min(100, Number(((completedLessons / totalLessons) * 100).toFixed(2)))
      : 0;

    const [nextLessonRows] = await connection.query(
      `SELECT l.id
       FROM lessons l
       WHERE l.course_id = ?
         AND NOT EXISTS (
           SELECT 1
           FROM lesson_completions lc
           WHERE lc.user_id = ?
             AND lc.lesson_id = l.id
         )
       ORDER BY l.lesson_order ASC
       LIMIT 1`,
      [courseId, userId]
    );

    const nextLessonId = nextLessonRows.length > 0
      ? nextLessonRows[0].id
      : lessonId;

    await connection.query(
      `INSERT INTO course_progress
       (user_id, course_id, completed_lessons, progress_percentage, last_lesson_id)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         completed_lessons = VALUES(completed_lessons),
         progress_percentage = VALUES(progress_percentage),
         last_lesson_id = VALUES(last_lesson_id)`,
      [userId, courseId, completedLessons, progressPercentage, nextLessonId]
    );

    if (progressPercentage >= 100) {
      await connection.query(
        `UPDATE enrollments
         SET status = 'completed', completed_at = CURRENT_TIMESTAMP
         WHERE user_id = ? AND course_id = ?`,
        [userId, courseId]
      );
    }

    await connection.commit();
    connection.release();

    res.status(200).json({
      success: true,
      message: "Lesson marked as complete.",
      data: {
        course_id: courseId,
        lesson_id: lessonId,
        completed_lessons: completedLessons,
        total_lessons: totalLessons,
        progress_percentage: progressPercentage,
        next_lesson_id: nextLessonId,
      },
    });
  } catch (error) {
    await connection.rollback();
    connection.release();
    next(error);
  }
});

router.get("/:courseSlug", protect, async (req, res, next) => {
  try {
    const [courses] = await pool.query(
      "SELECT id FROM courses WHERE slug = ? LIMIT 1",
      [req.params.courseSlug]
    );

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const courseId = courses[0].id;

    const [progressRows] = await pool.query(
      `SELECT completed_lessons, progress_percentage, last_lesson_id
       FROM course_progress
       WHERE user_id = ? AND course_id = ? LIMIT 1`,
      [req.user.id, courseId]
    );

    const [completedRows] = await pool.query(
      `SELECT lesson_id
       FROM lesson_completions
       WHERE user_id = ? AND course_id = ?
       ORDER BY lesson_id ASC`,
      [req.user.id, courseId]
    );

    res.status(200).json({
      success: true,
      data: {
        completed_lessons: progressRows.length > 0
          ? Number(progressRows[0].completed_lessons)
          : 0,
        progress_percentage: progressRows.length > 0
          ? Number(progressRows[0].progress_percentage)
          : 0,
        last_lesson_id: progressRows.length > 0
          ? progressRows[0].last_lesson_id
          : null,
        completed_lesson_ids: completedRows.map((row) => row.lesson_id),
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
