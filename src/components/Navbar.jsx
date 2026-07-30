import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg sticky-top navbar-light bg-white shadow-sm ">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand fw-bold text-primary" href="#">
          EduLearn
        </a>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#">
                Home
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                Courses
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                About Us
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                Contact
              </a>
            </li>
          </ul>

          {/* Buttons */}
          <div className="d-flex">
            <button className="btn btn-outline-primary me-2">
              Login
            </button>

            <button className="btn btn-primary">
              Register
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;