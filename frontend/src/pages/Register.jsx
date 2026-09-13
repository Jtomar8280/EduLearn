import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ full_name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: formData.full_name, email: formData.email, password: formData.password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Registration failed.");
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <section className="auth-section py-5"><div className="container"><div className="row justify-content-center"><div className="col-md-7 col-lg-6"><div className="card border-0 shadow-sm p-4">
    <div className="text-center mb-4"><div className="auth-icon"><i className="bi bi-person-plus"></i></div><h2 className="fw-bold mt-3">Create Your Account</h2><p className="text-muted">Start your learning journey with EduLearn.</p></div>
    {error && <div className="alert alert-danger">{error}</div>}{success && <div className="alert alert-success">{success}</div>}
    <form onSubmit={handleSubmit}>
      <Input label="Full Name" type="text" name="full_name" placeholder="Enter your full name" value={formData.full_name} onChange={handleChange} />
      <Input label="Email Address" type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
      <Input label="Password" type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} />
      <Input label="Confirm Password" type="password" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
      <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Creating Account..." : "Create Account"}</button>
    </form>
    <div className="text-center mt-4"><p className="text-muted mb-0">Already have an account? <Link to="/login" className="text-primary fw-semibold text-decoration-none">Login</Link></p></div>
  </div></div></div></div></section>;
}
function Input({ label, ...props }) { return <div className="mb-3"><label className="form-label fw-semibold">{label}</label><input className="form-control" required {...props} /></div>; }
export default Register;
