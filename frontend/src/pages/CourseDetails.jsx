import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function CourseDetails() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enrolling, setEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState("");
  const [enrollmentSuccess, setEnrollmentSuccess] = useState("");
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Course not found.");
        setCourse(result.data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const checkEnrollment = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch("http://localhost:5000/api/enrollments/my-courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) return;
        const result = await response.json();
        const found = result.data?.some((item) => item.slug === courseId);
        setAlreadyEnrolled(Boolean(found));
      } catch {
        // Enrollment state is optional for the public course page.
      }
    };
    checkEnrollment();
  }, [courseId]);

  const handleEnroll = async () => {
    setEnrollmentError("");
    setEnrollmentSuccess("");
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (alreadyEnrolled) {
      navigate(`/learn/${course.slug}`);
      return;
    }
    try {
      setEnrolling(true);
      const response = await fetch("http://localhost:5000/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ course_id: course.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to enroll in this course.");
      setAlreadyEnrolled(true);
      setEnrollmentSuccess("Successfully enrolled in this course!");
      setTimeout(() => navigate(`/learn/${course.slug}`), 700);
    } catch (err) {
      console.error("Enrollment error:", err);
      setEnrollmentError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <Loading text="Loading course..." />;

  if (error || !course) {
    return (
      <section className="py-5"><div className="container text-center">
        <i className="bi bi-exclamation-circle fs-1 text-danger"></i>
        <h2 className="mt-3">Course Not Found</h2>
        <p className="text-muted">{error || "The course you are looking for does not exist."}</p>
        <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
      </div></section>
    );
  }

  return (
    <>
      <section className="course-details-header"><div className="container"><div className="row align-items-center">
        <div className="col-lg-8">
          <span className="badge bg-primary mb-3">{course.category}</span>
          <h1 className="fw-bold">{course.title}</h1>
          <p className="course-description">{course.description}</p>
          <div className="d-flex flex-wrap gap-4 mt-4">
            <span><i className="bi bi-star-fill text-warning me-2"></i><strong>{course.rating}</strong></span>
            <span><i className="bi bi-people me-2"></i>{Number(course.total_students).toLocaleString()} students</span>
            <span><i className="bi bi-person me-2"></i>{course.instructor}</span>
          </div>
        </div>
        <div className="col-lg-4 mt-4 mt-lg-0"><div className="course-preview-card">
          <div className="course-preview-icon"><i className={`bi ${course.icon}`}></i></div>
          <div className="p-4">
            <div className="course-price">₹{Number(course.price).toLocaleString("en-IN")}</div>
            {enrollmentError && <div className="alert alert-danger mt-3 mb-0">{enrollmentError}</div>}
            {enrollmentSuccess && <div className="alert alert-success mt-3 mb-0">{enrollmentSuccess}</div>}
            <button type="button" className="btn btn-primary w-100 mt-3" onClick={handleEnroll} disabled={enrolling}>
              {enrolling ? "Enrolling..." : alreadyEnrolled ? "Continue Learning" : "Enroll Now"}
            </button>
            <p className="text-muted text-center mt-3 mb-0">Start learning today</p>
          </div>
        </div></div>
      </div></div></section>

      <section className="py-5"><div className="container"><div className="row g-5">
        <div className="col-lg-8">
          <div className="mb-5"><h2 className="fw-bold mb-4">What You'll Learn</h2><div className="row g-3">
            {["Understand core concepts", "Build practical projects", "Develop industry-ready skills", "Prepare for real-world projects"].map((item) => <div className="col-md-6" key={item}><div className="learning-point"><i className="bi bi-check-circle-fill"></i><span>{item}</span></div></div>)}
          </div></div>
          <div><h2 className="fw-bold mb-3">Course Description</h2><p className="text-muted">{course.description}</p><p className="text-muted">This course is designed to provide structured learning with practical examples and exercises. You will gradually build your knowledge and apply what you learn through hands-on practice.</p></div>
        </div>
        <div className="col-lg-4"><div className="card border-0 shadow-sm p-4"><h4 className="fw-bold mb-4">Course Details</h4>
          <InfoRow icon="bi-bar-chart" label="Level" value={course.level} />
          <InfoRow icon="bi-clock" label="Duration" value={course.duration} />
          <InfoRow icon="bi-play-circle" label="Lessons" value={`${course.total_lessons} Lessons`} />
          <InfoRow icon="bi-award" label="Certificate" value="Yes" />
        </div></div>
      </div></div></section>
      <section className="pb-5"><div className="container"><Link to="/courses" className="btn btn-outline-primary"><i className="bi bi-arrow-left me-2"></i>Back to Courses</Link></div></section>
    </>
  );
}

function InfoRow({ icon, label, value }) { return <div className="course-info-row"><span><i className={`bi ${icon} me-2`}></i>{label}</span><strong>{value}</strong></div>; }
function Loading({ text }) { return <section className="py-5"><div className="container text-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p className="text-muted mt-3">{text}</p></div></section>; }

export default CourseDetails;
