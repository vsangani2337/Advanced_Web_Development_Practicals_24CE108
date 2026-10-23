import { studentConfig } from "../data/studentConfig.js";

function Header({ name = studentConfig.name, tagline = studentConfig.tagline }) {
  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0] || "Student";
  const lastName = nameParts.slice(1).join(" ") || "Developer";

  return (
    <header id="home" className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Hello, I&apos;m</p>
        <p className="status-badge">
          <span /> Open to opportunities · {studentConfig.academicYear}
        </p>
        <h1>
          {firstName} <em>{lastName}</em>
        </h1>
        <p className="hero-tagline">{tagline}</p>
        <div className="hero-actions">
          <a className="button button-primary" href="#projects">
            View my work
          </a>
          <a className="button button-secondary" href={`mailto:${studentConfig.email}`}>
            Get in touch
          </a>
          <a className="button button-quiet" href={studentConfig.resumeUrl} download>
            Resume
          </a>
        </div>
        <div className="social-links" aria-label="Social links">
          <a href={studentConfig.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub">
            GH
          </a>
          <a href={studentConfig.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            in
          </a>
        </div>
      </div>
      <aside className="hero-console" aria-label="Current focus">
        <div className="console-bar">
          <span />
          <span />
          <span /> <small>currently-building.js</small>
        </div>
        <pre>
          <code>{`const focus = {
  building: "scalable full-stack apps",
  learning: "cloud + AI engineering",
  mindset: "clean code, resilient systems",
}`}</code>
        </pre>
        <p>
          <span className="console-cursor">_</span> Always curious, always iterating.
        </p>
      </aside>
    </header>
  );
}

export default Header;
