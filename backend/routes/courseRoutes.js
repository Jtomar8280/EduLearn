const express = require("express");
const pool = require("../config/database");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { search = "", category = "", level = "" } = req.query;

    let query = `
      SELECT
        c.id,
        c.slug,
        c.title,
        c.description,
        c.icon,
        c.price,
        c.level,
        c.duration,
        c.total_lessons,
        c.rating,
        c.total_students,
        cat.name AS category,
        u.full_name AS instructor
      FROM courses c
      INNER JOIN categories cat ON c.category_id = cat.id
      INNER JOIN users u ON c.instructor_id = u.id
      WHERE 1 = 1
    `;

    const params = [];

    if (search.trim()) {
      query += " AND c.title LIKE ?";
      params.push(`%${search.trim()}%`);
    }

    if (category.trim()) {
      query += " AND cat.name = ?";
      params.push(category.trim());
    }

    if (level.trim()) {
      query += " AND c.level = ?";
      params.push(level.trim());
    }

    query += " ORDER BY c.id ASC";

    const [courses] = await pool.query(query, params);

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug/lessons", async (req, res, next) => {
  try {
    const [lessons] = await pool.query(
      `SELECT
         l.id,
         l.course_id,
         l.title,
         l.description,
         l.video_url,
         l.lesson_order,
         l.duration
       FROM lessons l
       INNER JOIN courses c ON l.course_id = c.id
       WHERE c.slug = ?
       ORDER BY l.lesson_order ASC`,
      [req.params.slug]
    );

    if (lessons.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No lessons found for this course.",
      });
    }

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const [courses] = await pool.query(
      `SELECT
         c.id,
         c.slug,
         c.title,
         c.description,
         c.icon,
         c.price,
         c.level,
         c.duration,
         c.total_lessons,
         c.rating,
         c.total_students,
         cat.name AS category,
         u.full_name AS instructor
       FROM courses c
       INNER JOIN categories cat ON c.category_id = cat.id
       INNER JOIN users u ON c.instructor_id = u.id
       WHERE c.slug = ?
       LIMIT 1`,
      [req.params.slug]
    );

    if (courses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: courses[0],
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
