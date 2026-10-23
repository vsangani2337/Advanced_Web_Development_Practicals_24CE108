import "./App.css";
import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import NavBar from "./components/NavBar.jsx";
import LoadingFallback from "./components/LoadingFallback.jsx";
import { projects } from "./data/portfolio.js";

// Lazy loading route-based components
const Home = lazy(() => import("./pages/Home.jsx"));
const Projects = lazy(() => import("./components/Projects.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const TaskManager = lazy(() => import("./pages/TaskManager.jsx"));
const NotFound = lazy(() => import("./pages/NotFound.jsx"));

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("portfolio-theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("portfolio-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <div className="app">
      <NavBar
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((isDark) => !isDark)}
      />
      <main>
        <Suspense fallback={<LoadingFallback message="Loading page..." />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects projectList={projects} />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default App;
