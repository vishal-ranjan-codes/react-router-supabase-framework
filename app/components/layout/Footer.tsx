import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="theme-bg-color-dark theme-border-color border-t mt-20">
      <div className="container-page py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <h3 className="theme-h5 mb-4">React Router + Supabase</h3>
            <p className="theme-fc-light text-sm">
              A comprehensive framework starter for building modern web
              applications on Cloudflare Workers.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="theme-fc-heading font-semibold mb-4">
              Getting Started
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="theme-fc-light hover:text-primary text-sm transition-colors"
                >
                  Introduction
                </Link>
              </li>
              <li>
                <Link
                  to="/design-system"
                  className="theme-fc-light hover:text-primary text-sm transition-colors"
                >
                  Design System
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="theme-fc-light hover:text-primary text-sm transition-colors"
                >
                  Installation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="theme-fc-heading font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/design-system"
                  className="theme-fc-light hover:text-primary text-sm transition-colors"
                >
                  Components
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="theme-fc-light hover:text-primary text-sm transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="theme-fc-light hover:text-primary text-sm transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="theme-fc-heading font-semibold mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-fc-light hover:text-primary text-sm transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-fc-light hover:text-primary text-sm transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://discord.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="theme-fc-light hover:text-primary text-sm transition-colors"
                >
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="theme-border-color border-t mt-8 pt-8">
          <p className="theme-fc-light text-sm text-center">
            © <span suppressHydrationWarning>{new Date().getFullYear()}</span>{" "}
            React Router + Supabase Framework. Built with ❤️ for developers.
          </p>
        </div>
      </div>
    </footer>
  );
}
