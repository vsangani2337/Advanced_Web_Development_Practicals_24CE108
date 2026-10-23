import { NavLink } from "react-router-dom";
import { useState } from "react";
import { studentConfig } from "../data/studentConfig.js";

export default function NavBar({ darkMode, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="nav-bar" aria-label="Main navigation">
      <NavLink className="nav-brand" to="/" onClick={closeMenu}>
        {studentConfig.initials}<span>.</span>
      </NavLink>
      <button
        className="menu-toggle"
        type="button"
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
      </button>
      <div className={menuOpen ? "nav-links is-open" : "nav-links"}>
        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/" end onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/projects" onClick={closeMenu}>
          Projects
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/contact" onClick={closeMenu}>
          Contact
        </NavLink>
        <NavLink className={({ isActive }) => (isActive ? "active" : "")} to="/tasks" onClick={closeMenu}>
          Tasks
        </NavLink>
      </div>
      <div className="nav-tools">
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-pressed={darkMode}
        >
          <span aria-hidden="true">{darkMode ? "☼" : "☾"}</span>
        </button>
        <NavLink className="nav-contact" to="/contact">
          Let&apos;s connect
        </NavLink>
      </div>
    </nav>
  );
}
