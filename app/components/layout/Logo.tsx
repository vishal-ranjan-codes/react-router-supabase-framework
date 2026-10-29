import { Link } from "react-router";

export default function Logo() {
  return (
    <Link to="/" className="flex items-center justify-center">
      <span className="sr-only">Home</span>
      <div className="bg-primary rounded-lg w-10 h-10 flex items-center justify-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-6 h-6"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
    </Link>
  );
}
