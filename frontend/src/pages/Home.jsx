import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Counter from "../components/Counter";

const featuredCourses = [
  { courseId: "java-programming", icon: "bi-cup-hot", category: "Programming", title: "Complete Java Programming", instructor: "Rahul Sharma", rating: 4.8, students: 2450, price: 999 },
  { courseId: "react-development", icon: "bi-code-square", category: "Web Development", title: "Modern React Development", instructor: "Ananya Patel", rating: 4.9, students: 1850, price: 799 },
  { courseId: "python-data-science", icon: "bi-bar-chart", category: "Data Science", title: "Python & Data Science", instructor: "Amit Verma", rating: 4.7, students: 3120, price: 899 },
];

function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="container text-center">
          <h1 className="hero-title">Learn Today. Build Your Future.</h1>
          <p className="hero-description">Learn from expert instructors and develop skills that matter for your career.</p>
          <div className="mt-4">
            <Link to="/courses" className="btn btn-primary btn-lg px-4 me-2">Explore Courses</Link>
            <Link to="/register" className="btn btn-outline-primary btn-lg px-4">Get Started</Link>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Popular Categories</h2>
            <p className="text-muted">Explore courses designed to help you build in-demand skills.</p>
          </div>
          <div className="row g-4">
            {[
              ["bi-code-slash", "Web Development", "Learn modern web technologies."],
              ["bi-cup-hot", "Java Programming", "Master Java from basics to advanced."],
              ["bi-bar-chart", "Data Science", "Learn data analysis and machine learning."],
              ["bi-palette", "UI/UX Design", "Create modern and user-friendly designs."],
            ].map(([icon, title, description]) => (
              <div className="col-md-3" key={title}>
                <div className="card category-card border-0 shadow-sm h-100 text-center p-4">
                  <i className={`bi ${icon} fs-1 text-primary`}></i>
                  <h5 className="mt-3">{title}</h5>
                  <p className="text-muted">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Featured Courses</h2>
            <p className="text-muted">Learn from industry experts and build skills that can accelerate your career.</p>
          </div>
          <div className="row g-4">
            {featuredCourses.map((course) => (
              <div className="col-lg-4 col-md-6" key={course.courseId}>
                <CourseCard {...course} />
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link className="btn btn-primary px-4" to="/courses">View All Courses <i className="bi bi-arrow-right ms-2"></i></Link>
          </div>
        </div>
      </section>

      <section className="why-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Why Choose EduLearn?</h2>
            <p className="text-muted">Everything you need to learn new skills and grow your career.</p>
          </div>
          <div className="row g-4">
            {[
              ["bi-person-check", "Expert Instructors", "Learn from experienced professionals and industry experts."],
              ["bi-play-circle", "Learn at Your Own Pace", "Learn whenever you want and progress through courses at your own pace."],
              ["bi-award", "Earn Certificates", "Complete courses and earn certificates to showcase your skills."],
              ["bi-phone", "Learn Anywhere", "Access your courses from any device and continue learning wherever you are."],
            ].map(([icon, title, description]) => (
              <div className="col-md-3" key={title}>
                <div className="feature-box text-center h-100">
                  <div className="feature-icon"><i className={`bi ${icon}`}></i></div>
                  <h5 className="fw-bold mt-4">{title}</h5>
                  <p className="text-muted">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-section py-5">
        <div className="container">
          <div className="row text-center">
            {[[10000, "Active Students"], [500, "Courses"], [100, "Expert Instructors"], [50, "Learning Categories"]].map(([count, label]) => (
              <div className="col-md-3 mb-4 mb-md-0" key={label}>
                <div className="stat-number"><Counter count={count} /></div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">What Our Students Say</h2>
            <p className="text-muted">Hear from learners who are building their careers with EduLearn.</p>
          </div>
          <div className="row g-4">
            {[
              ["Ankit Sharma", "Java Developer", "EduLearn helped me improve my programming skills and gave me the confidence to prepare for technical interviews."],
              ["Priya Shah", "Frontend Developer", "The courses are easy to understand and the learning experience is very smooth. I especially liked the practical projects."],
              ["Rohan Verma", "Data Analyst", "I was able to learn Data Science step by step. The structured courses made it much easier for me to stay consistent."],
            ].map(([name, role, text]) => (
              <div className="col-md-4" key={name}>
                <div className="card testimonial-card border-0 shadow-sm h-100 p-4">
                  <div className="mb-3 text-warning">★★★★★</div>
                  <p className="text-muted">“{text}”</p>
                  <div className="d-flex align-items-center mt-auto">
                    <div className="testimonial-avatar">{name.split(" ").map((x) => x[0]).join("")}</div>
                    <div className="ms-3"><h6 className="fw-bold mb-0">{name}</h6><small className="text-muted">{role}</small></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section py-5">
        <div className="container"><div className="cta-box text-center">
          <h2 className="fw-bold">Ready to Start Learning?</h2>
          <p>Join thousands of learners and start building skills for your future today.</p>
          <Link className="btn btn-light btn-lg px-4" to="/register">Start Learning <i className="bi bi-arrow-right ms-2"></i></Link>
        </div></div>
      </section>
    </>
  );
}

export default Home;
