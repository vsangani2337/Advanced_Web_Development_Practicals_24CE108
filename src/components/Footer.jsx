import { studentConfig } from "../data/studentConfig.js";

function Footer({ email = studentConfig.email, phone = studentConfig.phone }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div>
        <p className="eyebrow">Have a project or opportunity?</p>
        <h2>
          Let&apos;s make it<br />
          <em>happen.</em>
        </h2>
      </div>
      <div className="footer-contact">
        <a href={`mailto:${email}`}>{email}</a>
        <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
        <div className="footer-socials">
          <a href={studentConfig.githubUrl} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={studentConfig.linkedinUrl} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
        <p>© {currentYear} {studentConfig.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
