const express = require("express");
const cors = require("cors");
require("dotenv").config();

const testRoutes = require("./routes/testRoutes");
const databaseRoutes = require("./routes/databaseRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const progressRoutes = require("./routes/progressRoutes");
const learningRoutes = require("./routes/learningRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "EduLearn API is healthy." });
});

app.use("/api/test", testRoutes);
app.use("/api/database", databaseRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/learning", learningRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
