import { Link } from 'react-router'

export default function Logo() {
    return (
        <Link to="/" className="flex items-center justify-center">
            <div className="bg-primary theme-rounded w-10 h-10 flex items-center justify-center">
                <svg
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
    )
}
