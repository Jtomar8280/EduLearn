import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [learningTime, setLearningTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const [coursesResponse, timeResponse] = await Promise.all([
          fetch("http://localhost:5000/api/enrollments/my-courses", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://localhost:5000/api/learning/time", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const coursesResult = await coursesResponse.json();
        const timeResult = await timeResponse.json();
        if (!coursesResponse.ok) throw new Error(coursesResult.message || "Unable to load dashboard.");
        setCourses(coursesResult.data || []);
        if (timeResponse.ok) setLearningTime(Number(timeResult.data?.total_seconds || 0));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [navigate]);

  if (loading) return <Loading />;
  if (error) return <section className="py-5"><div className="container"><div className="alert alert-danger text-center">{error}</div></div></section>;

  const completedCourses = courses.filter((course) => Number(course.progress_percentage) >= 100 || course.status === "completed").length;
  const hours = Math.floor(learningTime / 3600);
  const minutes = Math.floor((learningTime % 3600) / 60);
  const timeLabel = hours ? `${hours}h ${minutes}m` : `${minutes}m`;

  return <section className="py-5"><div className="container">
    <div className="mb-5"><h1 className="fw-bold">Welcome{user?.full_name ? `, ${user.full_name}` : ""}!</h1><p className="text-muted">Continue learning and track your progress.</p></div>
    <div className="row g-4 mb-5">
      <Stat icon="bi-book" value={courses.length} label="Enrolled Courses" />
      <Stat icon="bi-check-circle" value={completedCourses} label="Completed Courses" />
      <Stat icon="bi-clock" value={timeLabel} label="Learning Time" />
    </div>
    <div className="mb-4"><h2 className="fw-bold">My Courses</h2></div>
    <div className="row g-4">
      {courses.length > 0 ? courses.map((course) => <div className="col-lg-6" key={course.enrollment_id}><div className="card border-0 shadow-sm p-4 h-100">
        <div className="d-flex align-items-center"><div className="dashboard-course-icon me-3"><i className={`bi ${course.icon}`}></i></div><div><h5 className="fw-bold mb-1">{course.title}</h5><p className="text-muted mb-2">{course.instructor}</p></div></div>
        <div className="mt-4"><div className="d-flex justify-content-between mb-2"><span className="text-muted">Progress</span><strong>{Number(course.progress_percentage || 0)}%</strong></div><div className="progress"><div className="progress-bar" role="progressbar" style={{ width: `${Number(course.progress_percentage || 0)}%` }} /></div></div>
        <Link to={`/learn/${course.slug}`} className="btn btn-primary mt-4">Continue Learning</Link>
      </div></div>) : <div className="col-12 text-center py-5"><i className="bi bi-book fs-1 text-muted"></i><h4 className="mt-3">No Enrolled Courses</h4><p className="text-muted">Start learning by enrolling in a course.</p><Link to="/courses" className="btn btn-primary">Explore Courses</Link></div>}
    </div>
  </div></section>;
}
function Stat({ icon, value, label }) { return <div className="col-md-4"><div className="card border-0 shadow-sm p-4 h-100"><i className={`bi ${icon} fs-2 text-primary`}></i><h3 className="fw-bold mt-3">{value}</h3><p className="text-muted mb-0">{label}</p></div></div>; }
function Loading() { return <section className="py-5"><div className="container text-center"><div className="spinner-border text-primary" role="status"></div><p className="text-muted mt-3">Loading your dashboard...</p></div></section>; }
export default Dashboard;
