import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Username, Email, Password, SubmitButton } from "../components/FormInput.jsx";
import { setUser } from "../utils/auth.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validasi
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    // Simulasi register - replace dengan API call yang sebenarnya
    try {
      // Simulasi delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulasi register berhasil
      console.log("Register attempt:", formData);
      
      // Simpan user data (simulasi - replace dengan data dari API)
      const userData = {
        email: formData.email,
        username: formData.username,
      };
      setUser(userData);
      
      // Trigger event untuk update navbar
      window.dispatchEvent(new Event("userLogin"));
      
      // Redirect ke homepage setelah register berhasil (atau bisa tetap ke login jika prefer)
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-6 py-12">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">Join the Adventure</h1>
            <p className="text-base-content/60">Create your account in Cyber World</p>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Username
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
            />

            <Email
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
            />

            <Password
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              showToggle={true}
            />

            <Password
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              showToggle={true}
            />

            <SubmitButton text="Create Account" isLoading={isLoading} />

            <div className="divider">OR</div>

            <div className="text-center">
              <p className="text-sm text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary font-semibold">
                  Login here
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="link link-primary text-sm">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

