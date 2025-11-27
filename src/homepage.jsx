import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { articles } from "./data/articles.js";

export default function HomePage() {
  const getInitialTheme = () => {
    if (typeof window === "undefined") return false;
    const storedTheme = window.localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isDarkTheme, setIsDarkTheme] = useState(getInitialTheme);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const theme = isDarkTheme ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem("theme", theme);
  }, [isDarkTheme]);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <main className="flex-1 pb-32">
        <div
          className="preview relative overflow-hidden bg-cover bg-top px-4 pt-4 pb-24"
          style={{ backgroundImage: "url('/background.jpeg')" }}
        >
          {!isDarkTheme && (
            <div className="absolute inset-0 z-0 bg-black/40"></div>
          )}
          <div className="absolute inset-0 z-0 bg-base-200/60 mix-blend-multiply" />
          <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col gap-10">
            <div
              className={`navbar fixed top-4 left-1/2 z-30 w-[min(90vw,1100px)] -translate-x-1/2 shadow-sm rounded-full px-8 transition-colors duration-300 ${
                isDarkTheme ? "bg-white text-black" : "bg-black/90 text-white"
              }`}
            >
              <div className="navbar-start">
                <div className="dropdown">
                  <div
                    tabIndex={0}
                    role="button"
                    className={`btn btn-ghost lg:hidden ${
                      isDarkTheme ? "text-black" : "text-white"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {" "}
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h8m-8 6h16"
                      />{" "}
                    </svg>
                  </div>
                  <ul
                    tabIndex="-1"
                    className={`menu menu-sm dropdown-content rounded-box z-10 mt-3 w-52 p-2 shadow border ${
                      isDarkTheme
                        ? "bg-white text-black border-black/10"
                        : "bg-black text-white border-white/10"
                    }`}
                  >
                    <li>
                      <a>Item 1</a>
                    </li>
                    <li>
                      <a>Parent</a>
                      <ul
                        className={`p-2 ${
                          isDarkTheme
                            ? "bg-white text-black"
                            : "bg-black text-white"
                        }`}
                      >
                        <li>
                          <a>Submenu 1</a>
                        </li>
                        <li>
                          <a>Submenu 2</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a>Item 3</a>
                    </li>
                  </ul>
                </div>
                <a
                  className={`btn btn-ghost text-xl ${
                    isDarkTheme
                      ? "text-black hover:bg-white/20 hover:text-black"
                      : "text-white hover:bg-white/20 hover:text-white"
                  }`}
                >
                  Jason Chaskin
                </a>
              </div>
              <div className="navbar-center hidden lg:flex">
                <ul
                  className={`menu menu-horizontal px-1 ${
                    isDarkTheme ? "text-black" : "text-white"
                  }`}
                >
                  <li>
                    <a>Item 1</a>
                  </li>
                  <li>
                    <details>
                      <summary>Parent</summary>
                      <ul
                        className={`p-2 ${
                          isDarkTheme
                            ? "bg-white text-black"
                            : "bg-black text-white"
                        }`}
                      >
                        <li>
                          <a>Submenu 1</a>
                        </li>
                        <li>
                          <a>Submenu 2</a>
                        </li>
                      </ul>
                    </details>
                  </li>
                  <li>
                    <a>Item 3</a>
                  </li>
                </ul>
              </div>
              <div
                className={`navbar-end ${
                  isDarkTheme ? "text-black" : "text-white"
                }`}
              >
                <label className="swap swap-rotate">
                  {/* this hidden checkbox controls the state */}
                  <input
                    type="checkbox"
                    className="theme-controller"
                    checked={isDarkTheme}
                    onChange={() => setIsDarkTheme((prev) => !prev)}
                    aria-label="Toggle dark mode"
                  />

                  {/* sun icon */}
                  <svg
                    className="swap-off h-6 w-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                  </svg>

                  {/* moon icon */}
                  <svg
                    className="swap-on h-6 w-6 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                  </svg>
                </label>
              </div>
            </div>

            <div className="relative px-6 pt-32 pb-10 sm:px-10">
              <div className="hero min-h-[75vh] w-full">
                <div className="hero-content text-center flex-col">
                  <h1 className="text-6xl text-white md:text-7xl font-extrabold leading-tight">
                    Welcome to MyBlog
                  </h1>
                  <p className="py-6 text-white text-base-content/70 max-w-2xl text-lg">
                    ethereum foundation | opinions are my own but more than
                    likely they come from Vitalik’s blog
                    https://paragraph.xyz/@chaskin
                  </p>
                  <button
                    className="btn btn-primary btn-wide"
                    onClick={() =>
                      document
                        .getElementById("recent-articles")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Get Started {">"}
                  </button>
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

        {/* Recent Articles */}
        <div id="recent-articles" className="max-w-6xl mx-auto px-6 mt-24">
          <h2 className="text-4xl font-bold mb-10">Recent Articles</h2>
          <div className="grid gap-10 md:grid-cols-2">
            {articles.map((article) => (
              <div className="hover-3d" key={article.id}>
                <div className="card card-side bg-base-100 shadow-lg rounded-2xl">
                  <figure className="relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-88 h-full object-cover"
                    />
                  </figure>
                  <span className="badge badge-primary absolute left-3 top-3 text-xs uppercase tracking-wide shadow-md">
                    {article.category}
                  </span>
                  <div className="card-body">
                    <div className="text-sm text-base-content/60 flex items-center gap-4">
                      <span className="inline-flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 12H6m6-6v12M5.25 5.25h13.5v13.5H5.25z"
                          />
                        </svg>
                        {article.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="card-title text-2xl font-semibold mt-3">
                      {article.title}
                    </h3>
                    <p className="text-base-content/70">{article.summary}</p>
                    <div className="card-actions justify-end">
                      <Link
                        className="btn btn-outline"
                        to={`/articles/${article.id}`}
                      >
                        Read article {">"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURED */}
        <div className="max-w-6xl mx-auto px-6 mt-24">
          <h2 className="text-4xl font-bold text-center mb-10">Featured</h2>
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div className="hover-3d">
              <figure className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl">
                <span className="badge badge-secondary absolute right-6 top-6 text-xs uppercase tracking-wide shadow-lg">
                  Spotlight
                </span>
                <img
                  src={articles[0].image}
                  alt={articles[0].title}
                  className="w-full h-full object-cover"
                />
              </figure>
            </div>
            <div className="card bg-base-100 shadow-xl rounded-2xl">
              <div className="card-body space-y-4">
                <div className="text-sm text-base-content/60 flex items-center gap-4">
                  <span className="inline-flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 12H6m6-6v12M5.25 5.25h13.5v13.5H5.25z"
                      />
                    </svg>
                    {articles[0].date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {articles[0].readTime}
                  </span>
                </div>
                <h3 className="text-4xl font-bold leading-tight">
                  {articles[0].title}
                </h3>
                <p className="text-base-content/80 text-lg leading-relaxed">
                  {articles[0].summary}
                </p>
                <div className="card-actions justify-start">
                  <Link
                    className="btn btn-outline"
                    to={`/articles/${articles[0].id}`}
                  >
                    Read article {">"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Articles */}
        <div className="max-w-6xl mx-auto px-6 mt-24">
          <h2 className="text-4xl font-bold mb-10">Top Articles</h2>
          <div className="grid gap-10 md:grid-cols-2">
            {articles.map((article) => (
              <div className="hover-3d" key={`top-${article.id}`}>
                <div className="card card-side bg-base-100 shadow-lg rounded-2xl">
                  <figure className="relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-88 h-full object-cover"
                    />
                  </figure>
                  <span className="badge badge-accent absolute left-3 top-3 text-xs uppercase tracking-wide shadow-md">
                    {article.category}
                  </span>
                  <div className="card-body">
                    <div className="text-sm text-base-content/60 flex items-center gap-4">
                      <span className="inline-flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18 12H6m6-6v12M5.25 5.25h13.5v13.5H5.25z"
                          />
                        </svg>
                        {article.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6v6l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="card-title text-2xl font-semibold mt-3">
                      {article.title}
                    </h3>
                    <p className="text-base-content/70">{article.summary}</p>
                    <div className="card-actions justify-end">
                      <Link
                        className="btn btn-outline"
                        to={`/articles/${article.id}`}
                      >
                        Read article {">"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-base-300 bg-base-100 p-10 text-center">
        <p className="text-base-content/60">
          © 2025 Jason chaskin | ethereum foundation
        </p>
      </footer>
    </div>
  );
}
