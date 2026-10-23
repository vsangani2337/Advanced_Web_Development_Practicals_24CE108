import { studentConfig } from "../data/studentConfig.js";

function About({
  education = `B.Tech in ${studentConfig.department || "Computer Engineering"}`,
  university = studentConfig.university,
  summary = studentConfig.bio,
  experience = "Full-Stack Web Development · Academic & Project Experience",
}) {
  return (
    <section id="about" className="content-section about-section">
      <div className="section-heading">
        <p className="eyebrow">01 / About me</p>
        <h2>
          Curious mind.<br />
          <em>Practical builder.</em>
        </h2>
      </div>
      <div className="about-content">
        <p className="about-summary">{summary}</p>
        <div className="stats-row">
          <div>
            <strong>Sem {studentConfig.semester}</strong>
            <span>Active Student</span>
          </div>
          <div>
            <strong>03+</strong>
            <span>Major Projects</span>
          </div>
          <div>
            <strong>100+</strong>
            <span>Problems Solved</span>
          </div>
          <div>
            <strong>Full-Stack</strong>
            <span>MERN Stack</span>
          </div>
        </div>
        <div className="timeline">
          <div className="timeline-item">
            <span className="timeline-year">2024 — 2027</span>
            <div>
              <p className="detail-label">Education</p>
              <p>{education}</p>
              <p className="muted">{university} · Faculty of {studentConfig.faculty}</p>
            </div>
          </div>
          <div className="timeline-item">
            <span className="timeline-year">2026 — Present</span>
            <div>
              <p className="detail-label">Focus Area</p>
              <p>{experience}</p>
              <p className="muted">React, Node.js, Express, MongoDB, Docker & Modern Frameworks</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
