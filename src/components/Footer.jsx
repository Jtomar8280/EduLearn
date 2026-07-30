import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">

          {/* Logo */}
          <div className="col-md-4 mb-3">
            <h4 className="fw-bold text-primary">EduLearn</h4>
            <p>Learn Today, Lead Tomorrow.</p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-3">
            <h5>About Us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-white text-decoration-none">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-white text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div className="col-md-4 mb-3">
            <h5>Connect With Us</h5>

            <a href="#" className="text-white me-3 fs-4">
              <i className="bi bi-facebook"></i>
            </a>

            <a href="#" className="text-white me-3 fs-4">
              <i className="bi bi-instagram"></i>
            </a>

            <a href="#" className="text-white me-3 fs-4">
              <i className="bi bi-linkedin"></i>
            </a>

            <a href="#" className="text-white fs-4">
              <i className="bi bi-twitter-x"></i>
            </a>
          </div>

        </div>

        <hr className="border-light" />

        <p className="text-center mb-0">
          © 2026 EduLearn. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;