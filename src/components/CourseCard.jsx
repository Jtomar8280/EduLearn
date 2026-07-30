import React from "react";

const CourseCard = ({ image, title, instructor, duration, rating }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow">
        <img
          src={image}
          className="card-img-top"
          alt={title}
          style={{ height: "220px", objectFit: "cover" }}
        />

        <div className="card-body">
          <h5 className="card-title">{title}</h5>

          <p className="card-text">
            <strong>Instructor:</strong> {instructor}
          </p>

          <p className="card-text">
            <strong>Duration:</strong> {duration}
          </p>


          <button className="btn btn-primary w-100">
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;