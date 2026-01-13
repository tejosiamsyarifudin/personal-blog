"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/app/components/DashboardLayout";

export default function UserDashboard() {
    const [stats, setStats] = useState({
        totalCharacters: 3,
        activePlayers: 1247,
        premium: 0,
        premiumStatus: 0
    });
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [username, setUsername] = useState("");

    // Callback when user is loaded from DashboardLayout
    const handleUserLoaded = (user: any) => {
        setUsername(user.Username);
        // Fetch Premium balance separately
        fetchPremiumBalance();
    };

    // Fetch Premium balance from API
    const fetchPremiumBalance = async () => {
        try {
            const res = await fetch("/api/user/balance", {
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                setStats(prev => ({
                    ...prev,
                    premium: data.premium || 0,
                }));
            }
        } catch (err) {
            console.error("Failed to fetch premium balance:", err);
        }
    };

    useEffect(() => {
        // Update time every second
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <DashboardLayout activeMenu="dashboard" onUserLoaded={handleUserLoaded}>
            <div className="p-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {username}!</h1>
                    <p className="text-base-content/60">Here's what's happening with your account today.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="stats shadow bg-base-100">
                        <div className="stat">
                            <div className="stat-figure text-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                            </div>
                            <div className="stat-title">Characters</div>
                            <div className="stat-value text-primary">{stats.totalCharacters}</div>
                            <div className="stat-desc">Total characters</div>
                        </div>
                    </div>

                    <div className="stats shadow bg-base-100">
                        <div className="stat">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <div className="stat-title">Players Online</div>
                            <div className="stat-value text-secondary">{stats.activePlayers.toLocaleString()}</div>
                            <div className="stat-desc">Currently active</div>
                        </div>
                    </div>

                    <div className="stats shadow bg-base-100">
                        <div className="stat">
                            <div className="stat-figure text-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div className="stat-title">Premium Points</div>
                            <div className="stat-value text-accent">{stats.premium}</div>
                            <div className="stat-desc">Premium currency</div>
                        </div>
                    </div>

                    <div className="stats shadow bg-base-100">
                        <div className="stat">
                            <div className="stat-figure text-warning">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                                </svg>
                            </div>
                            <div className="stat-title">Premium Status</div>
                            <div className="stat-value text-warning">{stats.premiumStatus === 1 ? 'Active' : 'Inactive'}</div>
                            <div className="stat-desc">{stats.premiumStatus === 1 ? 'Member' : 'Upgrade'}</div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Recent Activity</h2>
                            <div className="overflow-x-auto">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Activity</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Dec 24, 2025</td>
                                            <td>Logged in</td>
                                            <td><span className="badge badge-success">Success</span></td>
                                        </tr>
                                        <tr>
                                            <td>Dec 23, 2025</td>
                                            <td>Character created</td>
                                            <td><span className="badge badge-info">Info</span></td>
                                        </tr>
                                        <tr>
                                            <td>Dec 22, 2025</td>
                                            <td>Quest completed</td>
                                            <td><span className="badge badge-success">Success</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Server Info */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Server Status</h2>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">Status</span>
                                        <span className="badge badge-success">Online</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">Server Time</span>
                                        <span className="text-sm">{currentTime}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">Uptime</span>
                                        <span className="text-sm">99.9%</span>
                                    </div>
                                </div>
                                <div className="divider"></div>
                                <button className="btn btn-primary w-full">
                                    Download Client
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}