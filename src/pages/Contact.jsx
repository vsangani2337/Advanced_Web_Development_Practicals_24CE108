import { useState } from "react";
import { studentConfig } from "../data/studentConfig.js";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setMessage("");
  };

  return (
    <section className="content-section contact-page">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h1>
          Let&apos;s make it<br />
          <em>happen.</em>
        </h1>
      </div>
      <div className="contact-page__content">
        <p className="about-summary">
          Have an inquiry, project idea, or simply want to connect? Send a message and I&apos;ll get back to you promptly.
        </p>

        {submitted && (
          <p className="task-success" role="status">
            Thank you! Your message has been sent successfully.
          </p>
        )}

        <form className="contact-form contact-page__form" onSubmit={handleSubmit}>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" placeholder="Your name" required />

          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" placeholder="you@example.com" required />

          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell me about your idea or question..."
            maxLength={500}
            rows={5}
            required
          />
          <p className="character-count">{message.length}/500 characters</p>
          <button className="button button-primary" type="submit">
            Send message
          </button>
        </form>

        <button
          className="details-toggle"
          type="button"
          onClick={() => setShowDetails((visible) => !visible)}
          aria-expanded={showDetails}
        >
          {showDetails ? "Hide direct contact details" : "Show direct contact details"}
        </button>

        {showDetails && (
          <div className="contact-details">
            <a href={`mailto:${studentConfig.email}`}>{studentConfig.email}</a>
            <a href={`tel:${studentConfig.phone.replace(/\s/g, "")}`}>{studentConfig.phone}</a>
            <p className="muted">{studentConfig.location}</p>
          </div>
        )}
      </div>
    </section>
  );
}
