function Footer() {
  return (
    <footer className="bg-dark text-white mt-auto">
      <div className="container py-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h3 className="fw-bold">EduLearn</h3>
            <p className="text-light">Learn. Grow. Succeed.</p>
            <p className="text-secondary">
              Learn new skills from expert instructors and build your future with EduLearn.
            </p>
          </div>
          <div className="col-md-2 mb-4">
            <h5>Platform</h5>
            <p className="text-secondary mb-1">Courses</p>
            <p className="text-secondary mb-1">Instructors</p>
            <p className="text-secondary mb-1">Certificates</p>
          </div>
          <div className="col-md-2 mb-4">
            <h5>Company</h5>
            <p className="text-secondary mb-1">About</p>
            <p className="text-secondary mb-1">Contact</p>
            <p className="text-secondary mb-1">Careers</p>
          </div>
          <div className="col-md-4">
            <h5>Stay Connected</h5>
            <p className="text-secondary">Get updates about new courses and learning opportunities.</p>
            <div className="d-flex gap-3 fs-4">
              <i className="bi bi-facebook"></i>
              <i className="bi bi-instagram"></i>
              <i className="bi bi-linkedin"></i>
              <i className="bi bi-youtube"></i>
            </div>
          </div>
        </div>
        <hr />
        <div className="text-center text-secondary">© 2026 EduLearn. All Rights Reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;
