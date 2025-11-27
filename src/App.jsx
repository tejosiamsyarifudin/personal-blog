import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./homepage.jsx";
import ArticlePage from "./article-page.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/articles/:articleId" element={<ArticlePage />} />
      </Routes>
    </BrowserRouter>
  );
}

