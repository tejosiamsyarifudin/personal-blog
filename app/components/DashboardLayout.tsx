"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
    Id: number;
    Username: string;
    AccessLevel: number;
    Silk?: number;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    activeMenu?: string;
    onUserLoaded?: (user: User) => void;
}

export default function DashboardLayout({ children, activeMenu = "dashboard", onUserLoaded }: DashboardLayoutProps) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentActiveMenu, setCurrentActiveMenu] = useState(activeMenu);

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const res = await fetch("/api/user/verify", {
                    method: "GET",
                    credentials: "include"
                });

                if (!res.ok) {
                    router.push("/user");
                    return;
                }

                const data = await res.json();
                if (data.authenticated && data.user) {
                    setUser(data.user);
                    if (onUserLoaded) {
                        onUserLoaded(data.user);
                    }
                } else {
                    router.push("/user");
                }
            } catch (err) {
                console.error("Auth verification error:", err);
                router.push("/user");
            } finally {
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, [router]);

    const handleLogout = async () => {
        try {
            await fetch("/api/user/logout", {
                method: "POST",
                credentials: "include"
            });
            router.push("/user");
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    const handleMenuClick = (menu: string, path: string) => {
        setCurrentActiveMenu(menu);
        router.push(path);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg"></span>
                    <p className="mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="drawer lg:drawer-open">
            <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

            <div className="drawer-content flex flex-col">
                {/* Navbar */}
                <div className="navbar bg-base-100 shadow-lg lg:hidden">
                    <div className="flex-none">
                        <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </label>
                    </div>
                    <div className="flex-1">
                        <span className="text-xl font-bold capitalize">{currentActiveMenu}</span>
                    </div>
                    <div className="flex-none">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-10">
                                    <span>{user.Username?.[0]?.toUpperCase()}</span>
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li className="menu-title"><span>{user.Username}</span></li>
                                <li><a onClick={() => handleMenuClick("profile", "/user/profile")}>Profile</a></li>
                                <li><a onClick={() => handleMenuClick("settings", "/user/settings")}>Settings</a></li>
                                <li><a onClick={handleLogout}>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-base-200 min-h-screen">
                    {children}
                </div>
            </div>

            {/* Sidebar */}
            <div className="drawer-side">
                <label htmlFor="sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                <aside className="bg-base-100 min-h-screen w-80">
                    {/* Logo */}
                    <div className="sticky top-0 z-20 bg-base-100 border-b border-base-300 p-4">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
                            <div>
                                <h2 className="font-bold text-lg">Game Panel</h2>
                                <p className="text-xs text-base-content/60">{user.Username}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <ul className="menu p-4 space-y-2">
                        <li>
                            <a
                                className={currentActiveMenu === "dashboard" ? "active" : ""}
                                onClick={() => handleMenuClick("dashboard", "/user/dashboard")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a
                                className={currentActiveMenu === "characters" ? "active" : ""}
                                onClick={() => handleMenuClick("characters", "/user/characters")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                My Characters
                            </a>
                        </li>
                        <li>
                            <a
                                className={currentActiveMenu === "shop" ? "active" : ""}
                                onClick={() => handleMenuClick("shop", "/user/shop")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Item Shop
                            </a>
                        </li>
                        <li>
                            <a
                                className={currentActiveMenu === "donate" ? "active" : ""}
                                onClick={() => handleMenuClick("donate", "/user/donate")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Donate
                            </a>
                        </li>
                        <li>
                            <a
                                className={currentActiveMenu === "rankings" ? "active" : ""}
                                onClick={() => handleMenuClick("rankings", "/user/rankings")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Rankings
                            </a>
                        </li>
                        <div className="divider"></div>
                        <li>
                            <a
                                className={currentActiveMenu === "profile" ? "active" : ""}
                                onClick={() => handleMenuClick("profile", "/user/profile")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Profile
                            </a>
                        </li>
                        <li>
                            <a
                                className={currentActiveMenu === "settings" ? "active" : ""}
                                onClick={() => handleMenuClick("settings", "/user/settings")}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </a>
                        </li>
                        <div className="divider"></div>
                        <li>
                            <a onClick={handleLogout} className="text-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </a>
                        </li>
                    </ul>

                    {/* User Info at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-base-200 border-t border-base-300">
                        <div className="flex items-center gap-3">
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-12">
                                    <span className="text-xl">{user.Username?.[0]?.toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold truncate">{user.Username}</p>
                                <p className="text-xs text-base-content/60 truncate">Member</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}