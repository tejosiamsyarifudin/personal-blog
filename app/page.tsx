'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUser, logout } from "./utils/auth";

interface User {
  username: string;
  email: string;
}

export default function HomePage() {
  const [user, setUserState] = useState<User | null>(null);
  const [serverOnline, setServerOnline] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const getInitialTheme = () => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  useEffect(() => {
    setIsDarkTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    async function checkServer() {
      try {
        const res = await fetch("/api/health");
        setServerOnline(res.ok);
      } catch {
        setServerOnline(false);
      }
    }

    checkServer();
    const interval = setInterval(checkServer, 8000);
    return () => clearInterval(interval);


  }, []);

  useEffect(() => {
    setUserState(getUser());

    const syncUser = () => setUserState(getUser());
    window.addEventListener("storage", syncUser);
    window.addEventListener("userLogin", syncUser);
    window.addEventListener("userLogout", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userLogin", syncUser);
      window.removeEventListener("userLogout", syncUser);
    };


  }, []);

  useEffect(() => {
    const theme = isDarkTheme ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDarkTheme]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    audio.muted = true;

    const tryPlay = () => {
      audio
        .play()
        .then(() => {
          audio.muted = false;
          let v = 0;
          const fade = setInterval(() => {
            if (v < 0.5) {
              v += 0.02;
              audio.volume = v;
            } else {
              clearInterval(fade);
            }
          }, 100);
        })
        .catch(() => { });
    };

    tryPlay();

    const handleGesture = () => {
      tryPlay();
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
    };

    window.addEventListener("click", handleGesture);
    window.addEventListener("touchstart", handleGesture);

    return () => {
      window.removeEventListener("click", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
    };


  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !audioRef.current.muted;
    setIsMuted(audioRef.current.muted);
  };

  const handleLogout = () => {
    logout();
    setUserState(null);
    window.dispatchEvent(new Event("userLogout"));
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <audio ref={audioRef} src="/music.mp3" loop />

      <main className="flex-1 pb-32">
        <div
          className="relative bg-cover bg-top px-4 pt-4 pb-24"
          style={{ backgroundImage: "url('/background.jpeg')" }}
        >
          <div className="relative z-10 w-full max-w-6xl mx-auto">

            <div
              className="navbar fixed top-4 left-1/2 z-30 w-[min(90vw,1100px)] 
          -translate-x-1/2 shadow-lg rounded-full px-8"
              style={{
                backdropFilter: "blur(16px)",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div className="navbar-start">
                <Link
                  href="/"
                  className={`btn btn-ghost text-xl ${isDarkTheme
                    ? "text-white hover:bg-white/20"
                    : "text-black hover:bg-white/20"
                    }`}
                >
                  <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
                  Cyber World Adventure
                </Link>
              </div>

              <div className="navbar-end flex items-center gap-3">
                {/* Theme Toggle */}
                <label className="swap swap-rotate">
                  <input
                    type="checkbox"
                    className="theme-controller"
                    checked={isDarkTheme}
                    onChange={() => setIsDarkTheme((prev) => !prev)}
                    aria-label="Toggle dark mode"
                  />
                  <svg
                    className="swap-off h-6 w-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                  </svg>
                  <svg
                    className="swap-on h-6 w-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                  </svg>
                </label>

                {/* Avatar Dropdown */}
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className={`btn btn-ghost btn-circle avatar ${isDarkTheme ? "hover:bg-white/20" : "hover:bg-white/20"
                      }`}
                  >
                    <div className="w-10 rounded-full bg-primary flex items-center justify-center">
                      {user ? (
                        <span className="text-lg font-bold">
                          {user.username?.charAt(0).toUpperCase() || "U"}
                        </span>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className={`dropdown-content menu rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border ${isDarkTheme
                      ? "bg-black text-white border-white/10"
                      : "bg-white text-black border-black/10"
                      }`}
                  >
                    {user ? (
                      <>
                        <li className="menu-title">
                          <span>{user.username || user.email}</span>
                        </li>
                        <li>
                          <a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            Profile
                          </a>
                        </li>
                        <li>
                          <a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            Settings
                          </a>
                        </li>
                        <div className="divider my-1"></div>
                        <li>
                          <a onClick={handleLogout}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                              />
                            </svg>
                            Logout
                          </a>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <a href="/user">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                              />
                            </svg>
                            Login
                          </a>
                        </li>
                        <li>
                          <a href="/user/register">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                              />
                            </svg>
                            Register
                          </a>
                        </li>
                        <div className="divider"></div>
                        <li>
                          <a href="/admin">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                              />
                            </svg>
                            Admin
                          </a>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="relative px-6 pt-32 pb-10 sm:px-10">
              <div className="hero min-h-[75vh] w-full">
                <div className="hero-content text-center flex-col">
                  <h1 className="text-6xl text-white md:text-7xl font-extrabold leading-tight">
                    Cyber World Adventure
                  </h1>
                  <p className="py-6 text-white text-base-content/70 max-w-2xl text-lg">
                    Digimon Master Online | Your complete guide to adventures in
                    the digital world. Tips, strategies, and stories from Cyber
                    World filled with extraordinary digital creatures.
                  </p>
                  {/* Status Cards Row */}
                  <div className="flex flex-col md:flex-row gap-6 mb-10">
                    {/* User Status – Glass Card */}
                    <div className="hover-3d">
                      <div
                        className="w-64 py-6 rounded-2xl shadow-xl"
                        style={{
                          backdropFilter: "blur(16px)",
                          WebkitBackdropFilter: "blur(16px)",
                          background: "rgba(255, 255, 255, 0.01)",
                          border: "1px solid rgba(255, 255, 255, 0.25)",
                        }}
                      >
                        <div className="card-body text-center">
                          <h2 className="text-xl font-bold text-white drop-shadow">
                            USER STATUS
                          </h2>
                          {user ? (
                            <div className="mt-2 flex justify-center">
                              <span className="badge badge-success mt-3 text-sm px-4 py-2 text-center">
                                ONLINE
                              </span>
                            </div>
                          ) : (
                            <div className="mt-2 flex justify-center">
                              <span className="badge badge-error mt-3 text-sm px-4 py-2 text-center">
                                OFFLINE
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Server Status – Glass Card */}
                    <div className="hover-3d">
                      <div
                        className="w-64 py-6 rounded-2xl shadow-xl"
                        style={{
                          backdropFilter: "blur(16px)",
                          WebkitBackdropFilter: "blur(16px)",
                          background: "rgba(255, 255, 255, 0.01)",
                          border: "1px solid rgba(255, 255, 255, 0.25)",
                        }}
                      >
                        <div className="card-body text-center">
                          <h2 className="text-xl font-bold text-white drop-shadow">
                            SERVER STATUS
                          </h2>
                          {serverOnline ? (
                            <div className="mt-2 flex justify-center">
                              <span className="badge badge-success mt-3 text-sm px-4 py-2 text-center">
                                LIVE
                              </span>
                            </div>
                          ) : (
                            <div className="mt-2 flex justify-center">
                              <span className="badge badge-error mt-3 text-sm px-4 py-2 text-center">
                                OFFLINE
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <button
                    className="btn btn-primary btn-wide"
                    onClick={() =>
                      document
                        .getElementById("recent-articles")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Get Started {">"}
                  </button> */}
                </div>
              </div>

              {isDarkTheme && (
                <>
                  <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(147,51,234,0.5),_transparent_65%)] blur-[20px]" />
                  <div className="pointer-events-none absolute bottom-[-3rem] left-1/2 h-48 w-[120%] -translate-x-1/2 rounded-full bg-purple-500/40 blur-[120px]" />
                </>
              )}
            </div>

          </div>
        </div>
      </main>

      <footer className="border-t border-base-300 bg-base-100 p-10 text-center">
        <p className="text-base-content/60">
          © 2025 Cyber World Adventure
        </p>
      </footer>
    </div>


  );
}