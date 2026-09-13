import { useEffect, useMemo, useState } from "react";
import CourseCard from "../components/CourseCard";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Unable to load courses.");
        setCourses(result.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = useMemo(() => courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "All Levels" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  }), [courses, searchTerm, selectedCategory, selectedLevel]);

  if (loading) return <Loading text="Loading courses..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <>
      <section className="courses-header"><div className="container text-center"><h1 className="fw-bold">Explore Our Courses</h1><p>Learn new skills from expert instructors and take your career to the next level.</p></div></section>
      <section className="py-5"><div className="container">
        <div className="row mb-5">
          <div className="col-lg-6 mb-3 mb-lg-0"><div className="input-group"><span className="input-group-text bg-white"><i className="bi bi-search"></i></span><input type="text" className="form-control" placeholder="Search for courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div></div>
          <div className="col-lg-3 mb-3 mb-lg-0"><select className="form-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}><option>All Categories</option><option>Programming</option><option>Web Development</option><option>Data Science</option><option>Database</option><option>Design</option><option>Cloud Computing</option></select></div>
          <div className="col-lg-3"><select className="form-select" value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}><option>All Levels</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
        </div>
        <div className="mb-4"><h5 className="fw-bold">{filteredCourses.length} Courses Available</h5></div>
        <div className="row g-4">
          {filteredCourses.length > 0 ? filteredCourses.map((course) => <div className="col-lg-4 col-md-6" key={course.id}><CourseCard courseId={course.slug} icon={course.icon} category={course.category} title={course.title} instructor={course.instructor} rating={course.rating} students={course.total_students} price={course.price} /></div>) : <div className="col-12 text-center py-5"><i className="bi bi-search fs-1 text-muted"></i><h4 className="mt-3">No courses found</h4><p className="text-muted">Try changing your search or filters.</p></div>}
        </div>
      </div></section>
    </>
  );
}

function Loading({ text }) { return <section className="py-5"><div className="container text-center"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div><p className="text-muted mt-3">{text}</p></div></section>; }
function ErrorState({ message }) { return <section className="py-5"><div className="container text-center"><div className="alert alert-danger">{message}</div></div></section>; }

export default Courses;
