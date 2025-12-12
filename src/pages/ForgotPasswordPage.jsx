import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Email, SubmitButton } from "../components/FormInput.jsx";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);
    setIsLoading(true);

    // Validasi
    if (!formData.email) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    // Simulasi reset password - replace dengan API call yang sebenarnya
    try {
      // Simulasi delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulasi berhasil mengirim email reset
      console.log("Password reset requested for:", formData.email);
      setSuccess(true);
      
      // Optional: Redirect setelah beberapa detik
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-6 py-12">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-2">Forgot Password?</h1>
            <p className="text-base-content/60">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
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

          {success && (
            <div className="alert alert-success mb-4">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                Password reset email sent! Please check your inbox. Redirecting to login...
              </span>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Email
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />

              <SubmitButton text="Send Reset Link" isLoading={isLoading} />

              <div className="divider">OR</div>

              <div className="text-center">
                <p className="text-sm text-base-content/60">
                  Remember your password?{" "}
                  <Link to="/login" className="link link-primary font-semibold">
                    Back to login
                  </Link>
                </p>
              </div>
            </form>
          )}

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

