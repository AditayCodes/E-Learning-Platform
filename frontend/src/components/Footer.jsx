import { useEffect, useState } from "react";

export default function Footer() {
  const [theme, setTheme] = useState(
    document.body.getAttribute("data-bs-theme") || "dark"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.body.getAttribute("data-bs-theme") || "dark");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-bs-theme"] });
    return () => observer.disconnect();
  }, []);

  const currentYear = new Date().getFullYear();

  // Classes for dark/light mode
  const bgClass = theme === "dark" ? "bg-dark" : "bg-light";
  const textClass = theme === "dark" ? "text-white" : "text-dark";
  const secondaryText = theme === "dark" ? "text-light" : "text-muted"; // brighter for dark mode

  return (
    <footer
      className={`text-center py-4 mt-auto ${bgClass} ${textClass}`}
      style={{
        width: "100%",
        bottom: 0,
        borderTop:
          theme === "dark"
            ? "1px solid rgba(255,255,255,0.2)"
            : "1px solid rgba(0,0,0,0.1)",
        transition: "background-color 0.4s ease, color 0.4s ease",
      }}
    >
      <div className="container">
        <p className={`mb-2 fw-semibold ${textClass}`}>
          © {currentYear} E-Learning Platform. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="d-flex justify-content-center gap-3 mb-2">
          <a
            href="https://www.linkedin.com/in/aditay-sharma/"
            target="_blank"
            rel="noopener noreferrer"
            className={textClass}
            title="LinkedIn"
          >
            <i className="bi bi-linkedin fs-5"></i>
          </a>
          <a
            href="https://github.com/AditayCodes"
            target="_blank"
            rel="noopener noreferrer"
            className={textClass}
            title="GitHub"
          >
            <i className="bi bi-github fs-5"></i>
          </a>
          <a
            href="mailto:support@elearning.com"
            className={textClass}
            title="Email Support"
          >
            <i className="bi bi-envelope-fill fs-5"></i>
          </a>
        </div>

        {/* ✅ Fixed last line visibility */}
        <p className={`mt-3 small mb-0 ${secondaryText}`}>
          Built with ❤️ by{" "}
          <a
            href="https://www.linkedin.com/in/aditay-sharma/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${textClass} text-decoration-underline`}
          >
            Aditay Sharma
          </a>{" "}
          using React, Node.js & Bootstrap
        </p>
      </div>
    </footer>
  );
}
