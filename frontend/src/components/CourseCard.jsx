import { Link } from "react-router-dom";

function CourseCard({ courseId, icon, category, title, instructor, rating, students, price }) {
  return (
    <div className="card course-card border-0 shadow-sm h-100 overflow-hidden">
      <div className="course-image">
        <i className={`bi ${icon}`}></i>
      </div>
      <div className="card-body p-4">
        <span className="badge bg-primary-subtle text-primary mb-3">{category}</span>
        <h5 className="fw-bold mb-2">{title}</h5>
        <p className="text-muted mb-3">
          <i className="bi bi-person me-2"></i>{instructor}
        </p>
        <div className="d-flex align-items-center mb-3">
          <span className="text-warning me-2"><i className="bi bi-star-fill"></i></span>
          <strong>{rating}</strong>
          <span className="text-muted ms-2">({Number(students).toLocaleString()} students)</span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="text-primary fw-bold mb-0">₹{Number(price).toLocaleString("en-IN")}</h5>
          <Link to={`/courses/${courseId}`} className="btn btn-outline-primary">View Course</Link>
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
