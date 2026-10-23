import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="content-section not-found-page">
      <div className="section-heading">
        <p className="eyebrow">404 Error</p>
        <h1>Page not found.</h1>
      </div>
      <div className="not-found-body">
        <p className="about-summary">
          The requested route does not exist or has been moved. Use the navigation bar above or return to the home page.
        </p>
        <Link to="/" className="button button-primary">
          Return to Home
        </Link>
      </div>
    </section>
  );
}
