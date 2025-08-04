import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import notFoundAnimation from "../assets/notFoundAnimation.svg";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Attempted to access:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center space-y-6 animate-in fade-in-50 duration-700">
        {/* SVG animation */}
        <embed
          type="image/svg+xml"
          src={notFoundAnimation}
          className="w-72 h-72 md:w-80 md:h-80 drop-shadow-lg"
        />

        {/* Heading */}
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Oops! Page not found
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground max-w-md">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>

        {/* Home link */}
        <Link
          to="/"
          className="text-primary hover:underline text-base font-medium transition-colors"
        >
          ← Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
