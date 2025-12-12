import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { articles } from "./data/articles.js";

export default function ArticlePage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const article = articles.find((item) => item.id === articleId);

  if (!article) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-6 text-center px-6">
        <h1 className="text-4xl font-bold">Article not found</h1>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back to home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <header className="bg-base-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-primary">
            ← Back to articles
          </Link>
          <span className="badge badge-outline uppercase tracking-wide">
            {article.category}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
        <div>
          <p className="text-sm text-base-content/60">
            {article.date} · {article.readTime}
          </p>
          <h1 className="text-5xl font-bold mt-2">{article.title}</h1>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-xl">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div className="prose prose-lg max-w-none text-base-content/80">
          {article.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </main>
    </div>
  );
}
