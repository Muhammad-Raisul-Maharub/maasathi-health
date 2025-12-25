import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import ThemeToggle from "@/components/ThemeToggle";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="text-center space-y-4 max-w-md mx-auto p-6">
        <h1 className="mb-2 text-5xl font-bold text-foreground">404</h1>
        <p className="text-xl text-muted-foreground">{t('notFound.description')}</p>
        <div className="text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-2 inline-block mt-2">
          <p className="font-medium mb-1">Light vs Dark mode</p>
          <p>Use light mode in bright rooms; use dark mode at night to reduce glare.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md border border-border bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
