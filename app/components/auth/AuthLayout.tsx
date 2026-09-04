import { Link } from "react-router";
import Logo from "~/components/layout/Logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footer?: React.ReactNode;
}

export function AuthLayout({ children, title, description, footer }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center theme-bg-color px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Logo />
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="theme-h2">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {children}
            {footer && <div className="mt-4">{footer}</div>}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm theme-fc-light">
          <Link to="/" className="text-primary hover:underline">
            &larr; Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
