import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

function Learning() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [resumeLessonId, setResumeLessonId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completing, setCompleting] = useState(false);
  const [progressError, setProgressError] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const sessionLessonRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: `/learn/${courseId}` } });
      return;
    }

    const fetchData = async () => {
      try {
        const [lessonsResponse, progressResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/courses/${courseId}/lessons`),
          fetch(`${import.meta.env.VITE_API_URL}/api/progress/${courseId}`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const lessonsResult = await lessonsResponse.json();
        const progressResult = await progressResponse.json();
        if (!lessonsResponse.ok) throw new Error(lessonsResult.message || "Unable to load lessons.");
        if (!progressResponse.ok) throw new Error(progressResult.message || "Unable to load progress.");

        setLessons(lessonsResult.data || []);
        setProgress(Number(progressResult.data?.progress_percentage || 0));
        setCompletedLessons(progressResult.data?.completed_lesson_ids || []);
        setResumeLessonId(progressResult.data?.last_lesson_id || null);
      } catch (err) {
        console.error("Learning page error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, navigate]);

  useEffect(() => {
    if (!lessons.length) return;
    const resume = resumeLessonId ? lessons.find((lesson) => lesson.id === resumeLessonId) : null;
    setSelectedLesson(resume || lessons[0]);
  }, [lessons, resumeLessonId]);

  const endSession = useCallback(async () => {
    const token = localStorage.getItem("token");
    const currentSessionId = sessionId;
    if (!token || !currentSessionId) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/learning/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ session_id: currentSessionId }),
      });
    } catch (err) {
      console.error("Unable to end learning session:", err);
    } finally {
      setSessionId(null);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!selectedLesson) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    let cancelled = false;
    const startSession = async () => {
      if (sessionLessonRef.current === selectedLesson.id) return;
      await endSession();
      sessionLessonRef.current = selectedLesson.id;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/learning/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ course_id: selectedLesson.course_id, lesson_id: selectedLesson.id }),
        });
        const result = await response.json();
        if (!cancelled && response.ok) setSessionId(result.data.session_id);
      } catch (err) {
        console.error("Unable to start learning session:", err);
      }
    };
    startSession();
    return () => { cancelled = true; };
  }, [selectedLesson, endSession]);

  useEffect(() => () => { endSession(); }, [endSession]);

  const handleComplete = async () => {
    if (!selectedLesson || completing) return;
    setProgressError("");
    const token = localStorage.getItem("token");
    if (!token) {
      setProgressError("Please log in to track your progress.");
      return;
    }
    try {
      setCompleting(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/progress/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ course_id: selectedLesson.course_id, lesson_id: selectedLesson.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to mark lesson complete.");
      setProgress(Number(result.data.progress_percentage));
      setResumeLessonId(Number(result.data.next_lesson_id));
      setCompletedLessons((prev) => prev.includes(selectedLesson.id) ? prev : [...prev, selectedLesson.id]);
    } catch (err) {
      console.error("Progress error:", err);
      setProgressError(err.message);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <Loading text="Loading lessons..." />;
  if (error) return <section className="py-5"><div className="container text-center"><div className="alert alert-danger">{error}</div><Link to="/courses" className="btn btn-primary">Back to Courses</Link></div></section>;

  const isCompleted = selectedLesson && completedLessons.includes(selectedLesson.id);

  return <section className="py-5"><div className="container"><div className="row g-4">
    <div className="col-lg-4"><div className="card border-0 shadow-sm"><div className="card-body">
      <div className="mb-4"><div className="d-flex justify-content-between mb-2"><span className="text-muted">Course Progress</span><strong>{progress}%</strong></div><div className="progress"><div className="progress-bar" role="progressbar" style={{ width: `${progress}%` }} aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100" /></div></div>
      <h4 className="fw-bold mb-4">Course Lessons</h4>
      <div className="list-group">{lessons.map((lesson) => { const completed = completedLessons.includes(lesson.id); return <button type="button" key={lesson.id} className={`list-group-item list-group-item-action ${selectedLesson?.id === lesson.id ? "active" : ""}`} onClick={() => setSelectedLesson(lesson)}><div className="d-flex justify-content-between align-items-center"><span className="d-flex align-items-center gap-2">{completed && <i className={`bi bi-check-circle-fill ${selectedLesson?.id === lesson.id ? "text-white" : "text-success"}`}></i>}<span>{lesson.lesson_order}. {lesson.title}</span></span><small>{lesson.duration} min</small></div></button>; })}</div>
    </div></div></div>
    <div className="col-lg-8">{selectedLesson && <div className="card border-0 shadow-sm"><div className="card-body p-4"><h2 className="fw-bold">{selectedLesson.title}</h2><p className="text-muted mt-3">{selectedLesson.description}</p><div className="lesson-video bg-dark rounded mt-4 d-flex align-items-center justify-content-center"><div className="text-center text-white"><i className="bi bi-play-circle fs-1"></i><p className="mt-3 mb-0">{selectedLesson.video_url ? "Video available for this lesson." : "Lesson video will appear here."}</p></div></div>{progressError && <div className="alert alert-danger mt-4 mb-0">{progressError}</div>}<div className="d-flex justify-content-between align-items-center mt-4"><span className="text-muted">Lesson {selectedLesson.lesson_order}</span><button type="button" className="btn btn-primary" onClick={handleComplete} disabled={completing || isCompleted}>{completing ? "Saving..." : isCompleted ? "Completed" : "Mark as Complete"}</button></div></div></div>}</div>
  </div></div></section>;
}
function Loading({ text }) { return <section className="py-5"><div className="container text-center"><div className="spinner-border text-primary" role="status"></div><p className="text-muted mt-3">{text}</p></div></section>; }
export default Learning;
