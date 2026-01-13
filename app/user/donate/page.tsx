"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";

const donationPackages = [
    { premium: 50, price: 5, popular: false, bonus: 0 },
    { premium: 100, price: 10, popular: false, bonus: 0 },
    { premium: 300, price: 30, popular: false, bonus: 0 },
    { premium: 500, price: 50, popular: true, bonus: 30 },
    { premium: 700, price: 70, popular: false, bonus: 30 },
    { premium: 1000, price: 100, popular: false, bonus: 30 },
];

export default function DonatePage() {
    const [loading, setLoading] = useState<number | null>(null);

    const handleDonate = async (premium: number, price: number, index: number, bonus: number) => {
        setLoading(index);

        // Calculate total premium with bonus
        const totalPremium = Math.floor(premium + (premium * bonus / 100));

        try {
            const response = await fetch("/api/payment/create-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    premium: totalPremium,
                    basePremium: premium,
                    bonus: bonus,
                    amount: price,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create checkout session");
            }

            const data = await response.json();

            // Redirect to Stripe Checkout
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (err) {
            console.error("Payment error:", err);
            alert("Failed to initiate payment. Please try again.");
        } finally {
            setLoading(null);
        }
    };

    return (
        <DashboardLayout activeMenu="donate">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold mb-1">Support the Server</h1>
                    <p className="text-sm text-base-content/60">
                        Purchase Premium Points to unlock premium features and support server development
                    </p>
                </div>

                {/* Benefits Section */}
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body p-6">
                        <h2 className="card-title text-xl mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            What are Premium Points?
                        </h2>
                        <p className="text-sm text-base-content/70 mb-3">
                            Premium Points are the premium currency used to purchase exclusive items, upgrades, and features in-game.
                        </p>

                        {/* Bonus Alert */}
                        <div className="alert alert-success mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-semibold">🎁 Get +30% Bonus Premium Points on packages $50 and above!</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-sm">Exclusive Items</h3>
                                    <p className="text-xs text-base-content/60">Access premium shop items</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-sm">Character Upgrades</h3>
                                    <p className="text-xs text-base-content/60">Enhance your character's abilities</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-sm">Support Development</h3>
                                    <p className="text-xs text-base-content/60">Help keep the server running</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Donation Packages */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">Choose Your Package</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {donationPackages.map((pkg, index) => {
                            const totalPremium = Math.floor(pkg.premium + (pkg.premium * pkg.bonus / 100));
                            const hasBonus = pkg.bonus > 0;

                            return (
                                <div
                                    key={index}
                                    className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all relative ${pkg.popular ? 'ring-2 ring-primary' : ''
                                        }`}
                                >
                                    {pkg.popular && (
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                                            <span className="badge badge-primary badge-sm">Popular</span>
                                        </div>
                                    )}
                                    {hasBonus && (
                                        <div className="absolute top-2 right-2 z-10">
                                            <span className="badge badge-success badge-sm">+{pkg.bonus}%</span>
                                        </div>
                                    )}
                                    <div className="card-body p-4 items-center text-center">
                                        <div className="bg-primary/10 rounded-full p-2 mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                            </svg>
                                        </div>
                                        {hasBonus ? (
                                            <>
                                                <h3 className="text-xl font-bold text-primary">
                                                    {totalPremium.toLocaleString()}
                                                </h3>
                                                <p className="text-xs text-base-content/60 mb-1">
                                                    <span className="line-through text-base-content/40">{pkg.premium.toLocaleString()}</span>
                                                    {" "}Premium
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="text-xl font-bold text-primary">
                                                    {pkg.premium.toLocaleString()}
                                                </h3>
                                                <p className="text-xs text-base-content/60 mb-1">Premium</p>
                                            </>
                                        )}
                                        <div className="text-2xl font-bold mb-2">
                                            ${pkg.price}
                                        </div>
                                        <button
                                            onClick={() => handleDonate(pkg.premium, pkg.price, index, pkg.bonus)}
                                            disabled={loading !== null}
                                            className={`btn btn-primary btn-sm w-full ${loading === index ? 'loading' : ''
                                                }`}
                                        >
                                            {loading === index ? (
                                                <span className="loading loading-spinner loading-xs"></span>
                                            ) : (
                                                'Buy'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="card bg-base-100 shadow-xl mb-6">
                    <div className="card-body p-6">
                        <h2 className="card-title text-xl mb-3">Frequently Asked Questions</h2>
                        <div className="space-y-2">
                            <div className="collapse collapse-plus bg-base-200">
                                <input type="radio" name="faq-accordion" defaultChecked />
                                <div className="collapse-title text-sm font-medium">
                                    How do I receive my Premium Points?
                                </div>
                                <div className="collapse-content">
                                    <p className="text-xs text-base-content/70">
                                        Premium Points are automatically added to your account within 5 minutes after successful payment.
                                        You can check your balance on the dashboard.
                                    </p>
                                </div>
                            </div>
                            <div className="collapse collapse-plus bg-base-200">
                                <input type="radio" name="faq-accordion" />
                                <div className="collapse-title text-sm font-medium">
                                    What payment methods are accepted?
                                </div>
                                <div className="collapse-content">
                                    <p className="text-xs text-base-content/70">
                                        We accept all major credit cards, debit cards, and digital wallets through our secure
                                        Stripe payment processor.
                                    </p>
                                </div>
                            </div>
                            <div className="collapse collapse-plus bg-base-200">
                                <input type="radio" name="faq-accordion" />
                                <div className="collapse-title text-sm font-medium">
                                    Can I get a refund?
                                </div>
                                <div className="collapse-content">
                                    <p className="text-xs text-base-content/70">
                                        Due to the digital nature of Premium Points, refunds are only available in exceptional circumstances.
                                        Please contact support if you experience any issues.
                                    </p>
                                </div>
                            </div>
                            <div className="collapse collapse-plus bg-base-200">
                                <input type="radio" name="faq-accordion" />
                                <div className="collapse-title text-sm font-medium">
                                    Is my payment information secure?
                                </div>
                                <div className="collapse-content">
                                    <p className="text-xs text-base-content/70">
                                        Yes! All payments are processed securely through Stripe. We never store your payment
                                        information on our servers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <h3 className="font-bold text-sm">Need Help?</h3>
                        <div className="text-xs">Contact our support team if you have any questions or issues with your purchase.</div>
                    </div>
                    <button className="btn btn-sm">Contact Support</button>
                </div>
            </div>
        </DashboardLayout>
    );
}