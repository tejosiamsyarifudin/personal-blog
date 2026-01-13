"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Password, SubmitButton } from "@/app/components/FormInput";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("adminUser", JSON.stringify(data));
      router.push("/admin/dashboard");
    } catch {
      setError("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-6">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body">
          <div className="flex justify-center">
            <img src="/logo.png" alt="Logo" className="h-40 w-auto" />
          </div>
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="input input-bordered w-full"
            />

            <Password
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              showToggle
            />

            <SubmitButton text="Login" isLoading={isLoading} />
          </form>
        </div>
      </div>
    </div>
  );
}
