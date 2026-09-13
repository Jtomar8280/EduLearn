import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Login failed.");
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
      const target = location.state?.from || "/dashboard";
      navigate(target, { replace: true });
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <section className="auth-section py-5"><div className="container"><div className="row justify-content-center"><div className="col-md-6 col-lg-5"><div className="card border-0 shadow-sm p-4">
    <div className="text-center mb-4"><div className="auth-icon"><i className="bi bi-person-circle"></i></div><h2 className="fw-bold mt-3">Welcome Back</h2><p className="text-muted">Login to continue your learning journey.</p></div>
    {error && <div className="alert alert-danger">{error}</div>}
    <form onSubmit={handleSubmit}>
      <div className="mb-3"><label className="form-label fw-semibold">Email Address</label><input type="email" name="email" className="form-control" placeholder="Enter your email" value={formData.email} onChange={handleChange} required /></div>
      <div className="mb-3"><label className="form-label fw-semibold">Password</label><input type="password" name="password" className="form-control" placeholder="Enter your password" value={formData.password} onChange={handleChange} required /></div>
      <div className="d-flex justify-content-between align-items-center mb-4"><div className="form-check"><input className="form-check-input" type="checkbox" id="rememberMe" /><label className="form-check-label" htmlFor="rememberMe">Remember me</label></div><span className="text-primary">Forgot Password?</span></div>
      <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
    </form>
    <div className="text-center mt-4"><p className="text-muted mb-0">Don't have an account? <Link to="/register" className="text-primary fw-semibold text-decoration-none">Create Account</Link></p></div>
  </div></div></div></div></section>;
}

export default Login;
