import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Email, Password, SubmitButton } from "../components/FormInput.jsx";
import { setUser } from "../utils/auth.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    // Simulasi login - replace dengan API call yang sebenarnya
    try {
      // Simulasi delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Validasi sederhana
      if (!formData.email || !formData.password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      // Simulasi login berhasil
      console.log("Login attempt:", formData);
      
      // Simpan user data (simulasi - replace dengan data dari API)
      const userData = {
        email: formData.email,
        username: formData.email.split("@")[0], // Generate username from email
      };
      setUser(userData);
      
      // Trigger event untuk update navbar
      window.dispatchEvent(new Event("userLogin"));
      
      // Redirect ke homepage setelah login berhasil
      navigate("/");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-6 py-12">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">Cyber World Adventure</h1>
            <p className="text-base-content/60">Login to continue your journey</p>
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
              placeholder="Enter your password"
              showToggle={true}
            />

            <div className="flex justify-end">
              <Link to="/forgot-password" className="link link-primary text-sm">
                Forgot password?
              </Link>
            </div>

            <SubmitButton text="Login" isLoading={isLoading} />

            <div className="divider">OR</div>

            <div className="text-center">
              <p className="text-sm text-base-content/60">
                Don't have an account?{" "}
                <Link to="/register" className="link link-primary font-semibold">
                  Register here
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

