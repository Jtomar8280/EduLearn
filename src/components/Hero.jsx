import React from "react";
import heroImage from "../assets/images/hero.jpg";

const Hero = () => {
  return (
    <section
      className="d-flex align-items-center text-white"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "90vh",
      }}
    >
      <div
        className="container"
        style={{
          background: "rgba(0, 0, 0, 0.5)",
          padding: "40px",
          borderRadius: "10px",
        }}
      >
        <div className="row">
          <div className="col-lg-7">
            <h1 className="display-4 fw-bold">
              Learn Today, Lead Tomorrow
            </h1>

            <p className="lead mt-3">
              Join thousands of learners and build your future with
              industry-ready courses.
            </p>

            <div className="mt-4">
              <button className="btn btn-primary btn-lg me-3">
                Explore Courses
              </button>

              <button className="btn btn-outline-light btn-lg">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;