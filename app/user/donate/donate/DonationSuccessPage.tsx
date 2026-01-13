"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "@/app/components/DashboardLayout";

export default function DonationSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (!sessionId) {
            router.push("/user/donate");
            return;
        }

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    router.push("/user/dashboard");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [sessionId, router]);

    return (
        <DashboardLayout activeMenu="donate">
            <div className="p-6 flex items-center justify-center min-h-[80vh]">
                <div className="card bg-base-100 shadow-2xl w-full max-w-2xl">
                    <div className="card-body items-center text-center">
                        {/* Success Icon */}
                        <div className="bg-success/20 rounded-full p-6 mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-24 w-24 text-success"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>

                        {/* Success Message */}
                        <h1 className="text-4xl font-bold text-success mb-4">
                            Payment Successful!
                        </h1>

                        <p className="text-xl mb-6 text-base-content/80">
                            Thank you for your donation!
                        </p>

                        <div className="bg-base-200 rounded-lg p-6 mb-6 w-full">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-primary"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                    />
                                </svg>
                                <h3 className="text-2xl font-semibold">
                                    Premium Points Added!
                                </h3>
                            </div>
                            <p className="text-base-content/70">
                                Your Premium Points have been added to your account and are ready to use.
                            </p>
                        </div>

                        {/* Information */}
                        <div className="alert alert-info mb-6">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="stroke-current shrink-0 w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div className="text-left">
                                <h3 className="font-bold">What's Next?</h3>
                                <div className="text-sm">
                                    Check your dashboard to see your updated balance. You can now use your Premium Points in the Item Shop!
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <button
                                onClick={() => router.push("/user/dashboard")}
                                className="btn btn-primary flex-1"
                            >
                                Go to Dashboard
                            </button>
                            <button
                                onClick={() => router.push("/user/shop")}
                                className="btn btn-outline btn-primary flex-1"
                            >
                                Visit Item Shop
                            </button>
                        </div>

                        {/* Auto-redirect notice */}
                        <p className="text-sm text-base-content/60 mt-6">
                            Redirecting to dashboard in {countdown} seconds...
                        </p>

                        {/* Session ID (for reference) */}
                        {sessionId && (
                            <div className="mt-6 text-xs text-base-content/40">
                                Transaction ID: {sessionId.slice(0, 20)}...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}