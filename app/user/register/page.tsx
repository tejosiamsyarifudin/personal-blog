"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Password, SubmitButton } from "@/app/components/FormInput";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
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

        // Validation
        if (!formData.username || !formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registration failed");
                setIsLoading(false);
                return;
            }

            // Redirect to login page after successful registration
            router.push("/user/dashboard?registered=true");
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

                    <h2 className="card-title justify-center text-2xl font-bold">
                        Create Account
                    </h2>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
                                className="input input-bordered w-full"
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="input input-bordered w-full"
                                autoComplete="email"
                            />
                        </div>

                        <div>
                            <Password
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="At least 6 characters"
                                showToggle
                            />
                        </div>

                        <div>
                            <Password
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter password"
                                showToggle
                            />
                        </div>

                        <SubmitButton text="Create Account" isLoading={isLoading} />

                        <div className="text-center mt-4">
                            <Link
                                href="/user/login"
                                className="link link-primary text-sm"
                            >
                                Already have an account? Login here
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}