import { useEffect, useState } from "react";

export default function Footer() {
  const [theme, setTheme] = useState(
    document.body.getAttribute("data-bs-theme") || "dark"
  );

  useEffect(() => {
    // Watch for changes to the body attribute
    const observer = new MutationObserver(() => {
      const newTheme = document.body.getAttribute("data-bs-theme") || "dark";
      setTheme(newTheme);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-bs-theme"] });
    return () => observer.disconnect();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`text-center py-4 mt-auto ${
        theme === "dark" ? "bg-dark text-light" : "bg-light text-dark"
      }`}
      style={{
        width: "100%",
        bottom: 0,
        borderTop:
          theme === "dark"
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.1)",
        transition: "background-color 0.4s ease, color 0.4s ease",
      }}
    >
      <div className="container">
        <p className="mb-2 fw-semibold">
          © {currentYear} E-Learning Platform. All rights reserved.
        </p>

        <div className="d-flex justify-content-center gap-3">
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={theme === "dark" ? "text-light" : "text-dark"}
          >
            <i className="bi bi-linkedin fs-5"></i>
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={theme === "dark" ? "text-light" : "text-dark"}
          >
            <i className="bi bi-github fs-5"></i>
          </a>
          <a
            href="mailto:support@elearning.com"
            className={theme === "dark" ? "text-light" : "text-dark"}
          >
            <i className="bi bi-envelope-fill fs-5"></i>
          </a>
        </div>

        <p
          className={`mt-3 small mb-0 ${
            theme === "dark" ? "text-secondary" : "text-muted"
          }`}
        >
          Built with ❤️ using React, Node.js & Bootstrap
        </p>
      </div>
    </footer>
  );
}
