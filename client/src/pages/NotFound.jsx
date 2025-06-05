import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
    const location = useLocation();

    useEffect(() => {
        console.error("404 Error: Attempted to access:", location.pathname);
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
            <div className="text-center animate-fade-in">
                <h1 className="text-6xl font-extrabold text-muted-foreground mb-2">404</h1>
                <p className="text-xl text-muted-foreground mb-6">Page not found</p>
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
