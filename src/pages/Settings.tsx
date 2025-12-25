import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { ArrowLeft, Moon, Sun, HelpCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";

const Settings = () => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto w-full px-4 py-4 sm:p-5 space-y-4 sm:space-y-5">
        <header className="flex items-center gap-3 mb-1 sm:mb-2">
          <Button variant="ghost" size="icon" className="-ml-1 hover-scale" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground flex-1">
            Settings
          </h1>
        </header>

        <Card className="p-3 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Theme</p>
              <p className="text-sm text-muted-foreground">Toggle light / dark mode</p>
            </div>
            <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Language</p>
              <p className="text-sm text-muted-foreground">Switch between English and Bangla</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("en")}
              >
                EN
              </Button>
              <Button
                variant={language === "bn" ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage("bn")}
              >
                BN
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-left w-full sm:w-auto">
            <p className="font-medium text-foreground">Help & guidance</p>
            <p className="text-sm text-muted-foreground">How to use MaaSathi safely</p>
          </div>
          <Link to="/help" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto gap-2 hover-scale">
              <HelpCircle className="w-4 h-4" />
              Open help
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
